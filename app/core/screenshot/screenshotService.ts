export function takeScreenshot(video: HTMLVideoElement): string {
  // Draw current video frame to canvas
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d")!;

  // Mirror horizontally (to match the flipped display)
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.drawImage(video, 0, 0);

  return canvas.toDataURL("image/jpeg", 0.85);
}
