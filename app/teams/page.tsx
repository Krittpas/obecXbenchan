import type { Metadata } from "next";
import { PageHead, TeamCard } from "@/components/ui";
import { getTeams } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ทีมที่เข้าแข่งขัน",
  description: "รายชื่อทีมตัวแทนโรงเรียนที่ผ่านการรับรองให้เข้าร่วมการแข่งขัน",
};

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <>
      <PageHead
        kicker="TEAMS"
        title="ทีมที่เข้าแข่งขัน"
        lead={`ทั้งหมด ${teams.length} ทีม เรียงตามลำดับสายที่จับสลากได้ กดที่ทีมเพื่อดูรายชื่อนักกีฬา`}
      />
      <section>
        <div className="shell">
          {teams.length === 0 ? (
            <p className="empty">ยังไม่มีทีมที่ได้รับการรับรอง</p>
          ) : (
            <div className="teams">
              {teams.map((t) => (
                <TeamCard key={t.id} team={t} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
