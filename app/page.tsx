"use client";

import CameraView from "@/app/presentation/components/CameraView";
import FaceBoxOverlay from "@/app/presentation/components/FaceBoxOverlay";
import QRDisplay from "@/app/presentation/components/QRDisplay";
import { useEmotionBooth } from "@/app/presentation/hooks/useEmotionBooth";

export default function Page() {
  const { videoRef, faces, qr, retake } = useEmotionBooth();

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black font-sans">
      {/* Background Camera */}
      <CameraView videoRef={videoRef} />

      {/* Face Box + Emotion Overlays */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <FaceBoxOverlay faces={faces} videoRef={videoRef} />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              EMOTION
            </span>
            <span className="text-white">BOOTH</span>
          </h1>

          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/15">
            <span
              className={`w-2 h-2 rounded-full ${
                faces.length > 0 ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            />
            <span className="text-sm font-semibold text-white/80 tracking-wide">
              {faces.length > 0
                ? `${faces.length} FACE${
                    faces.length !== 1 ? "S" : ""
                  } DETECTED`
                : "NO FACE DETECTED"}
            </span>
          </div>
        </div>
      </div>

      {/* QR Popup */}
      <QRDisplay qr={qr} onRetake={retake} />
    </main>
  );
}
