import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;

export async function initMediaPipe() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    numFaces: 5,
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
  });
}

export function detectFace(video: HTMLVideoElement) {
  if (!faceLandmarker) return null;

  return faceLandmarker.detectForVideo(video, performance.now());
}
