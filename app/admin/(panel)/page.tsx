import Link from "next/link";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { hasServiceRole } from "@/lib/supabase/env";
import { getMatches, getNews, getSettings, getTeams } from "@/lib/queries";
import { thaiDateTimeShort } from "@/lib/format";

export const dynamic = "force-dynamic";

async function pendingRegistrations(): Promise<number | null> {
  const db = createAdminSupabase();
  if (!db) return null;
  const { count, error } = await db
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  return error ? null : (count ?? 0);
}

export default async function AdminDashboard() {
  const [settings, teams, matches, news, pending] = await Promise.all([
    getSettings(),
    getTeams(),
    getMatches(),
    getNews(),
    pendingRegistrations(),
  ]);

  const live = matches.filter((m) => m.status === "live");
  const done = matches.filter((m) => m.status === "done").length;
  const upcoming = matches
    .filter((m) => m.status === "wait")
    .sort((a, b) => (a.scheduled_at ?? "").localeCompare(b.scheduled_at ?? ""))
    .slice(0, 5);

  return (
    <>
      <h1 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--navy)", marginBottom: "1.2rem" }}>
        ภาพรวมการแข่งขัน
      </h1>

      {!hasServiceRole && (
        <div className="alert alert-err">
          ยังไม่ได้ตั้งค่า <code>SUPABASE_SERVICE_ROLE_KEY</code> — ดูข้อมูลได้แต่ยังบันทึกการแก้ไขไม่ได้
        </div>
      )}

      <div className="stat-row">
        <div className="stat">
          <b>{teams.length}</b>
          <span>ทีมที่รับรองแล้ว</span>
        </div>
        <div className="stat">
          <b>{matches.length}</b>
          <span>คู่การแข่งขันทั้งหมด</span>
        </div>
        <div className="stat">
          <b>{done}</b>
          <span>คู่ที่แข่งจบแล้ว</span>
        </div>
        <div className="stat">
          <b>{pending ?? "–"}</b>
          <span>ใบสมัครรอตรวจสอบ</span>
        </div>
      </div>

      <div className="panel">
        <h2>กำลังแข่งขันอยู่</h2>
        {live.length === 0 ? (
          <p className="mute">ยังไม่มีคู่ที่เปิดสถานะ “กำลังแข่ง”</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "1.1rem" }}>
            {live.map((m) => (
              <li key={m.id}>
                {m.code} · {m.team_a?.name ?? "TBD"} {m.score_a ?? 0} – {m.score_b ?? 0}{" "}
                {m.team_b?.name ?? "TBD"}
              </li>
            ))}
          </ul>
        )}
        <Link className="btn btn-navy btn-sm" href="/admin/live" style={{ marginTop: "0.9rem" }}>
          เปิดหน้าคุมผลสด
        </Link>
      </div>

      <div className="panel">
        <h2>คู่ที่กำลังจะถึง</h2>
        {upcoming.length === 0 ? (
          <p className="mute">ไม่มีคู่ที่รอแข่ง</p>
        ) : (
          <div className="tablewrap">
            <table className="data">
              <thead>
                <tr>
                  <th scope="col">เวลา</th>
                  <th scope="col">คู่</th>
                  <th scope="col">รอบ</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((m) => (
                  <tr key={m.id}>
                    <td className="time">{thaiDateTimeShort(m.scheduled_at)}</td>
                    <td>
                      {m.team_a?.name ?? "TBD"} พบ {m.team_b?.name ?? "TBD"}
                    </td>
                    <td className="mute">{m.round_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>สถานะการรับสมัคร</h2>
        <p className="mute">
          ขณะนี้ {settings.register_open ? "เปิดรับสมัครอยู่" : "ปิดรับสมัครแล้ว"} · มีข่าวเผยแพร่{" "}
          {news.length} รายการ
        </p>
        <div className="row" style={{ marginTop: "0.8rem" }}>
          <Link className="btn btn-ink btn-sm" href="/admin/registrations">
            ตรวจใบสมัคร
          </Link>
          <Link className="btn btn-ink btn-sm" href="/admin/settings">
            ตั้งค่างาน
          </Link>
          <Link className="btn btn-ink btn-sm" href="/admin/news">
            เขียนข่าว
          </Link>
        </div>
      </div>
    </>
  );
}
