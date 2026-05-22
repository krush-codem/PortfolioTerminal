// src/components/SplashLoader.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = [
  { text: "Welcome", type: "plain" },
  { text: "to", type: "plain" },
  { text: "Harekrushna's", type: "cursive" },
  { text: "Portfolio.", type: "plain" },
  { text: "- krush", type: "cursive" }
];

export default function SplashLoader({ onComplete }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < SEQUENCE.length) {
      const duration = SEQUENCE[index].type === "cursive" ? 3500 : 1000;
      const timer = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(onComplete, 500);
      return () => clearTimeout(finalTimer);
    }
  }, [index, onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#000000] flex items-center justify-center overflow-hidden font-mono">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap');
        .cursive-font {
          font-family: 'Dancing Script', cursive;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {index < SEQUENCE.length && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            {SEQUENCE[index].type === "plain" ? (
              <h1 className="text-white text-4xl sm:text-7xl font-black tracking-tighter uppercase font-sans">
                {SEQUENCE[index].text}
              </h1>
            ) : (
              <div className="flex justify-center">
                {SEQUENCE[index].text.split("").map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: charIndex * 0.15,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    className="text-red-500 text-4xl sm:text-6xl cursive-font px-[2px]"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
