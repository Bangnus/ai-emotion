"use client";

export default function CameraView({ videoRef }: any) {
  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      className="
        fixed top-0 left-0 w-full h-full object-cover z-0
        scale-x-[-1] brightness-90
      "
    />
  );
}
