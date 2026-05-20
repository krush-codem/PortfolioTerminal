// src/components/LandingView.jsx
import { useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import ColorBends from "@/components/ColorBends";
import { motion } from "framer-motion";
import SEO from "./SEO";

function LandingView({ active }) {
  const navigate = useNavigate();

  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 transition-all duration-500 ${
        active
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      {/* Clean out any internal mobile container scroll tracks */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <SEO
        title="Home"
        description="Welcome to my interactive portfolio. Explore my work as a software developer through cinematic and developer-focused views."
      />
      {/* ===== Animated Background (Color Bends) ===== */}
      {active && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <ColorBends />
        </div>
      )}

      {/* ===== Dark overlay for contrast ===== */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* ===== Content ===== */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 flex items-center justify-center h-full">
        {/* ===== MEDIUM+ (desktop/tablet) - Kept Exactly Same ===== */}
        <div className="hidden md:block w-full">
          <div className="grid grid-cols-3 items-center gap-8 py-12">
            {/* Left: Developers */}
            <div className="flex flex-col items-end text-right space-y-4 px-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest bg-white text-black">
                DEVELOPERS
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold">
                For <span className="italic">Developers</span>
              </h2>
              <p className="text-sm text-gray-300 max-w-xs">
                Dive into an interactive terminal-style portfolio with commands,
                projects, and skills built for devs.
              </p>
              <button
                onClick={() => navigate("/dev")}
                className="mt-4 px-6 py-2 rounded-full bg-black text-white border border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                Developer view
              </button>
            </div>

            {/* Center: Profile card */}
            <div className="flex items-center justify-center">
              <ProfileCard variant="static" />
            </div>

            {/* Right: Profile */}
            <div className="flex flex-col items-start text-left space-y-4 px-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest bg-white text-black">
                PROFILE
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold">
                For <span className="italic">Everyone</span>
              </h2>
              <p className="text-sm text-gray-300 max-w-xs">
                Prefer a simple view? Explore my profile, experience, and
                projects in a clean, easy-to-read layout.
              </p>
              <button
                onClick={() => navigate("/profile")}
                className="mt-4 px-6 py-2 rounded-full bg-white text-black border border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                Profile viewer
              </button>
            </div>
          </div>
        </div>

        {/* ===== SMALL (mobile layout optimized) ===== */}
        <div className="block md:hidden w-full">
          <div
            className="max-w-md mx-auto w-full py-6 overflow-y-auto no-scrollbar flex flex-col justify-center gap-6"
            style={{ maxHeight: "85vh" }}
          >
            {/* 1. Profile Section (Top View) */}
            <div className="px-4 flex flex-col items-center">
              <div className="mb-3">
                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest bg-white text-black">
                  PROFILE
                </span>
              </div>
              <h2 className="text-xl font-bold text-center text-white">
                For <span className="italic">Everyone</span>
              </h2>
              <p className="text-xs text-gray-400 text-center mt-2 max-w-xs mx-auto leading-relaxed">
                Prefer a simple view? Explore my profile, experience, and
                projects in a clean, easy-to-read layout.
              </p>
              <div className="w-full flex justify-center mt-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full max-w-[200px] py-2 rounded-full bg-white text-black text-xs font-semibold active:scale-95 transition-transform"
                >
                  Profile viewer
                </button>
              </div>
            </div>

            {/* 2. Custom Image Spliter Component */}
            <div className="relative flex items-center justify-center my-2 px-8">
              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="absolute w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_8px_#00ff41]" />
            </div>

            {/* 3. Developer Section (Bottom View - Cleaned & Corrected) */}
            <div className="px-4 flex flex-col items-center">
              {/* 1. Button on Top */}
              <div className="w-full flex justify-center mb-4">
                <button
                  onClick={() => navigate("/dev")}
                  className="w-full max-w-[200px] py-2 rounded-full bg-black text-white text-xs font-semibold border border-white/30 active:scale-95 transition-transform"
                >
                  Developer viewer
                </button>
              </div>

              {/* 2. Heading and Paragraph Description */}
              <h2 className="text-xl font-bold text-center text-white">
                For <span className="italic">Developers</span>
              </h2>
              <p className="text-xs text-gray-400 text-center mt-2 max-w-xs mx-auto leading-relaxed">
                Dive into an interactive terminal-style portfolio with commands,
                projects, and skills built for devs.
              </p>

              {/* 3. Section Badge Span at the Bottom */}
              <div className="mt-4">
                <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest bg-white text-black">
                  DEVELOPERS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingView;
