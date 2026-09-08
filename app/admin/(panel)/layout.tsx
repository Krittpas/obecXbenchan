import type { Metadata } from "next";
import Link from "next/link";

import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { signOut } from "../actions";

export const metadata: Metadata = {
  title: "แผงผู้ดูแล",
  robots: { index: false, follow: false },
};

/* หน้าแผงผู้ดูแลต้องอ่าน session จาก cookie เสมอ จึงห้าม cache */
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="shell admin-shell">
      <div>
        <AdminNav />
        <div className="panel" style={{ marginTop: "1rem" }}>
          <p className="mute" style={{ fontSize: 13, wordBreak: "break-all" }}>
            {user.email}
          </p>
          <form action={signOut}>
            <button className="btn btn-ink btn-sm" type="submit" style={{ marginTop: "0.5rem" }}>
              ออกจากระบบ
            </button>
          </form>
          <Link className="btn btn-ink btn-sm" href="/" style={{ marginTop: "0.5rem" }}>
            ดูหน้าเว็บจริง
          </Link>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
