//ProfileView.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaFileAlt } from "react-icons/fa";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import SEO from "./SEO";

export default function ProfileView() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Scroll-based parallax for title + portrait
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroTitleY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-black text-white overflow-x-hidden no-scrollbar"
    >
      {/* Scoped injection styling block to cleanly strip out browser scroll bars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* ========================== HERO SECTION ========================== */}
      <section className="relative w-full bg-black text-white overflow-hidden flex flex-col">
        {/* BACKGROUND: DIAGONAL STRIPS + HUGE NAME */}
        <div className="pointer-events-none absolute inset-0 z-0 pt-16">
          {/* diagonal strips */}
          <div className="absolute inset-0 flex items-center justify-center z-0 md:z-auto">
            {/* top-left → bottom-right */}
            <div className="w-[220%] h-8 md:h-10 rotate-[16deg]">
              <div className="strip bg-red-600 w-full h-full flex items-center">
                <div className="strip-inner text-[9px] md:text-[11px] tracking-[0.35em] text-white">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={`diag-a-${i}`} className="px-4">
                      🕶️ HKB • DEV • PORTFOLIO • 2025
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* bottom-left → top-right */}
            <div className="w-[220%] h-8 md:h-10 -rotate-[16deg] absolute">
              <div className="strip bg-red-600 w-full h-full flex items-center">
                <div className="strip-inner-reverse text-[9px] md:text-[11px] tracking-[0.35em] text-white">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={`diag-b-${i}`} className="px-4">
                      🕶️ HKB • DEV • PORTFOLIO • 2025
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* huge name */}
          <motion.div
            style={{ y: heroTitleY }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.6, once: false }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute inset-x-0 top-1/4 -translate-y-[4vw] text-center leading-none z-0 md:z-auto"
          >
            <span className="block text-[16vw] md:text-[13vw] font-extrabold uppercase tracking-tight text-white">
              HAREKRUSHNA
            </span>
            <span className="block text-[18vw] md:text-[13vw] font-extrabold uppercase tracking-tight -mt-[4vw] md:-mt-[3vw] text-white">
              BEHERA
            </span>
          </motion.div>
        </div>

        {/* TOP NAV */}
        <div className="relative z-30 flex items-center justify-between px-6 md:px-12 lg:px-20 pt-6 w-full">
          <SEO
            title="Profile"
            description="Explore my professional profile, including technical skills, projects, and contact information."
          />

          {/* LEFT CORNER: CINE•PORTFOLIO + PULSING GLOW DOT */}
          <div className="flex items-center gap-2 text-[10px] tracking-[0.35em] text-white uppercase font-mono whitespace-nowrap select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse" />
            <span>CINE•PORTFOLIO</span>
          </div>

          {/* RIGHT CORNER: RESUME */}
          <div className="flex justify-end">
            <a
              href="https://drive.google.com/file/d/1eSka3wgpO6k5RbBYNnkmxFg6mUfM_eYL/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              aria-label="Open resume"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-red-500 hover:text-black transition-colors"
            >
              <FaFileAlt className="text-red-400" />
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono">
                Resume
              </span>
            </a>
          </div>
        </div>

        {/* CENTER AREA – portrait cutout */}
        <div className="relative z-10 flex-1 flex items-end justify-center pt-16">
          <motion.div className="relative flex items-center justify-center pb-0">
            {/* red glow behind portrait */}
            <div className="absolute -inset-20 rounded-full bg-red-600/40 blur-3xl -z-10" />

            {/* floating cutout image */}
            <img
              src="/krush3s.gif"
              alt="Harekrushna Behera"
              className="relative z-10 w-[280px] md:w-[340px] lg:w-[500px] object-contain"
            />
          </motion.div>
        </div>

        {/* BOTTOM MOVING STRIP */}
        <div className="strip bg-red-600 h-8 md:h-10 flex items-center relative z-20">
          <div className="strip-inner text-[9px] md:text-[11px] tracking-[0.35em] text-white">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={`bottom-${i}`} className="px-4">
                🕶️ HK • DEV • PORTFOLIO • 2025
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CONTENT SECTIONS ========================== */}
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
