import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL, hasServiceRole } from "./env";

/** ข้าม RLS — ใช้เฉพาะใน Server Action / Route Handler ที่ตรวจสิทธิ์แอดมินแล้วเท่านั้น */
export function createAdminSupabase() {
  if (!hasServiceRole) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
