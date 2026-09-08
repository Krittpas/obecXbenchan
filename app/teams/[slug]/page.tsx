import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import MatchCard from "@/components/MatchCard";
import { PageHead, SectionHead } from "@/components/ui";
import { getMatches, getTeam, getTeams } from "@/lib/queries";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const teams = await getTeams();
  return teams.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const team = await getTeam(slug);
  if (!team) return { title: "ไม่พบทีม" };
  return {
    title: team.name,
    description: `รายชื่อนักกีฬาและผลการแข่งขันของทีม ${team.name} ${team.school ?? ""}`.trim(),
  };
}

export default async function TeamPage({ params }: Params) {
  const { slug } = await params;
  const [team, matches] = await Promise.all([getTeam(slug), getMatches()]);
  if (!team) notFound();

  const played = matches.filter((m) => m.team_a_id === team.id || m.team_b_id === team.id);
  const players = team.players ?? [];
  const starters = players.filter((p) => !p.is_sub);
  const subs = players.filter((p) => p.is_sub);

  return (
    <>
      <PageHead
        kicker={team.district ? `ตัวแทนอำเภอ${team.district}` : "TEAM"}
        title={team.name}
        lead={team.school ?? undefined}
      />

      <section>
        <div className="shell">
          <div className="row" style={{ marginBottom: "1.6rem" }}>
            <span className="pill pill-gold">สายที่ {team.seed ?? "–"}</span>
            {team.note && <span className="pill pill-wait">{team.note}</span>}
            <Link className="btn btn-ink btn-sm" href="/teams">
              ← กลับไปหน้ารายชื่อทีม
            </Link>
          </div>

          <SectionHead title="รายชื่อนักกีฬา" />
          {players.length === 0 ? (
            <p className="empty">ยังไม่ได้บันทึกรายชื่อนักกีฬาของทีมนี้</p>
          ) : (
            <>
              <div className="roster">
                {starters.map((p) => (
                  <div className="player" key={p.id}>
                    <b>{p.name}</b>
                    <span>
                      {p.ign ? `IGN: ${p.ign}` : "—"}
                      {p.role ? ` · ${p.role}` : ""}
                    </span>
                  </div>
                ))}
              </div>
              {subs.length > 0 && (
                <>
                  <h3 style={{ margin: "1.6rem 0 0.8rem", color: "var(--navy)", fontSize: "1rem" }}>
                    ผู้เล่นสำรอง
                  </h3>
                  <div className="roster">
                    {subs.map((p) => (
                      <div className="player" key={p.id}>
                        <b>{p.name}</b>
                        <span>
                          {p.ign ? `IGN: ${p.ign}` : "—"}
                          {p.role ? ` · ${p.role}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          <div style={{ marginTop: "2.6rem" }}>
            <SectionHead title="โปรแกรมและผลการแข่งขัน" />
            {played.length === 0 ? (
              <p className="empty">ยังไม่มีคู่แข่งขันของทีมนี้</p>
            ) : (
              <div className="grid-3">
                {played.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
