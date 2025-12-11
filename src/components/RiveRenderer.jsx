// src/components/RiveRenderer.jsx
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

export default function RiveRenderer({ src }) {
  const STATE_MACHINE = "State Machine 1";

  const { rive, RiveComponent } = useRive({
    src,
    autoplay: true,
    stateMachines: STATE_MACHINE,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  // --- Inputs from Rive ---
  const start = useStateMachineInput(rive, STATE_MACHINE, "start");
  const jump = useStateMachineInput(rive, STATE_MACHINE, "jump");
  const nextObstacle = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "nextobstacle"
  );

  const cactusHit = useStateMachineInput(rive, STATE_MACHINE, "bool_CactusHit");
  const birdHit = useStateMachineInput(rive, STATE_MACHINE, "bool_BirdHit");
  const unHit = useStateMachineInput(rive, STATE_MACHINE, "boolUnhit");

  // CLICK = restart game OR jump if already running
  const handleClick = () => {
    if (start?.fire) start.fire(); // start game
    if (jump?.fire) jump.fire(); // jump
  };

  // SPACEBAR = jump
  const handleKeyDown = (e) => {
    if (e.code === "Space") {
      if (jump?.fire) jump.fire();
    }
  };

  // reset hit booleans every time you click
  const resetHits = () => {
    if (cactusHit) cactusHit.value = false;
    if (birdHit) birdHit.value = false;
    if (unHit) unHit.value = true;
  };

  const handleDown = () => {
    resetHits();
    if (start?.fire) start.fire();
    if (jump?.fire) jump.fire();
  };

  if (!RiveComponent) return null;

  return (
    <div
      tabIndex={0}
      className="w-full h-full outline-none"
      onKeyDown={handleKeyDown}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      style={{ cursor: "pointer" }}
    >
      <RiveComponent className="w-full h-full" />
    </div>
  );
}
