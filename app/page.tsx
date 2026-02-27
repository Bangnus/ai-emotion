"use client";

import CameraView from "@/app/presentation/components/CameraView";
import FaceBoxOverlay from "@/app/presentation/components/FaceBoxOverlay";
import QRDisplay from "@/app/presentation/components/QRDisplay";
import { useEmotionBooth } from "@/app/presentation/hooks/useEmotionBooth";

export default function Page() {
  const {
    videoRef,
    faces,
    qr,
    imageUrl,
    countdown,
    palmDetected,
    flash,
    retake,
  } = useEmotionBooth();

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
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">
            <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
              EMOTION
            </span>
            <span className="text-white">BOOTH</span>
          </h1>

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

      {/* Capture Hint */}
      {!qr && !palmDetected && !flash && faces.length > 0 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/15 flex items-center gap-3">
            <span className="text-3xl">✋</span>
            <span className="text-white/80 text-sm font-medium">
              แบมือค้างไว้ 3 วินาที เพื่อถ่ายรูป
            </span>
          </div>
        </div>
      )}

      {/* Palm Detected + Countdown */}
      {palmDetected && countdown !== null && countdown > 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative flex flex-col items-center gap-4">
            <div className="w-40 h-40 rounded-full bg-black/60 backdrop-blur-xl border-4 border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.5)] flex items-center justify-center animate-pulse">
              <span className="text-8xl font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]">
                {countdown}
              </span>
            </div>
            <div className="bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-white text-lg font-bold tracking-wider">
                ✋ HOLD PALM...
              </span>
            </div>
          </div>
        </div>
      )}

      {/* "Get Ready" message after countdown */}
      {/* {countdown === 0 && !flash && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <span className="text-6xl">📸</span>
            <span className="text-white text-2xl font-bold tracking-wider animate-pulse">
              เตรียมตัว...
            </span>
          </div>
        </div>
      )} */}

      {/* Flash Effect */}
      {flash && (
        <div
          className="absolute inset-0 z-40 bg-white pointer-events-none"
          style={{
            animation: "flash 0.6s ease-out forwards",
          }}
        />
      )}

      {/* QR Popup */}
      <QRDisplay qr={qr} imageUrl={imageUrl} onRetake={retake} />
    </main>
  );
}
