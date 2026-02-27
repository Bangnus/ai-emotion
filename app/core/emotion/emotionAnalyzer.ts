import { EmotionScores } from "@/app/shared/types";

export function analyzeEmotion(blendshapes: any[]): EmotionScores {
  function s(name: string) {
    return blendshapes.find((b) => b.categoryName === name)?.score || 0;
  }

  // Happy: ปากยิ้ม + แก้มยกขึ้น
  const happy = normalize(
    s("mouthSmileLeft") * 0.3 +
      s("mouthSmileRight") * 0.3 +
      s("cheekSquintLeft") * 0.2 +
      s("cheekSquintRight") * 0.2
  );

  // Sad: มุมปากหุบลง + คิ้วด้านในยกขึ้น + ปากล่างยื่น
  const sad = normalize(
    s("mouthFrownLeft") * 0.25 +
      s("mouthFrownRight") * 0.25 +
      s("browInnerUp") * 0.3 +
      s("mouthLowerDownLeft") * 0.1 +
      s("mouthLowerDownRight") * 0.1
  );

  // Angry: คิ้วขมวดลง + จมูกย่น + ขากรรไกรเกร็ง
  const angry = normalize(
    s("browDownLeft") * 0.25 +
      s("browDownRight") * 0.25 +
      s("noseSneerLeft") * 0.15 +
      s("noseSneerRight") * 0.15 +
      s("jawForward") * 0.1 +
      s("mouthPressLeft") * 0.05 +
      s("mouthPressRight") * 0.05
  );

  // Surprised: เบิกตากว้าง + คิ้วยกขึ้น + อ้าปาก (ลด sensitivity ลงเพราะคนตากว้างมักโดนจับผิดเป็นตกใจ)
  const rawSurprised =
    s("eyeWideLeft") * 0.2 +
    s("eyeWideRight") * 0.2 +
    s("browOuterUpLeft") * 0.15 +
    s("browOuterUpRight") * 0.15 +
    s("browInnerUp") * 0.1 +
    s("jawOpen") * 0.2;
  const surprised = Math.min(Math.round(rawSurprised * 130), 100);

  // Neutral: หน้านิ่ง (คะแนนจะสูงเมื่ออารมณ์อื่นต่ำทั้งหมด)
  // ให้ค่าเริ่มต้นสูง แต่จะถูกหักลบด้วยอารมณ์ที่ชัดเจน
  const maxEmotion = Math.max(happy, sad, angry, surprised);
  const neutral = Math.max(0, 100 - maxEmotion);

  return { happy, sad, angry, surprised, neutral };
}

function normalize(v: number) {
  return Math.min(Math.round(v * 200), 100);
}
