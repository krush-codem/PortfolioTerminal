// src/components/RippleCanvas.jsx
import React, { useState, useEffect, useRef } from "react";

export default function RippleCanvas() {
  const canvasRef = useRef(null);
  const lastClickTime = useRef(0);
  const activeRipple = useRef(null);
  const profileImg = useRef(null);
  const [naturalDimensions, setNaturalDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // --- SCREEN-SPECIFIC IMAGE SELECTION ---
    const img = new Image();

    // Choose the photo source asset based on current screen layout size
    if (window.innerWidth < 768) {
      img.src = "/photo.png"; // Tailored portrait asset for mobile devices
    } else {
      img.src = "/la-load.png"; // Standard wide asset for desktops & tablets
    }

    img.onload = () => {
      profileImg.current = img;
      setNaturalDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (activeRipple.current && naturalDimensions.width > 0) {
        const ripple = activeRipple.current;
        const elapsed = (performance.now() - ripple.startTime) / 1000;

        const waveSpeed = 380;
        const waveLength = 90;
        const currentRadius = elapsed * waveSpeed;
        const maxRadius = Math.max(canvas.width, canvas.height) * 1.2;
        const lifeRatio = 1 - currentRadius / maxRadius;

        if (lifeRatio > 0) {
          // --- RESPONSIVE CSS-LIKE "OBJECT-FIT: COVER" SCALE ---
          const canvasRatio = canvas.width / canvas.height;
          const imgRatio = naturalDimensions.width / naturalDimensions.height;

          let renderW, renderH;

          if (canvasRatio > imgRatio) {
            renderW = canvas.width;
            renderH = canvas.width / imgRatio;
          } else {
            renderH = canvas.height;
            renderW = canvas.height * imgRatio;
          }

          // Compute centered anchor positions
          const imgX = (canvas.width - renderW) / 2;
          const imgY = (canvas.height - renderH) / 2;

          if (profileImg.current) {
            const buffer = document.createElement("canvas");
            buffer.width = canvas.width;
            buffer.height = canvas.height;
            const bCtx = buffer.getContext("2d");

            bCtx.imageSmoothingEnabled = true;
            bCtx.imageSmoothingQuality = "high";

            bCtx.drawImage(profileImg.current, imgX, imgY, renderW, renderH);

            try {
              const srcData = bCtx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height,
              );
              const outData = bCtx.createImageData(canvas.width, canvas.height);

              for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                  const dx = x - ripple.x;
                  const dy = y - ripple.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);

                  let srcX = x;
                  let srcY = y;

                  if (
                    dist < currentRadius &&
                    dist > currentRadius - waveLength
                  ) {
                    const waveIntensity = Math.sin(
                      (dist - currentRadius) * ((Math.PI * 2) / waveLength),
                    );
                    const falloff =
                      (1 - (currentRadius - dist) / waveLength) *
                      lifeRatio *
                      24;

                    if (dist > 0) {
                      srcX += Math.round((dx / dist) * waveIntensity * falloff);
                      srcY += Math.round((dy / dist) * waveIntensity * falloff);
                    }
                  }

                  srcX = Math.max(0, Math.min(canvas.width - 1, srcX));
                  srcY = Math.max(0, Math.min(canvas.height - 1, srcY));

                  const targetIdx = (y * canvas.width + x) * 4;
                  const sourceIdx = (srcY * canvas.width + srcX) * 4;

                  outData.data[targetIdx] = srcData.data[sourceIdx];
                  outData.data[targetIdx + 1] = srcData.data[sourceIdx + 1];
                  outData.data[targetIdx + 2] = srcData.data[sourceIdx + 2];
                  outData.data[targetIdx + 3] =
                    srcData.data[sourceIdx + 3] * lifeRatio * 0.75;
                }
              }

              bCtx.putImageData(outData, 0, 0);

              ctx.save();
              ctx.beginPath();
              ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(buffer, 0, 0);
              ctx.restore();
            } catch (e) {
              ctx.save();
              ctx.globalAlpha = lifeRatio * 0.6;
              ctx.beginPath();
              ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(profileImg.current, imgX, imgY, renderW, renderH);
              ctx.restore();
            }
          }

          ctx.save();
          ctx.strokeStyle = `rgba(0, 255, 65, ${lifeRatio * 0.5})`;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(0, 255, 65, 0.4)";
          ctx.beginPath();
          ctx.arc(ripple.x, ripple.y, currentRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        } else {
          activeRipple.current = null;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleTrigger = (e) => {
      const currentTime = performance.now();
      if (currentTime - lastClickTime.current < 2500) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = canvas.getBoundingClientRect();

      activeRipple.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
        startTime: currentTime,
      };
      lastClickTime.current = currentTime;
    };

    window.addEventListener("click", handleTrigger);
    window.addEventListener("touchstart", handleTrigger, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleTrigger);
      window.removeEventListener("touchstart", handleTrigger);
    };
  }, [naturalDimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-30 pointer-events-none"
    />
  );
}
