export async function takeScreenshot(video: HTMLVideoElement): Promise<Blob> {
  const MAX_WIDTH = 1280;

  // Scale down if needed
  let w = video.videoWidth;
  let h = video.videoHeight;
  if (w > MAX_WIDTH) {
    const ratio = MAX_WIDTH / w;
    w = MAX_WIDTH;
    h = Math.round(h * ratio);
  }

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d")!;

  // Mirror horizontally (match the flipped display)
  ctx.translate(w, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, w, h);

  // Convert to Blob asynchronously using native API (prevents binary corruption)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      "image/jpeg",
      0.85
    );
  });
}
