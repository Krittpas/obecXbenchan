import type { Metadata } from "next";
import { redirect } from "next/navigation";

import LoginForm from "@/components/admin/LoginForm";
import { PageHead } from "@/components/ui";
import { getAdminUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบผู้ดูแล",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  return (
    <>
      <PageHead
        kicker="STAFF ONLY"
        title="เข้าสู่ระบบผู้ดูแล"
        lead="สำหรับคณะกรรมการและเจ้าหน้าที่ฝ่ายจัดการแข่งขันเท่านั้น"
      />
      <section>
        <div className="shell" style={{ maxWidth: 420 }}>
          {!isSupabaseConfigured && (
            <div className="alert alert-err">
              ยังไม่ได้ตั้งค่า Supabase — ตั้งค่า <code>NEXT_PUBLIC_SUPABASE_URL</code> และ{" "}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> ก่อนจึงจะเข้าสู่ระบบได้
            </div>
          )}
          <div className="panel">
            <LoginForm />
          </div>
          <p className="mute" style={{ fontSize: 13.5 }}>
            สร้างบัญชีผู้ดูแลได้ที่ Supabase → Authentication → Users
            จากนั้นนำ user id ไปเพิ่มในตาราง <code>admins</code>
          </p>
        </div>
      </section>
    </>
  );
}
