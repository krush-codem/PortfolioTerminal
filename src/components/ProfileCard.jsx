// src/components/ProfileCard.jsx
function ProfileCard({ variant = "static" }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold text-white text-center">
        Harekrushna Behera
      </h1>

      {variant === "3d" ? (
        // used ONLY in DeveloperView – Three.js mounts here
        <div
          id="card-container"
          className="card-container w-[300px] h-[500px] cursor-pointer"
        />
      ) : (
        // simple static image for landing view
        <img
          src="/photo.png"
          alt="Harekrushna Behera"
          className="w-[300px] h-[500px] object-cover"
        />
      )}

      <h2 className="text-2xl text-gray-400">Software Developer</h2>
      <a href="https://github.com/krush-codem" target="_blank" rel="noreferrer">
        <p className="text-lg text-[#58a6ff]">github.com/krush-codem</p>
      </a>
    </div>
  );
}

export default ProfileCard;
