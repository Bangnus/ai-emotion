export function takeScreenshot(video: HTMLVideoElement): Blob {
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

  // Convert to Blob synchronously via dataURL
  const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeType = "image/jpeg";
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeType });
}
