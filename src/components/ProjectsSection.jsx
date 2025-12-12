// src/components/ProjectsSection.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { desc } from "framer-motion/client";

const PROJECTS = [
  {
    id: "01",
    name: "Visual-Code",
    role: "Collab • Frontend",
    year: "2025",
    tagline: "Code, Parsed. Understood. Master the Blueprint.",
    tech: "React, xy-flow, TailwindCSS, Shadcn/UI",
    image: "/project-img/code-IDE.jpg",
    link: "https://github.com/krush-codem/visual-code",
    desc: "An innovative web-based code editor that transforms traditional coding into a visual experience by flowcharts and diagrams, making coding more intuitive and efficient.",
  },
  {
    id: "02",
    name: "Quick-AI",
    role: "Collab • Frontend",
    year: "2025",
    tagline: "AI platform for all your needs.",
    tech: "React, Context API, TailwindCSS",
    image: "/project-img/ai.jpg",
    link: "https://github.com/Dynamicpayal/quickAI",
    desc: "A versatile AI platform that integrates multiple AI services into a single, user-friendly interface, allowing users to access various AI tools and functionalities seamlessly.",
  },
  {
    id: "03",
    name: "Habit-Kracker",
    role: "Solo • Web App",
    year: "2024",
    tagline: "Turn Your Daily Grind Into A Game.",
    tech: "React, TailwindCSS, shadcn/UI",
    image: "/project-img/new.png",
    link: "https://habit-kracker.vercel.app/",
    desc: "Level Up is a productivity application that transforms daily tasks into an RPG-style game. Built to solve the problem of motivation, it uses immediate gratification (XP, Level Ups, Animations) to help users build consistency.",
  },
  {
    id: "04",
    name: "SSPPT",
    role: "Academic • Python",
    year: "2024",
    tagline: "Simple desktop PROMODER app for managing tasks on time.",
    tech: "Python, JSON, Tkinter",
    image: "/project-img/imageq.png",
    link: "https://github.com/krush-codem/SSPPT",
    desc: "A minimalistic, cross-platform Python application for task-based study planning and focused time management using Pomodoro sessions. Built with Tkinter for the GUI and JSON for persistent local storage.",
  },
  {
    id: "05",
    name: "To-Do List",
    role: "Academic • JavaScript",
    year: "2023",
    tagline: "Simple web-based to-do list tracker.",
    tech: "JavaScript, HTML, CSS",
    image: "/project-img/image.png",
    link: "https://to-do-list-hare.netlify.app/",
    desc: "A simple and intuitive TO-DO list application designed to help users manage their tasks efficiently.",
  },
];

