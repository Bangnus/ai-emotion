export type EmotionScores = {
  happy: number;
  sad: number;
  angry: number;
  surprised: number;
  neutral: number;
};

export type FaceBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type FaceData = {
  box: FaceBox;
  emotion: EmotionScores;
};

export type SystemState =
  | "LOADING"
  | "IDLE"
  | "SCANNING"
  | "COUNTDOWN"
  | "CAPTURED"
  | "QR_READY";
