import { NextResponse } from "next/server";
import { list, del } from "@vercel/blob";

// Cron job: ลบรูปที่อัปโหลดเกิน 1 ชั่วโมง
export async function GET() {
  try {
    const ONE_HOUR = 60 * 60 * 1000;
    const now = Date.now();
    let deletedCount = 0;

    // List all blobs
    let hasMore = true;
    let cursor: string | undefined;

    while (hasMore) {
      const result = await list({ cursor });

      for (const blob of result.blobs) {
        const uploadedAt = new Date(blob.uploadedAt).getTime();

        // ถ้าอัปโหลดเกิน 1 ชั่วโมง → ลบ
        if (now - uploadedAt > ONE_HOUR) {
          await del(blob.url);
          deletedCount++;
        }
      }

      hasMore = result.hasMore;
      cursor = result.cursor;
    }

    return NextResponse.json({
      success: true,
      deleted: deletedCount,
      time: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Cleanup error:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
