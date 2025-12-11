// src/components/LandingView.jsx
import ProfileCard from "./ProfileCard";

function LandingView({ active, onSelectDeveloper, onSelectProfile }) {
  return (
    <div
      aria-hidden={!active}
      className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
        active
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      {/* Background overlay (keeps UX same as before) */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Content wrapper (z-20 so it sits above overlay) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4">
        {/* ===== MEDIUM+ (desktop/tablet) — original three-column layout ===== */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 items-center gap-8 py-12">
            {/* Left: Developers (desktop) */}
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
                onClick={onSelectDeveloper}
                className="mt-4 px-6 py-2 rounded-full bg-black text-white border border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                Developer view
              </button>
            </div>

            {/* Center: Profile card */}
            <div className="flex items-center justify-center">
              <ProfileCard variant="static" />
            </div>

            {/* Right: Profile (desktop) */}
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
                onClick={onSelectProfile}
                className="mt-4 px-6 py-2 rounded-full bg-white text-black border border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition"
              >
                Profile viewer
              </button>
            </div>
          </div>
        </div>

        {/* ===== SMALL (mobile) — stacked and scrollable layout ===== */}
        <div className="block md:hidden">
          {/* Make the small screen area vertically scrollable if content overflows */}
          <div
            className="max-w-xl mx-auto w-full bg-transparent py-8 overflow-y-auto"
            style={{ maxHeight: "80vh" }}
          >
            {/* 1) Name + ProfileCard first */}
            <div className="flex flex-col items-center justify-center px-4">
              {/* <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                Harekrushna Behera
              </h1> */}

              <div className="w-full max-w-xs">
                <ProfileCard variant="static" />
              </div>

              {/* <h2 className="text-xl text-gray-300 mt-4">Software Developer</h2>
              <a
                href="https://github.com/krush-codem"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block"
              >
                <p className="text-base text-[#58a6ff]">
                  github.com/krush-codem
                </p>
              </a> */}
            </div>

            {/* 2) Profile viewer section (stacked below) */}
            <div className="mt-8 px-4">
              <div className="flex items-center justify-center mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest bg-white text-black">
                  PROFILE
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-center">
                For <span className="italic">Everyone</span>
              </h2>
              <p className="text-sm text-gray-300 text-center max-w-prose mx-auto mt-3">
                Prefer a simple view? Explore my profile, experience, and
                projects in a clean, easy-to-read layout.
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={onSelectProfile}
                  className="px-6 py-2 rounded-full bg-white text-black border border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  Profile viewer
                </button>
              </div>
            </div>

            {/* 3) Developer section (stacked last) */}
            <div className="mt-8 px-4 pb-6">
              <div className="flex items-center justify-center mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-widest bg-white text-black">
                  DEVELOPERS
                </span>
              </div>
              <h2 className="text-2xl font-semibold text-center">
                For <span className="italic">Developers</span>
              </h2>
              <p className="text-sm text-gray-300 text-center max-w-prose mx-auto mt-3">
                Dive into an interactive terminal-style portfolio with commands,
                projects, and skills built for devs.
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={onSelectDeveloper}
                  className="px-6 py-2 rounded-full bg-black text-white border border-white/30 hover:-translate-y-0.5 hover:shadow-lg transition"
                >
                  Developer view
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingView;
