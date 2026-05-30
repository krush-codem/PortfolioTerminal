// src/App.jsx
import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/react";
import LandingView from "./components/LandingView";
import TabletDevice from "./components/TabletDevice";
import ProfileView from "./components/ProfileView";
import SplashLoader from "./components/SplashLoader";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  return (
    <div className="relative min-h-screen w-full bg-[#0d1117] text-white overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <SplashLoader key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingView active={true} />} />
            <Route path="/dev" element={<TabletDevice active={true} />} />
            <Route path="/profile" element={<ProfileView active={true} />} />
          </Routes>
        )}
      </AnimatePresence>
      <SpeedInsights />
    </div>
  );
}

export default App;
