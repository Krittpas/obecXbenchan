import type { Metadata } from "next";
import Link from "next/link";

import { PageHead } from "@/components/ui";
import { buildStandings, byDivision, getMatches, getTeams } from "@/lib/queries";
import { DIVISION_LABEL, type Division } from "@/lib/types";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "ตารางอันดับ",
  description: "อันดับทีมแยกตามรุ่น คำนวณจากผลการแข่งขันที่จบแล้ว",
};

const DIVISIONS: Division[] = ["junior", "senior"];

export default async function StandingsPage() {
  const [teams, matches] = await Promise.all([getTeams(), getMatches()]);
  const teamsByDiv = byDivision(teams);
  const matchesByDiv = byDivision(matches);

  return (
    <>
      <PageHead
        kicker="STANDINGS"
        title="ตารางอันดับ"
        lead="คำนวณอัตโนมัติจากผลการแข่งขันที่บันทึกแล้ว เรียงตามแมตช์ที่ชนะ ผลต่างเกม และเกมที่ชนะตามลำดับ"
      />
      <section>
        <div className="shell">
          {DIVISIONS.map((division) => {
            const rows = buildStandings(teamsByDiv[division], matchesByDiv[division]);
            const anyPlayed = rows.some((r) => r.played > 0);

            return (
              <div key={division} id={division} style={{ marginBottom: "2.6rem" }}>
                <div className="div-head">
                  <h2>{DIVISION_LABEL[division]}</h2>
                  <span className="meta">{teamsByDiv[division].length} ทีม</span>
                </div>

                {!anyPlayed ? (
                  <p className="empty">ยังไม่มีผลการแข่งขันที่จบสมบูรณ์ในรุ่นนี้</p>
                ) : (
                  <div className="tablewrap">
                    <table className="data">
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
                              {r.team.seed ? (
                                <div className="mute" style={{ fontSize: 12.5 }}>
                                  ทีมวางอันดับ {r.team.seed}
                                </div>
                              ) : null}
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
            );
          })}
        </div>
      </section>
    </>
  );
}
