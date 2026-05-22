// src/components/IdentitySection.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFileDownload, FaUserShield, FaIdCard, FaMapMarkerAlt } from "react-icons/fa";

// Static data outside the component to avoid purity issues with Math.random during render
const STATIC_SCAN_NODES = Array.from({ length: 20 }).map(() => 
  `SCANNING_BIOMETRICS_NODE_${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}...OK`
);

export default function IdentitySection() {
  const [isAccessed, setIsAccessed] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1], // easeOutQuart
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.4, ease: "easeInOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section id="identity" className="relative w-full bg-black text-white pt-0 pb-0 -mt-[1px]">
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
          py-0
          overflow-hidden
        "
      >
        {/* ACCESS TOGGLE */}
        <div className="flex justify-center items-center py-6">
          <motion.button
            layout
            onClick={() => setIsAccessed(!isAccessed)}
            className="
              relative group overflow-hidden
              inline-flex items-center gap-3
              px-6 py-3
              rounded-full border border-red-500/65
              bg-black/40
              hover:bg-red-600/20
              transition-all duration-300
              text-[10px] tracking-[0.4em] uppercase
            "
          >
            {/* Scanline animation on button */}
            <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-40">
              <motion.div 
                animate={{ y: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-full h-[2px] bg-red-500 shadow-[0_0_8px_#ef4444]"
              />
            </div>

            <FaUserShield className={`text-red-500 transition-transform duration-500 ${isAccessed ? 'rotate-180' : ''}`} />
            <span>{isAccessed ? "CLOSE_DOSSIER" : "ACCESS_PERSONNEL_FILE"}</span>
          </motion.button>
        </div>

        <AnimatePresence>
          {isAccessed && (
            <motion.div
              key="dossier-content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="pb-12 grid grid-cols-1 lg:grid-cols-[1fr_auto_400px] gap-8 items-start"
            >
              {/* LEFT: RESUME CONTENT */}
              <div className="space-y-10">
                <motion.div variants={itemVariants}>
                  <h3 className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-red-500" /> Professional_Objective
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed font-mono">
                    Software Developer with a passion for building interactive, cinematic web experiences. 
                    Specialized in React, Three.js, and modern frontend architectures with a solid 
                    foundation in backend systems.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div variants={itemVariants}>
                    <h3 className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Experience_History</h3>
                    <div className="space-y-4 font-mono">
                      <div>
                        <p className="text-white text-xs font-bold uppercase">Software Developer Intern</p>
                        <p className="text-gray-500 text-[10px]">2024 - PRESENT | REMOTE</p>
                        <p className="text-gray-400 text-xs mt-1">Focusing on high-performance UI and interactive components.</p>
                      </div>
                      <div>
                        <p className="text-white text-xs font-bold uppercase">Open Source Contributor</p>
                        <p className="text-gray-500 text-[10px]">2023 - 2024 | GITHUB</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <h3 className="text-red-400 text-xs tracking-[0.3em] uppercase mb-4">Education_Logs</h3>
                    <div className="space-y-4 font-mono">
                      <div>
                        <p className="text-white text-xs font-bold uppercase">Bachelors in Computer Science</p>
                        <p className="text-gray-500 text-[10px]">2021 - 2025</p>
                        <p className="text-gray-400 text-xs mt-1">Focus on Algorithms, Web Systems, and AI.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants} className="pt-4">
                  <a 
                    href="https://drive.google.com/file/d/1eSka3wgpO6k5RbBYNnkmxFg6mUfM_eYL/view?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-lg border border-red-500/30 bg-red-500/5 hover:bg-red-500 hover:text-black transition-all group"
                  >
                    <FaFileDownload className="text-red-400 group-hover:text-black" />
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Download_Full_Dossier_PDF</span>
                  </a>
                </motion.div>
              </div>

              {/* CENTER: DIVIDER */}
              <div className="hidden lg:block w-[1px] h-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent" />

              {/* RIGHT: IDENTITY SCAN */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col items-center lg:items-end space-y-6"
              >
                <div className="relative group">
                  {/* Targeting Brackets */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-red-500" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-red-500" />
                  <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-red-500" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-red-500" />
                  
                  {/* Scan Line Overlay */}
                  <motion.div 
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-x-0 h-[1px] bg-red-500/80 shadow-[0_0_15px_#ef4444] z-20 pointer-events-none"
                  />

                  {/* Data Stream Overlays */}
                  <div className="absolute inset-0 z-10 pointer-events-none opacity-40 mix-blend-screen overflow-hidden">
                    <div className="text-[6px] font-mono text-red-500 leading-none whitespace-nowrap animate-pulse">
                      {STATIC_SCAN_NODES.map((node, i) => (
                        <div key={i}>{node}</div>
                      ))}
                    </div>
                  </div>

                  <img 
                    src="/krush3s.gif" 
                    alt="Identity Scan"
                    className="w-[280px] h-[350px] object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>

                {/* Identity Metadata */}
                <div className="w-[280px] space-y-3 font-mono">
                  <div className="flex justify-between items-center text-[10px] border-b border-red-500/20 pb-1">
                    <span className="text-gray-500 flex items-center gap-1"><FaIdCard /> SUBJECT_ID</span>
                    <span className="text-red-400">HKB-2026-X</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-b border-red-500/20 pb-1">
                    <span className="text-gray-500 flex items-center gap-1"><FaMapMarkerAlt /> LOCATION</span>
                    <span className="text-red-400">ODISHA, IN</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] border-b border-red-500/20 pb-1">
                    <span className="text-gray-500">STATUS</span>
                    <span className="text-green-500 animate-pulse">ACTIVE_NODE</span>
                  </div>
                  <div className="pt-2">
                    <div className="h-1 w-full bg-red-950 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "88%" }}
                        transition={{ duration: 2, delay: 0.5 }}
                        className="h-full bg-red-500"
                      />
                    </div>
                    <div className="flex justify-between text-[8px] text-red-400 mt-1 uppercase tracking-widest">
                      <span>Neural_Link_Stability</span>
                      <span>88%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inner glows (top & bottom) */}
        <div className="pointer-events-none absolute inset-x-0 -top-10 h-16 bg-red-600/65 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 -bottom-10 h-16 bg-red-600/35 blur-3xl" />
      </motion.div>
    </section>
  );
}
