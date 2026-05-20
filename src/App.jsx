// src/App.jsx
import { Routes, Route } from "react-router-dom";
import LandingView from "./components/LandingView";
import TabletDevice from "./components/TabletDevice";
import ProfileView from "./components/ProfileView";

function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#0d1117] text-white overflow-hidden">
      <Routes>
        <Route path="/" element={<LandingView active={true} />} />
        <Route path="/dev" element={<TabletDevice active={true} />} />
        <Route path="/profile" element={<ProfileView active={true} />} />
      </Routes>
    </div>
  );
}

export default App;
