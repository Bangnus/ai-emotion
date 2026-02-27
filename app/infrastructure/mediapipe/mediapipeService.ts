import {
  FaceLandmarker,
  GestureRecognizer,
  FilesetResolver,
} from "@mediapipe/tasks-vision";

let faceLandmarker: FaceLandmarker | null = null;
let gestureRecognizer: GestureRecognizer | null = null;

export async function initMediaPipe() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
  );

  // Face detection
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    },
    numFaces: 5,
    outputFaceBlendshapes: true,
    runningMode: "VIDEO",
  });

  // Hand gesture detection
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
    },
    numHands: 2,
    runningMode: "VIDEO",
  });
}

export function detectFace(video: HTMLVideoElement) {
  if (!faceLandmarker) return null;

  return faceLandmarker.detectForVideo(video, performance.now());
}

export function detectGesture(video: HTMLVideoElement) {
  if (!gestureRecognizer) return null;

  return gestureRecognizer.recognizeForVideo(video, performance.now());
}
