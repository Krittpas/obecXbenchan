import type { Metadata } from "next";
import { PageHead, TeamCard } from "@/components/ui";
import { byDivision, getTeams } from "@/lib/queries";
import { DIVISION_LABEL, type Division } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ทีมที่เข้าแข่งขัน",
  description: "รายชื่อทีมนักเรียนที่เข้าร่วมการแข่งขัน แยกตามรุ่น ม.ต้น และ ม.ปลาย",
};

const DIVISIONS: Division[] = ["junior", "senior"];

export default async function TeamsPage() {
  const teams = await getTeams();
  const grouped = byDivision(teams);

  return (
    <>
      <PageHead
        kicker="TEAMS"
        title="ทีมที่เข้าแข่งขัน"
        lead={`ทั้งหมด ${teams.length} ทีม เรียงตามลำดับทีมวางในผังสาย กดที่ทีมเพื่อดูรายชื่อนักกีฬา`}
      />
      <section>
        <div className="shell">
          <nav className="jumpnav" aria-label="ข้ามไปยังรุ่น">
            {DIVISIONS.map((d) => (
              <a key={d} href={`#${d}`}>
                {DIVISION_LABEL[d]} ({grouped[d].length})
              </a>
            ))}
          </nav>

          {DIVISIONS.map((division) => (
            <div key={division} id={division} style={{ marginBottom: "2.8rem" }}>
              <div className="div-head">
                <h2>{DIVISION_LABEL[division]}</h2>
                <span className="meta">{grouped[division].length} ทีม</span>
              </div>
              {grouped[division].length === 0 ? (
                <p className="empty">ยังไม่มีทีมในรุ่นนี้</p>
              ) : (
                <div className="teams">
                  {grouped[division].map((t) => (
                    <TeamCard key={t.id} team={t} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {grouped.none.length > 0 && (
            <div id="unseeded">
              <div className="div-head">
                <h2>ทีมที่ยังไม่ปรากฏในผังสาย</h2>
                <span className="meta">{grouped.none.length} ทีม</span>
              </div>
              <p className="note" style={{ marginBottom: "1rem" }}>
                ทีมเหล่านี้ยังไม่ถูกจัดลงผังสายการแข่งขัน กรุณาตรวจสอบกับฝ่ายจัดการแข่งขัน
              </p>
              <div className="teams">
                {grouped.none.map((t) => (
                  <TeamCard key={t.id} team={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
