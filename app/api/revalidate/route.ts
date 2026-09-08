import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * ล้าง cache ของทั้งเว็บ เรียกจาก Supabase Database Webhooks ได้
 * POST /api/revalidate?secret=...   หรือส่ง header x-revalidate-secret
 */
export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: "ยังไม่ได้ตั้งค่า REVALIDATE_SECRET" }, { status: 500 });
  }

  const provided =
    request.nextUrl.searchParams.get("secret") ?? request.headers.get("x-revalidate-secret");

  if (provided !== secret) {
    return NextResponse.json({ ok: false, error: "รหัสไม่ถูกต้อง" }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() });
}
