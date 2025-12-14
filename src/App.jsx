// src/App.jsx
import { useState } from "react";
import LandingView from "./components/LandingView";
import DeveloperView from "./components/DeveloperView";
import ProfileView from "./components/ProfileView";

function App() {
  const [mode, setMode] = useState("landing"); // 'landing' | 'developer' | 'profile'

  return (
    <div className="relative min-h-screen w-full bg-[#0d1117] text-white overflow-hidden">
      {mode === "landing" && (
        <LandingView
          active={true}
          onSelectDeveloper={() => setMode("developer")}
          onSelectProfile={() => setMode("profile")}
        />
      )}

      {mode === "developer" && (
        <DeveloperView active={true} onClose={() => setMode("landing")} />
      )}

      {mode === "profile" && (
        <ProfileView active={true} onBack={() => setMode("landing")} />
      )}
    </div>
  );
}

export default App;
