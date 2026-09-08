import { approveRegistration, setRegistrationStatus } from "../../actions";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { thaiDateTimeShort } from "@/lib/format";
import type { Registration } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ saved?: string; approved?: string }> };

const LABEL: Record<string, string> = {
  pending: "รอตรวจสอบ",
  approved: "รับรองแล้ว",
  rejected: "ไม่ผ่าน",
};

async function loadRegistrations(): Promise<Registration[] | null> {
  const db = createAdminSupabase();
  if (!db) return null;
  const { data, error } = await db
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });
  return error ? null : ((data ?? []) as unknown as Registration[]);
}

export default async function AdminRegistrationsPage({ searchParams }: Props) {
  const [{ saved, approved }, rows] = await Promise.all([searchParams, loadRegistrations()]);

  return (
    <>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--navy)" }}>ใบสมัคร</h1>
      <p className="mute" style={{ marginBottom: "1.2rem" }}>
        กด “รับรองและสร้างทีม” เพื่อสร้างทีมพร้อมรายชื่อนักกีฬาลงระบบโดยอัตโนมัติ
      </p>

      {(saved || approved) && (
        <div className="alert alert-ok" role="status">
          {approved ? "รับรองใบสมัครและสร้างทีมเรียบร้อยแล้ว" : "อัปเดตสถานะใบสมัครแล้ว"}
        </div>
      )}

      {rows === null ? (
        <div className="alert alert-err">
          อ่านใบสมัครไม่ได้ — ต้องตั้งค่า <code>SUPABASE_SERVICE_ROLE_KEY</code> ก่อน
        </div>
      ) : rows.length === 0 ? (
        <p className="empty">ยังไม่มีใบสมัครเข้ามา</p>
      ) : (
        rows.map((reg) => (
          <div className="panel" key={reg.id}>
            <h2>
              {reg.team_name} · {reg.school}
            </h2>

            <div className="row" style={{ marginBottom: "0.9rem" }}>
              <span className={`pill ${reg.status === "approved" ? "pill-done" : reg.status === "rejected" ? "pill-live" : "pill-wait"}`}>
                {LABEL[reg.status] ?? reg.status}
              </span>
              <span className="mute" style={{ fontSize: 13 }}>
                ส่งเมื่อ {thaiDateTimeShort(reg.created_at)} · รายการ {reg.game_slug}
              </span>
            </div>

            <ul className="vlist" style={{ marginBottom: "0.9rem" }}>
              <li>
                <span className="k">ผู้จัดการทีม</span>
                <span className="v">
                  {reg.manager_name} · {reg.manager_phone}
                  {reg.manager_email ? ` · ${reg.manager_email}` : ""}
                </span>
              </li>
              <li>
                <span className="k">อำเภอ</span>
                <span className="v">{reg.district ?? "—"}</span>
              </li>
              <li>
                <span className="k">นักกีฬา</span>
                <span className="v">
                  {(reg.players ?? [])
                    .map((p) => `${p.name}${p.ign ? ` (${p.ign})` : ""}${p.is_sub ? " [สำรอง]" : ""}`)
                    .join(", ") || "—"}
                </span>
              </li>
              {reg.note && (
                <li>
                  <span className="k">หมายเหตุ</span>
                  <span className="v">{reg.note}</span>
                </li>
              )}
            </ul>

            <div className="row">
              {reg.status !== "approved" && (
                <form action={approveRegistration}>
                  <input type="hidden" name="id" value={reg.id} />
                  <button className="btn btn-navy btn-sm" type="submit">
                    รับรองและสร้างทีม
                  </button>
                </form>
              )}
              <form action={setRegistrationStatus}>
                <input type="hidden" name="id" value={reg.id} />
                <input type="hidden" name="status" value="rejected" />
                <button className="btn btn-danger btn-sm" type="submit">
                  ไม่ผ่าน
                </button>
              </form>
              <form action={setRegistrationStatus}>
                <input type="hidden" name="id" value={reg.id} />
                <input type="hidden" name="status" value="pending" />
                <button className="btn btn-ink btn-sm" type="submit">
                  กลับเป็นรอตรวจสอบ
                </button>
              </form>
            </div>
          </div>
        ))
      )}
    </>
  );
}
