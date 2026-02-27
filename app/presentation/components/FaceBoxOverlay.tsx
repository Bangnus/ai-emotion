import { FaceData } from "@/app/shared/types";
import { RefObject } from "react";

const COLORS = [
  {
    border: "border-cyan-400",
    shadow: "shadow-[0_0_20px_rgba(34,211,238,0.6)]",
    text: "text-cyan-400",
    bg: "bg-cyan-500",
  },
  {
    border: "border-pink-400",
    shadow: "shadow-[0_0_20px_rgba(244,114,182,0.6)]",
    text: "text-pink-400",
    bg: "bg-pink-500",
  },
  {
    border: "border-amber-400",
    shadow: "shadow-[0_0_20px_rgba(251,191,36,0.6)]",
    text: "text-amber-400",
    bg: "bg-amber-500",
  },
  {
    border: "border-green-400",
    shadow: "shadow-[0_0_20px_rgba(74,222,128,0.6)]",
    text: "text-green-400",
    bg: "bg-green-500",
  },
  {
    border: "border-violet-400",
    shadow: "shadow-[0_0_20px_rgba(167,139,250,0.6)]",
    text: "text-violet-400",
    bg: "bg-violet-500",
  },
];

const EMOTION_EMOJI: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  angry: "😠",
  surprised: "😲",
};

function useVideoMapping(videoRef: RefObject<HTMLVideoElement | null>) {
  function toScreenRect(nx: number, ny: number, nw: number, nh: number) {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      return {
        left: nx * 100,
        top: ny * 100,
        width: nw * 100,
        height: nh * 100,
      };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const videoAR = video.videoWidth / video.videoHeight;
    const screenAR = vw / vh;

    let displayW: number, displayH: number, offsetX: number, offsetY: number;

    if (videoAR > screenAR) {
      displayH = vh;
      displayW = vh * videoAR;
      offsetX = (displayW - vw) / 2;
      offsetY = 0;
    } else {
      displayW = vw;
      displayH = vw / videoAR;
      offsetX = 0;
      offsetY = (displayH - vh) / 2;
    }

    return {
      left: ((nx * displayW - offsetX) / vw) * 100,
      top: ((ny * displayH - offsetY) / vh) * 100,
      width: ((nw * displayW) / vw) * 100,
      height: ((nh * displayH) / vh) * 100,
    };
  }

  return { toScreenRect };
}

type Props = {
  faces: FaceData[];
  videoRef: RefObject<HTMLVideoElement | null>;
};

export default function FaceBoxOverlay({ faces, videoRef }: Props) {
  const { toScreenRect } = useVideoMapping(videoRef);

  if (!faces.length) return null;

  return (
    <>
      {faces.map((face, i) => {
        const color = COLORS[i % COLORS.length];

        const mirroredX = 1 - (face.box.x + face.box.width);
        const rect = toScreenRect(
          mirroredX,
          face.box.y,
          face.box.width,
          face.box.height
        );

        // Dominant emotion only
        const [dominantKey, dominantVal] = Object.entries(face.emotion).reduce(
          (a, b) => (b[1] > a[1] ? b : a)
        );

        return (
          <div key={i}>
            {/* ── Face Bounding Box ── */}
            <div
              className={`absolute ${color.border} border-2 rounded-lg ${color.shadow} transition-all duration-75 ease-linear`}
              style={{
                left: `${rect.left}%`,
                top: `${rect.top}%`,
                width: `${rect.width}%`,
                height: `${rect.height}%`,
              }}
            >
              {/* Corner brackets */}
              <div
                className={`absolute -top-0.5 -left-0.5 w-5 h-5 border-t-[3px] border-l-[3px] ${color.border} rounded-tl`}
              />
              <div
                className={`absolute -top-0.5 -right-0.5 w-5 h-5 border-t-[3px] border-r-[3px] ${color.border} rounded-tr`}
              />
              <div
                className={`absolute -bottom-0.5 -left-0.5 w-5 h-5 border-b-[3px] border-l-[3px] ${color.border} rounded-bl`}
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 border-b-[3px] border-r-[3px] ${color.border} rounded-br`}
              />
            </div>

            {/* ── Dominant Emotion Label (bottom of face box) ── */}
            <div
              className="absolute transition-all duration-75 ease-linear flex items-center gap-2"
              style={{
                left: `${rect.left}%`,
                top: `${rect.top + rect.height + 0.8}%`,
              }}
            >
              {/* Face number badge */}
              <div
                className={`${color.bg} text-white text-[10px] font-bold px-1.5 py-0.5 rounded`}
              >
                {i + 1}
              </div>

              {/* Emotion chip */}
              <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/15 flex items-center gap-1.5">
                <span className="text-lg leading-none">
                  {EMOTION_EMOJI[dominantKey]}
                </span>
                <span
                  className={`text-sm font-bold uppercase tracking-wider ${color.text}`}
                >
                  {dominantKey}
                </span>
                <span className="text-xs text-gray-400 ml-1">
                  {dominantVal}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
