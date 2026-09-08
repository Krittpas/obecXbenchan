import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui";
import { buildStandings, getMatches, getTeams } from "@/lib/queries";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "ตารางอันดับ",
  description: "อันดับทีมคำนวณจากผลการแข่งขันที่จบแล้ว เรียงตามจำนวนแมตช์ที่ชนะและผลต่างเกม",
};

export default async function StandingsPage() {
  const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
  const rows = buildStandings(teams, matches);
  const anyPlayed = rows.some((r) => r.played > 0);

  return (
    <>
      <PageHead
        kicker="STANDINGS"
        title="ตารางอันดับ"
        lead="คำนวณอัตโนมัติจากผลการแข่งขันที่บันทึกแล้ว เรียงตามแมตช์ที่ชนะ ผลต่างเกม และเกมที่ชนะตามลำดับ"
      />
      <section>
        <div className="shell">
          {!anyPlayed ? (
            <p className="empty">ยังไม่มีผลการแข่งขันที่จบสมบูรณ์</p>
          ) : (
            <div className="tablewrap">
              <table className="data">
                <caption>อันดับทีม ณ ผลการแข่งขันล่าสุด</caption>
                <thead>
                  <tr>
                    <th scope="col">อันดับ</th>
                    <th scope="col">ทีม</th>
                    <th scope="col">แข่ง</th>
                    <th scope="col">ชนะ</th>
                    <th scope="col">แพ้</th>
                    <th scope="col">เกมได้</th>
                    <th scope="col">เกมเสีย</th>
                    <th scope="col">ผลต่าง</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.team.id}>
                      <td className="time">{i + 1}</td>
                      <td>
                        <Link href={`/teams/${r.team.slug}`} style={{ fontWeight: 600 }}>
                          {r.team.name}
                        </Link>
                        <div className="mute" style={{ fontSize: 12.5 }}>
                          {r.team.school}
                        </div>
                      </td>
                      <td className="num">{r.played}</td>
                      <td className="num">{r.won}</td>
                      <td className="num">{r.lost}</td>
                      <td className="num">{r.gamesWon}</td>
                      <td className="num">{r.gamesLost}</td>
                      <td className="num">
                        {r.diff > 0 ? "+" : ""}
                        {r.diff}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
