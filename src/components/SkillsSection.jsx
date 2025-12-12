// src/components/SkillsSection.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const SKILL_GROUPS = [
  {
    label: "Frontend",
    items: ["React", "JavaScript (ES6+)", "Tailwind CSS", "Framer Motion"],
  },
  {
    label: "Backend",
    items: ["Java", "Python", "Oracle"],
  },
  {
    label: "Tools",
    items: ["Git & GitHub", "Vite", "VS Code", "Figma", "Postman"],
  },
  {
    label: "Soft Skills",
    items: [
      "Problem-solving",
      "Communication",
      "Team collaboration",
      "Mentoring juniors",
    ],
  },
];

export default function SkillsSection() {
  // which card is “open” on tap (for mobile)
  const [activeIndex, setActiveIndex] = useState(null);

  // ---- glitch word state + timer ----
  const words = ["work", "efforts", "passion", "blood&sweat"];
  const [wordIndex, setWordIndex] = useState(0); // start with "work"
  const [isGlitch, setIsGlitch] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // rotate every 2200ms, glitch duration ~420ms
    const interval = setInterval(() => {
      setIsGlitch(true);
      timeoutRef.current = setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        // small tail after swap then stop glitch
        setTimeout(() => setIsGlitch(false), 220);
      }, 420);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentWord = words[wordIndex];

  return (
    <section
      id="skills"
      className="relative w-full bg-black text-white pt-0 pb-0 md:pb-0 -mt-1"
    >
      {/* Inline CSS for glitch effect */}
      <style>{`
        @keyframes glitch-jitter {
          0% { transform: translate3d(0,0,0); opacity:1; }
          10% { transform: translate3d(-2px,-1px,0) skew(-0.5deg); opacity:0.95; }
          20% { transform: translate3d(2px,1px,0) skew(0.5deg); opacity:0.9; }
          30% { transform: translate3d(-1px,0,0) skew(-0.3deg); opacity:0.98; }
          40% { transform: translate3d(1px,1px,0) skew(0.2deg); opacity:0.9; }
          100% { transform: translate3d(0,0,0); opacity:1; }
        }
        @keyframes glitch-flicker {
          0% { clip-path: inset(0 0 0 0); opacity:1; }
          20% { clip-path: inset(10% 0 70% 0); opacity:0.6; }
          40% { clip-path: inset(60% 0 10% 0); opacity:0.8; }
          60% { clip-path: inset(0 40% 0 10%); opacity:0.7; }
          80% { clip-path: inset(5% 0 5% 0); opacity:0.95; }
          100% { clip-path: inset(0 0 0 0); opacity:1; }
        }

        .glitch-wrap { display:inline-block; position:relative; vertical-align:middle; line-height:1; padding:0 .12rem; }
        .glitch-base { position:relative; z-index:3; display:inline-block; transition: transform 200ms ease; }
        .glitch-layer { position:absolute; left:0; top:0; z-index:2; mix-blend-mode: screen; pointer-events:none; opacity:0; }
        .glitch-layer.red { color: rgba(255,90,90,0.95); transform: translate3d(-2px,0,0); }
        .glitch-layer.cyan { color: rgba(120,210,255,0.9); transform: translate3d(2px,0,0); }
        .is-glitch .glitch-layer { opacity: 0.95; animation: glitch-jitter 420ms linear both, glitch-flicker 420ms linear both; }
        .is-glitch .glitch-base { transform: scale(0.985); }
        .is-glitch .glitch-base::after {
          content: "";
          position: absolute;
          inset: -6px;
          z-index: -1;
          border-radius: 6px;
          box-shadow: 0 8px 30px rgba(255,60,60,0.12);
        }

        @media (prefers-reduced-motion: reduce) {
          .glitch-layer, .glitch-base { transition:none !important; animation:none !important; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scaleY: 0.85, originY: 0 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ amount: 0.35, once: false }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative
          w-full
          border-y border-red-500/40
          bg-[#050509]
          shadow-[0_0_110px_rgba(248,113,113,0.35)]
          px-4 sm:px-10 lg:px-20
          pt-8 sm:pt-10 
          overflow-hidden
        "
      >
        <div className="max-w-6xl mx-auto">
          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.4, once: false }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-10 pt-8"
          >
            <p className="text-xs tracking-[0.35em] uppercase text-red-400 mb-3">
              Skillset
            </p>

            {/* updated H2: glitch word injected here and colored red */}
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Where I put the{" "}
              <span
                className={`glitch-wrap ${isGlitch ? "is-glitch" : ""}`}
                aria-live="polite"
                aria-atomic="true"
                role="status"
              >
                <span
                  className="glitch-base text-red-500"
                  style={{ fontSize: "inherit" }}
                >
                  {currentWord}
                </span>
                <span className="glitch-layer red" aria-hidden>
                  {currentWord}
                </span>
                <span className="glitch-layer cyan" aria-hidden>
                  {currentWord}
                </span>
              </span>{" "}
              in
            </h2>

            <p className="text-sm md:text-base text-gray-300 max-w-2xl">
              Four tracks that cover how I design, build and ship things — from
              UI polish to backend wiring and everything in between.
            </p>
          </motion.div>

          {/* CARDS GRID */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.4, once: false }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 mb-10 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SKILL_GROUPS.map((group, index) => {
              const isActive = activeIndex === index;

              return (
                <motion.button
                  key={group.label}
                  type="button"
                  onClick={() => setActiveIndex(isActive ? null : index)}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.3, once: false }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: 0.05 + index * 0.06,
                  }}
                  className="
                    relative group
                    rounded-3xl
                    border border-red-500/40
                    bg-white/5
                    backdrop-blur-sm
                    px-5 py-6
                    overflow-hidden
                    cursor-pointer
                    text-left
                  "
                >
                  {/* FRONT FACE — title only */}
                  <div
                    className={`
                      absolute inset-0
                      flex flex-col items-center justify-center gap-2
                      transition-opacity duration-300
                      ${
                        isActive
                          ? "opacity-0"
                          : "opacity-100 group-hover:opacity-0"
                      }
                    `}
                  >
                    <p className="text-[11px] tracking-[0.25em] uppercase text-red-400">
                      Track
                    </p>
                    <h3 className="text-xl font-semibold">{group.label}</h3>
                  </div>

                  {/* BACK FACE — skills list (shown on hover / tap) */}
                  <div
                    className={`
                      relative
                      transition-opacity duration-300
                      ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  >
                    <p className="text-[11px] tracking-[0.25em] uppercase text-red-400 mb-3">
                      {group.label}
                    </p>
                    <ul className="text-sm text-gray-200 space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span
                            className="
                              inline-block w-1.5 h-1.5 rounded-full bg-red-400
                              group-hover:scale-125 transition-transform
                            "
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* HOVER / ACTIVE GLOW */}
                  <div
                    className={`
                      pointer-events-none
                      absolute inset-0
                      transition-opacity duration-300
                      ${
                        isActive
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }
                    `}
                  >
                    <div className="absolute -bottom-10 inset-x-4 h-20 bg-red-500/25 blur-2xl" />
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* GLOWS AROUND SECTION (your original ones) */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-red-500/80 blur-3xl" />
      </motion.div>
    </section>
  );
}
