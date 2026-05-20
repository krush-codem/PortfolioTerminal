import { useEffect, useRef } from "react";

/* ---------------- CONFIG ---------------- */
const IS_MOBILE =
  typeof window !== "undefined" &&
  ("ontouchstart" in window || navigator.maxTouchPoints > 0);

// clamp DPR → BIGGEST lag fix
const DPR = Math.min(window.devicePixelRatio || 1, 1.25);

export default function SplashCursor() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (IS_MOBILE) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    /* ---------------- CANVAS SETUP ---------------- */
    const ctx = canvas.getContext("2d", { alpha: true });

    const resize = () => {
      const w = Math.floor(window.innerWidth * DPR);
      const h = Math.floor(window.innerHeight * DPR);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
    };

    resize();
    window.addEventListener("resize", resize);

    /* ---------------- FLUID STATE ---------------- */
    const particles = [];
    const MAX_PARTS = 120;

    const mouse = {
      x: 0,
      y: 0,
      px: 0,
      py: 0,
      active: false,
    };

    /* ---------------- EVENTS ---------------- */
    let lastMove = 0;

    const onMove = (e) => {
      const now = performance.now();
      if (now - lastMove < 16) return; // throttle ~60fps
      lastMove = now;

      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX * DPR;
      mouse.y = e.clientY * DPR;
      mouse.active = true;

      spawn();
    };

    window.addEventListener("mousemove", onMove);

    /* ---------------- PARTICLES ---------------- */
    function spawn() {
      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;

      particles.push({
        x: mouse.x,
        y: mouse.y,
        vx: dx * 0.12,
        vy: dy * 0.12,
        life: 1,
        r: 255,
        g: 40,
        b: 40,
      });

      if (particles.length > MAX_PARTS) {
        particles.shift();
      }
    }

    /* ---------------- RENDER LOOP ---------------- */
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.015;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.life})`;
        ctx.arc(p.x, p.y, 14 * p.life, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    /* ---------------- CLEANUP ---------------- */
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  if (IS_MOBILE) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  );
}
