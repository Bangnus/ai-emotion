export async function uploadImage(base64Image: string): Promise<string> {
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const { url } = await res.json();

  // Vercel Blob returns a full public URL already
  return url;
}
