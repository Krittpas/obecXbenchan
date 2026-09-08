import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

let cached: ReturnType<typeof createClient> | null = null;

/**
 * client แบบไม่ผูก cookie สำหรับอ่านข้อมูลสาธารณะ
 * ไม่แตะ next/headers จึงยังทำ static / ISR ได้
 */
export function publicSupabase() {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
