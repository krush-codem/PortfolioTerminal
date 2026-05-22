import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalSystem from "./TerminalSystem";
import SEO from "./SEO";

// Dynamic canvas wrapper loaded seamlessly for the final phase interactions
const LazyRippleCanvas = lazy(() => import("./RippleCanvas"));

function HolographicWrapper({ children, phase }) {
  return (
    <div
      className={`hologram-viewport phase-${phase} relative w-screen h-screen overflow-hidden bg-[#010302]`}
    >
      <style>{`
        @keyframes holo-flicker {
          0% { opacity: 0.98; }
          4% { opacity: 0.99; }
          5% { opacity: 0.88; }
          6% { opacity: 0.99; }
          45% { opacity: 0.96; }
          47% { opacity: 0.93; }
          48% { opacity: 0.99; }
          100% { opacity: 1; }
        }
        @keyframes bulb-glow {
          0%, 100% { 
            opacity: 0.5;
            text-shadow: 0 0 6px rgba(220, 38, 38, 0.5);
          }
          50% { 
            opacity: 1;
            text-shadow: 0 0 25px rgba(220, 38, 38, 1), 0 0 40px rgba(220, 38, 38, 0.7);
          }
        }
        .hologram-viewport {
          animation: holo-flicker 6s infinite;
          box-shadow: inset 0 0 140px rgba(0, 255, 65, 0.15);
        }
        .coder-bulb {
          animation: bulb-glow 2s infinite ease-in-out;
        }
        .hologram-viewport::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 255, 65, 0.05) 50%), 
                      linear-gradient(90deg, rgba(0, 255, 65, 0.01), rgba(0, 255, 65, 0.002), rgba(0, 255, 65, 0.01));
          z-index: 99;
          background-size: 100% 4px, 6px 100%;
          pointer-events: none;
        }
        .hologram-viewport::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0, 6, 2, 0.8) 100%);
          z-index: 100;
          pointer-events: none;
        }
      `}</style>
      {children}
    </div>
  );
}

