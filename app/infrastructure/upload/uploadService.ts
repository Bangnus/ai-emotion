export async function uploadImage(imageBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", imageBlob, `photo-${Date.now()}.jpg`);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed: ${err}`);
  }

  const { url } = await res.json();
  return url;
}