export default function ProjectsSection() {
  const [expanded, setExpanded] = useState(false);
  const [openRow, setOpenRow] = useState(null);

  const toggleRow = (id) => {
    setOpenRow((current) => (current === id ? null : id));
  };

  return (
    <section
      id="projects"
      className="relative w-full bg-black text-white pt-0 pb-0 md:pb-0 -mt-[1px]"
    >
      <motion.div
        initial={{ opacity: 0, scaleY: 0.9, originY: 0 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ amount: 0.35, once: false }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative
          w-full
          border-y border-red-600/65
          bg-[#050509]
          shadow-[0_0_110px_rgba(248,113,113,0.35)]
          px-4 sm:px-10 lg:px-20
          py-0 sm:py-0
          overflow-hidden
        "
      >
        {/* -------- TOP BAR: PROJECTS pill that moves from center to left -------- */}
        <motion.div
          layout
          className={`flex items-center ${
            expanded ? "justify-between" : "justify-center"
          } gap-6`}
        >
          <motion.button
            layout
            onClick={() => setExpanded((v) => !v)}
            className="
              inline-flex items-center gap-3
              px-5 py-2.5 mt-5  mb-5
              rounded-full border border-red-500/65
              bg-black/40
              hover:bg-red-600/65
              transition-colors
              text-xs tracking-[0.4em] uppercase
            "
          >
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-red-500"
              animate={{
                boxShadow: [
                  "0 0 2px rgba(248,113,113,0.4)",
                  "0 0 12px rgba(248,113,113,1)",
                  "0 0 2px rgba(248,113,113,0.4)",
                ],
                scale: [1, 1.4, 1],
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span>Projects</span>
          </motion.button>
        </motion.div>

        {/* -------- BODY: description + rows (unwinds when expanded) -------- */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="projects-body"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mt-0 md:mt-0"
            >
              {/* Intro blurb with typewriter */}
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  Things I&apos;ve actually{" "}
                  <span className="text-red-400">
                    <TypeWriterLoop
                      words={["shipped", "designed", "programmed"]}
                    />
                  </span>
                </h2>
              </div>

              {/* Header row */}
              <div
                className="
                  hidden md:grid
                  grid-cols-[minmax(0,0.4fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.6fr)]
                  text-[11px] uppercase tracking-[0.25em] text-gray-500
                  border-b border-white/10 pb-3 mb-3
                "
              >
                <span>#</span>
                <span>Project</span>
                <span>Role / Stack</span>
                <span>Year</span>
              </div>

              {/* Rows */}
              <div className="space-y-3 pb-8 md:pb-10">
                {PROJECTS.map((project) => (
                  <ProjectRow
                    key={project.id}
                    project={project}
                    isOpen={openRow === project.id}
                    onToggle={() => toggleRow(project.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* subtle inner glow (top only now, so no extra band below section) */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-red-600/65 blur-3xl" />
      </motion.div>
    </section>
  );
}

function TypeWriterLoop({
  words,
  speed = 120,
  deleteSpeed = 60,
  delay = 1200,
}) {
  const [index, setIndex] = useState(0); // which word
  const [subIndex, setSubIndex] = useState(0); // letter position
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    // blinking cursor
    const blinkInterval = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    if (!words || words.length === 0) return;
    const currentWord = words[index];

    if (!deleting && subIndex === currentWord.length) {
      // finished typing → pause → delete
      const t = setTimeout(() => setDeleting(true), delay);
      return () => clearTimeout(t);
    }

    if (deleting && subIndex === 0) {
      // finished deleting → move to next word
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      },
      deleting ? deleteSpeed : speed
    );

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words, speed, deleteSpeed, delay]);

  if (!words || words.length === 0) return null;

  return (
    <span>
      {words[index].substring(0, subIndex)}
      <span className={blink ? "opacity-100" : "opacity-0"}>|</span>
    </span>
  );
}

/* ----------------------- Single project row ----------------------- */
function ProjectBadge({ isActive }) {
  return (
    <div className="flex flex-col items-center justify-center gap-[1px]">
      {[0, 1, 2].map((i) => (
        <motion.svg
          key={i}
          width="16"
          height="10"
          viewBox="0 0 16 10"
          className="text-red-500"
          initial={false}
          animate={
            isActive
              ? { opacity: [0.4, 1, 0.4], y: [0, -1, 0] }
              : { opacity: 0.6, y: 0 }
          }
          transition={
            isActive
              ? {
                  duration: 0.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.12,
                }
              : { duration: 0.2 }
          }
        >
          {/* chevron outline */}
          <polyline
            points="1,2 8,7 15,2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      ))}
    </div>
  );
}

function ProjectRow({ project, isOpen, onToggle }) {
  const [isHovered, setIsHovered] = useState(false);

  // two glow strengths:
  const hoverShadow = "0 0 18px rgba(248,113,113,0.28)";
  const openShadow = "0 0 40px rgba(248,113,113,0.55)";
  const defaultShadow = "0 0 0 rgba(0,0,0,0)";

  // compute effective state (either hovered OR opened)
  const active = isOpen || isHovered;

  return (
    <motion.div
      layout
      // animate boxShadow & subtle border color when active (hover or open)
      animate={
        isOpen
          ? { boxShadow: openShadow, borderColor: "rgba(248,113,113,0.65)" }
          : isHovered
          ? { boxShadow: hoverShadow, borderColor: "rgba(248,113,113,0.38)" }
          : { boxShadow: defaultShadow, borderColor: "rgba(255,255,255,0.08)" }
      }
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="
        relative
        rounded-2xl
        border border-white/10
        bg-white/5
        group cursor-pointer
      "
      onClick={onToggle}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main row content */}
      <div
        className="
          flex flex-col justify-center
          gap-2 md:gap-4
          px-4 py-4 md:px-5 md:py-4
          md:grid
          md:grid-cols-[minmax(0,0.4fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.6fr)]
        "
      >
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ProjectBadge isActive={active} />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-red-400">
              {project.name}
            </p>
            <p className="text-xs text-gray-300 line-clamp-1 md:line-clamp-none">
              {project.tagline}
            </p>
          </div>

          {/* Desktop hover preview – floating card on the right */}
          <div className="hidden md:block relative">
            <AnimatePresence>
              {!isOpen && isHovered && project.image && (
                <motion.div
                  key="hover-preview"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="
                    pointer-events-none
                    absolute right-0 top-1/2 -translate-y-1/2
                    w-56
                    rounded-2xl overflow-hidden
                    border border-red-500/70
                    bg-black
                    shadow-[0_0_40px_rgba(248,113,113,0.55)]
                  "
                >
                  <div className="relative h-36 bg-zinc-900 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover opacity-70 blur-[2px] scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="px-3 py-2 rounded-full bg-black/60 border border-red-400/60 shadow-[0_0_20px_rgba(248,113,113,0.6)]">
                        <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-red-300 text-center">
                          Wanna check it out?
                        </p>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-xs text-gray-300">
          {project.role}
          <span className="hidden md:inline text-gray-500">
            {" "}
            • {project.tech}
          </span>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          <span className="text-gray-400">{project.year}</span>
          <span className="hidden sm:inline text-[11px] uppercase tracking-[0.2em] text-red-400 group-hover:text-red-300 transition-colors">
            {isOpen ? "Close" : "Open"}
          </span>
        </div>
      </div>

      {/* Mobile “wanna check it out?” overlay on tap/hover */}
      <div
        className="
          md:hidden
          pointer-events-none
          opacity-0 group-active:opacity-100 group-hover:opacity-100
          transition-opacity duration-300
          px-4 pb-2
        "
      >
        <p className="text-[11px] uppercase tracking-[0.25em] text-red-300">
          Wanna check it out?
        </p>
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-t border-white/10 bg-black/40 px-4 md:px-5 py-4 flex flex-col md:flex-row gap-4"
          >
            {project.image && (
              <div className="w-full md:w-56 h-32 md:h-32 rounded-lg overflow-hidden border border-red-500/60 bg-zinc-900">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 text-xs md:text-sm text-gray-200 space-y-2">
              <p>
                <span className="font-semibold text-white">Stack: </span>
                {project.tech}
              </p>
              <p>{project.desc}</p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-red-300 hover:text-red-200"
                >
                  Visit project
                  <span className="text-xs">↗</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
