import "server-only";
import { redirect } from "next/navigation";
import { createServerSupabase } from "./supabase/server";
import { createAdminSupabase } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";

export type AdminUser = { id: string; email: string };

/** คืนค่าผู้ใช้ที่ล็อกอินอยู่และอยู่ในตาราง admins เท่านั้น */
export async function getAdminUser(): Promise<AdminUser | null> {
  if (!isSupabaseConfigured) return null;

  const supabase = await createServerSupabase();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (error || !data) return null;

  return { id: user.id, email: user.email ?? "" };
}

export async function requireAdmin(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** client ที่ข้าม RLS — เรียกได้เฉพาะหลังตรวจสิทธิ์แอดมินแล้วเท่านั้น */
export async function adminDb() {
  await requireAdmin();
  const db = createAdminSupabase();
  if (!db) {
    throw new Error(
      "ยังไม่ได้ตั้งค่า SUPABASE_SERVICE_ROLE_KEY จึงแก้ไขข้อมูลจากแผงผู้ดูแลไม่ได้",
    );
  }
  return db;
}
