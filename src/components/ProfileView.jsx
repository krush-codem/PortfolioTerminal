import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithub, FaFileAlt } from "react-icons/fa";
import SkillsSection from "./SkillsSection"; // adjust path if needed
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";

export default function ProfileView({ onBack }) {
  const containerRef = useRef(null);

  // Scroll-based parallax for title + portrait
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroTitleY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroImageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const heroImageScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  const active = true; // used for small fade-in, can be wired to intro later

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-black text-white overflow-x-hidden"
    >
      {/* ========================== HERO SECTION ========================== */}
      <section className="relative w-full bg-black text-white overflow-hidden flex flex-col">
        {/* BACKGROUND: DIAGONAL STRIPS + HUGE NAME */}
        {/* Added pt-16 to push content down on all screens */}
        <div className="pointer-events-none absolute inset-0 z-0 pt-16">
          {/* diagonal strips - z-0 on small screens to go behind portrait */}
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

          {/* huge name - z-0 on small screens to go behind portrait */}
          <motion.div
            // parallax from before (keeps that nice slight drift)
            style={{ y: heroTitleY }}
            // fade + scale cinematic reveal
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.6, once: false }} // replay when you come back
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

        {/* TOP NAV - This stays in place */}
        <div className="relative z-30 flex items-center justify-between px-6 md:px-12 lg:px-20 pt-6">
          <button
            onClick={onBack}
            className="rounded-full px-4 py-1 text-sm bg-white/5 border border-white/20 text-gray-200 hover:bg-white hover:text-black transition"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3 text-[10px] tracking-[0.35em] text-gray-400 uppercase">
            <span>CINE•PORTFOLIO</span>
            <span className="w-1 h-1 rounded-full bg-red-500" />

            {/* icons (resume + github) */}
            <div className="ml-3 flex items-center gap-2">
              <a
                href="https://drive.google.com/file/d/1eSka3wgpO6k5RbBYNnkmxFg6mUfM_eYL/view?usp=sharing" /* replace with your resume URL or route */
                target="_blank"
                rel="noreferrer"
                aria-label="Open resume"
                className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-white/10 bg-white/3 hover:bg-red-500 hover:text-black transition-colors"
              >
                <FaFileAlt className="text-red-400" />
                <span className="hidden sm:inline text-[10px] tracking-[0.25em]">
                  Resume
                </span>
              </a>

              <a
                href="https://github.com/krush-codem" /* replace with your GitHub URL */
                target="_blank"
                rel="noreferrer"
                aria-label="Open GitHub"
                className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-white/10 bg-white/3 hover:bg-red-500 hover:text-black transition-colors"
              >
                <FaGithub className="text-red-400" />
                <span className="hidden sm:inline text-[10px] tracking-[0.25em]">
                  GitHub
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* CENTER AREA – portrait is anchored relative to hero bottom */}
        {/* Added pt-16 and z-10 to push portrait down and keep it above ribbons on small screens */}
        <div className="relative z-10 flex-1 flex items-end justify-center pt-16">
          <motion.div className="relative flex items-center justify-center pb-0">
            {/* left thought bubble */}
            <div className="hidden md:block absolute -left-64 lg:-left-80 top-1/2 -translate-y-1/2 float-bubble max-w-sm">
              <div className="rounded-2xl bg-white/10 border border-white/25 px-6 py-4 text-xs md:text-sm text-gray-100 shadow-xl backdrop-blur">
                <p>
                  I'm a passionate software engineer who loves building
                  interactive, cinematic web experiences that feel more like
                  movie intros than standard portfolios.
                </p>
              </div>
            </div>

            {/* right thought bubble */}
            <div className="hidden md:block absolute -right-64 lg:-right-80 top-1/2 -translate-y-1/2 float-bubble-delay max-w-sm">
              <div className="rounded-2xl bg-white/10 border border-white/25 px-6 py-4 text-xs md:text-sm text-gray-100 shadow-xl backdrop-blur">
                <p>
                  I blend frontend engineering with bold visual design –
                  terminals for devs, and high-impact storytelling for everyone
                  else.
                </p>
              </div>
            </div>

            {/* red glow behind portrait */}
            <div className="absolute -inset-20 rounded-full bg-red-600/40 blur-3xl -z-10" />

            {/* floating cutout image - with relative z-10 to stay above ribbons */}
            <img
              src="/nobg1.png"
              alt="Harekrushna Behera"
              className="relative z-10 w-[280px] md:w-[340px] lg:w-[500px] object-contain"
            />
          </motion.div>
        </div>

        {/* BOTTOM MOVING STRIP – this is the ground line */}
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

      {/* ========================== SECTION 2 (placeholder) ========================== */}
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
