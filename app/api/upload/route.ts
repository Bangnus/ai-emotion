import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "private",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Upload failed: " + err.message },
      { status: 500 }
    );
  }
}
