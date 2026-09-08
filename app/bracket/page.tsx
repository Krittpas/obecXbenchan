import type { Metadata } from "next";

import Bracket from "@/components/Bracket";
import { PageHead } from "@/components/ui";
import { CHALLONGE_URLS } from "@/lib/fallback";
import { byDivision, getMatches, getTeams, groupRounds } from "@/lib/queries";
import { DIVISION_LABEL, type Division } from "@/lib/types";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "สายการแข่งขัน",
  description: "ผังสายการแข่งขันแบบแพ้คัดออก รุ่น ม.ต้น และรุ่น ม.ปลาย พร้อมผลแต่ละคู่",
};

const DIVISIONS: Division[] = ["junior", "senior"];

export default async function BracketPage() {
  const [matches, teams] = await Promise.all([getMatches(), getTeams()]);
  const grouped = byDivision(matches);
  const teamsByDiv = byDivision(teams);

  return (
    <>
      <PageHead
        kicker="TOURNAMENT BRACKET"
        title="สายการแข่งขัน"
        lead="รอบ 16 ทีมและรอบ 8 ทีมแข่งแบบแพ้คัดออก Bo3 ผลจะอัปเดตทันทีที่จบแต่ละแมตช์"
      />

      <section>
        <div className="shell">
          <nav className="jumpnav" aria-label="ข้ามไปยังรุ่น">
            {DIVISIONS.map((d) => (
              <a key={d} href={`#${d}`}>
                {DIVISION_LABEL[d]}
              </a>
            ))}
          </nav>

          {DIVISIONS.map((division) => {
            const rounds = groupRounds(grouped[division]);
            return (
              <div key={division} id={division} style={{ marginBottom: "3rem" }}>
                <div className="div-head">
                  <h2>{DIVISION_LABEL[division]}</h2>
                  <span className="meta">
                    {teamsByDiv[division].length} ทีม · {grouped[division].length} คู่ ·{" "}
                    <a href={CHALLONGE_URLS[division]} target="_blank" rel="noopener">
                      ดูผังต้นฉบับบน Challonge
                    </a>
                  </span>
                </div>
                <Bracket rounds={rounds} />
              </div>
            );
          })}

          <p className="note">
            เลื่อนผังในแนวนอนเพื่อดูรอบถัดไป · ช่องที่ยังไม่ทราบผู้ผ่านเข้ารอบจะแสดงเป็น
            “ผู้ชนะคู่ …” ตามรหัสคู่ในรอบก่อนหน้า
            <br />
            <b>หมายเหตุ</b> — ตามระเบียบข้อ 5.2 รอบ 4 ทีมสุดท้ายใช้ระบบสายบนและสายล่าง
            (Double Elimination) ผังด้านบนแสดงตามที่ประกาศไว้บน Challonge
            คู่ของสายล่างจะประกาศเพิ่มเติมหน้างาน
          </p>
        </div>
      </section>
    </>
  );
}
