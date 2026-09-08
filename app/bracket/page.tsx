import type { Metadata } from "next";
import Bracket from "@/components/Bracket";
import { PageHead } from "@/components/ui";
import { getMatches, groupRounds } from "@/lib/queries";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "สายการแข่งขัน",
  description: "ผังสายการแข่งขันแบบแพ้คัดออก พร้อมผลแต่ละคู่",
};

export default async function BracketPage() {
  const matches = await getMatches();
  const rounds = groupRounds(matches);

  return (
    <>
      <PageHead
        kicker="TOURNAMENT BRACKET"
        title="สายการแข่งขัน"
        lead="ประกบคู่จากการจับสลากต่อหน้าผู้จัดการทีมทุกทีม ผลจะอัปเดตทันทีที่จบแต่ละแมตช์"
      />
      <section>
        <div className="shell">
          <Bracket rounds={rounds} />
          <p className="note" style={{ marginTop: "1.6rem" }}>
            เลื่อนตารางในแนวนอนเพื่อดูรอบถัดไป · ทีมที่ยังไม่ทราบผู้ผ่านเข้ารอบจะแสดงเป็น
            “รอผู้ชนะรอบก่อนหน้า”
          </p>
        </div>
      </section>
    </>
  );
}