// Phase 1: Pure Standard Fall Matrix Stream Lines (Enhanced Visibility Version)
const MatrixCodeFall = ({ onComplete }) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*+=:?";
    const columnCount = Math.floor(window.innerWidth / 30);

    const items = Array.from({ length: columnCount }).map((_, i) => ({
      id: i,
      left: `${(i / columnCount) * 100}%`,
      delay: Math.random() * 1.2,
      duration: 1.5 + Math.random() * 2,
      // Randomize opacity between 0.35 and 0.65 for deep 3D waterfall realism
      opacity: 0.35 + Math.random() * 0.3,
      text: Array.from({ length: 38 })
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("\n"),
    }));
    setColumns(items);

    const timer = setTimeout(() => {
      onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black overflow-hidden font-mono text-xs select-none"
    >
      {columns.map((col) => (
        <motion.div
          key={col.id}
          // Added font-bold and drop-shadow glow matrices to pull characters clearly out of shadows
          className="absolute text-[#00ff41] whitespace-pre-line text-center leading-none font-bold drop-shadow-[0_0_4px_rgba(0,255,65,0.6)]"
          style={{ left: col.left, top: -450, opacity: col.opacity }}
          initial={{ y: "-20%" }}
          animate={{ y: "150%" }}
          transition={{
            duration: col.duration,
            delay: col.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {col.text}
        </motion.div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4 text-center">
        <div className="text-[#00ff41] font-mono tracking-[0.4em] md:tracking-[0.6em] text-[10px] sm:text-xs md:text-sm uppercase animate-pulse drop-shadow-[0_0_8px_rgba(0,255,65,0.4)] font-bold">
          [[ INJECTING_CORE_MATRIX_PAYLOAD ]]
        </div>
      </div>
    </motion.div>
  );
};

// Phase 2: Simultaneous Identity Scramble & Smooth Portrait Background Fading Sequence
const IdentityAssembler = ({ onComplete }) => {
  const targetName = "HAREKRUSHNA BEHERA";
  const dummyNames = [
    "CYPHER_X_NODE",
    "ROOT_SYSTEM_ERR",
    "MALWARE_DAEMON",
    "SPECTRE_SHADOW",
  ];

  const [displayName, setDisplayName] = useState("");
  const [bgImage, setBgImage] = useState("/la-load.png");

  useEffect(() => {
    // --- RESPONSIVE MEDIA SOURCE SELECTOR ---
    const updateBackgroundAsset = () => {
      if (window.innerWidth < 768) {
        setBgImage("/photo.png"); // Mobile layout photo asset
      } else {
        setBgImage("/la-load.png"); // Desktop and Tablet layout photo asset
      }
    };

    updateBackgroundAsset();
    window.addEventListener("resize", updateBackgroundAsset);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$*%";
    let iterations = 0;

    const scrambleInterval = setInterval(() => {
      if (iterations < 10) {
        setDisplayName(
          dummyNames[Math.floor(Math.random() * dummyNames.length)],
        );
        iterations++;
      } else {
        clearInterval(scrambleInterval);
        let step = 0;
        const finalizeInterval = setInterval(() => {
          if (step <= targetName.length) {
            const currentBuild = targetName
              .split("")
              .map((char, index) => {
                if (char === " ") return " ";
                if (index < step) return char;
                return chars[Math.floor(Math.random() * chars.length)];
              })
              .join("");
            setDisplayName(currentBuild);
            step++;
          } else {
            clearInterval(finalizeInterval);
            setTimeout(() => {
              onComplete();
            }, 3800);
          }
        }, 80);
      }
    }, 150);

    return () => {
      clearInterval(scrambleInterval);
      window.removeEventListener("resize", updateBackgroundAsset);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black flex flex-col items-center justify-center p-4 sm:p-6 text-center"
    >
      {/* Background Image Layer - Scales beautifully using object-fit cover equivalent rules */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.38, scale: 1 }}
        transition={{ duration: 2.2, ease: "easeOut" }}
        className="absolute inset-0 z-0 bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: "cover", // Forces image to completely fill bounds seamlessly
        }}
      />

      {/* Primary content area forced cleanly on top of faded background */}
      <div className="w-full max-w-4xl flex flex-col items-center relative py-8 px-4 sm:px-6 z-10 select-none">
        {/* Dynamic Typography sizing to prevent screen edge overflowing */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white font-mono leading-none tracking-tight sm:tracking-tighter uppercase m-0 min-h-[70px] sm:min-h-[80px]">
          {displayName.split(" ").map((word, i) => (
            <span
              key={i}
              className={
                i === 1
                  ? "text-[#00ff41] drop-shadow-[0_0_20px_rgba(0,255,65,0.5)] block sm:inline"
                  : "text-white"
              }
            >
              {word}{" "}
            </span>
          ))}
        </h1>

        <div className="mt-4 mb-6 sm:mb-8 text-xl sm:text-2xl md:text-4xl font-mono font-bold uppercase tracking-[0.4em] sm:tracking-[0.7em] text-red-600 coder-bulb">
          CODER
        </div>

        <p className="text-gray-400 font-mono text-[10px] sm:text-xs md:text-sm max-w-md sm:max-w-xl mx-auto m-0 leading-relaxed opacity-80 px-2">
          SYSTEM AUTHENTICATION SIGNATURE DISCOVERED VIA LOCALIZED DECRYPT
          CORRELATION VECTOR.
        </p>
      </div>
    </motion.div>
  );
};

export default function HolographicDashboard() {
  const [phase, setPhase] = useState("matrix_fall");

  return (
    <HolographicWrapper phase={phase}>
      <SEO 
        title="Developer Console" 
        description="Experience a command-line interface (CLI) portfolio. Interact with the HKB OS terminal to explore technical skills, full-stack projects, and system logs through an immersive hacker-style UI."
        url="/dev"
      />
      {/* Ripple engine fires cleanly inside workspace boundaries during the terminal phase */}
      {phase === "terminal" && (
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-transparent pointer-events-none" />
          }
        >
          <LazyRippleCanvas />
        </Suspense>
      )}

      <AnimatePresence mode="wait">
        {phase === "matrix_fall" && (
          <MatrixCodeFall
            key="matrix"
            onComplete={() => setPhase("scramble_assemble")}
          />
        )}

        {phase === "scramble_assemble" && (
          <IdentityAssembler
            key="assemble"
            onComplete={() => setPhase("terminal")}
          />
        )}

        {phase === "terminal" && (
          <motion.div
            key="terminal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-transparent overflow-hidden p-3 sm:p-4 md:p-8"
          >
            <TerminalSystem />
          </motion.div>
        )}
      </AnimatePresence>
    </HolographicWrapper>
  );
}
