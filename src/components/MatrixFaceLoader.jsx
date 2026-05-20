// src/components/MatrixFaceLoader.jsx
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MatrixFaceLoader({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Font layout configurations
    const fontSize = 11;
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+=:?⊙⚡";

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Grid tracks
    const columns = Math.ceil(canvas.width / fontSize);
    const drops = Array(columns).fill(0);

    // Initialize portrait processing image
    const img = new Image();
    img.src = "/photo.png";

    let imagePixels = null;
    let imgW = 0,
      imgH = 0;

    img.onload = () => {
      // Create offscreen image mapping engine buffer
      const buffer = document.createElement("canvas");
      const bCtx = buffer.getContext("2d");

      // Calculate scale to center your portrait on screen without losing scale aspect ratios
      const scale = Math.min(
        (canvas.width * 0.75) / img.naturalWidth,
        (canvas.height * 0.75) / img.naturalHeight,
      );
      imgW = Math.floor(img.naturalWidth * scale);
      imgH = Math.floor(img.naturalHeight * scale);

      buffer.width = canvas.width;
      buffer.height = canvas.height;

      // Center the processed coordinates locally
      const startX = (canvas.width - imgW) / 2;
      const startY = (canvas.height - imgH) / 2;

      bCtx.drawImage(img, startX, startY, imgW, imgH);
      try {
        imagePixels = bCtx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (e) {
        console.error(
          "Cross-origin image loading policies prevented custom ASCII tracing",
          e,
        );
      }
    };

    const drawMatrix = () => {
      // Dynamic fade overlay effect to keep stream trailing look clean
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y < canvas.height) {
          let alpha = 0.12; // Base transparency level for raw empty areas

          // Look if current running stream position intersects with face data pixel bounds
          if (imagePixels) {
            const pixelIndex =
              (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
            const r = imagePixels.data[pixelIndex];
            const g = imagePixels.data[pixelIndex + 1];
            const b = imagePixels.data[pixelIndex + 2];
            const a = imagePixels.data[pixelIndex + 3];

            if (a > 10) {
              // Convert pixel RGB coordinates to accurate digital brightness value
              const brightness = (r + g + b) / 3;
              // Higher contrast multiplier so face shapes and glasses stand out vibrantly
              alpha = Math.max(0.12, (brightness / 255) * 0.85);
            }
          }

          // Randomize character cascading generation arrays
          const text = chars[Math.floor(Math.random() * chars.length)];

          // Render character stream lines with computed glowing matrix shades
          ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
          ctx.fillText(text, x, y);

          // Add extra glowing white heads to leading trails for authentic hacker visual feel
          if (Math.random() > 0.975) {
            ctx.fillStyle = `rgba(180, 255, 200, ${alpha * 1.2})`;
            ctx.fillText(text, x, y);
          }
        }

        // Advance stream drop downwards or loop back seamlessly
        if (y > canvas.height && Math.random() > 0.96) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }

      animationFrameId = requestAnimationFrame(drawMatrix);
    };

    drawMatrix();

    // Trigger phase step handover smoothly after loader screen payload finishes execution
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black overflow-hidden select-none z-20"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
        <div className="text-[#00ff41] font-mono tracking-[0.6em] text-xs md:text-sm uppercase animate-pulse drop-shadow-[0_0_8px_rgba(0,255,65,0.4)] font-bold bg-black/70 px-6 py-3 border border-[#00ff41]/20">
          [[ PARSING_TARGET_CORE_BIOMETRICS ]]
        </div>
      </div>
    </motion.div>
  );
}
