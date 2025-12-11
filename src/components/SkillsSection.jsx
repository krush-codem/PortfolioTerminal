// src/components/SkillsSection.jsx
import { useState } from "react";
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

  return (
    <section
      id="skills"
      className="relative w-full bg-black text-white pt-0 pb-0 md:pb-0 -mt-1"
    >
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
          pt-8 pb-10 sm:pt-10 sm:pb-20
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
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Where I put the work in
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
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-red-500/65 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-16 bg-red-500/65 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 -left-10 w-16 bg-red-500/65 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 -right-10 w-16 bg-red-500/65 blur-3xl" />
      </motion.div>
    </section>
  );
}
