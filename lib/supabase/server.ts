import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

/** client ฝั่งเซิร์ฟเวอร์ที่ผูกกับ cookie ของผู้ใช้ (ใช้ตรวจ session ของแอดมิน) */
export async function createServerSupabase() {
  if (!isSupabaseConfigured) return null;
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          /* เรียกจาก Server Component — ปล่อยให้ middleware เป็นคนต่ออายุ session */
        }
      },
    },
  });
}
