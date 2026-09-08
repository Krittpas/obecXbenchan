import Link from "next/link";
import type { ReactNode } from "react";
import { DIVISION_LABEL, type Faq, type Match, type Team } from "@/lib/types";
import { thaiDateTimeShort } from "@/lib/format";

export function SectionHead({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className={action ? "sec-head sec-head--row" : "sec-head"}>
      <div>
        <h2>{title}</h2>
        <div className="rule" />
        {lead && <p>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHead({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="pagehead">
      <div className="shell">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {lead && <p>{lead}</p>}
      </div>
    </div>
  );
}

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link className="team" href={`/teams/${team.slug}`}>
      <span className="seed" style={team.color ? { background: team.color } : undefined}>
        {team.seed ?? "–"}
      </span>
      <span>
        <h3>{team.name}</h3>
        <span className="school">
          {team.division ? DIVISION_LABEL[team.division] : "ยังไม่ระบุรุ่น"}
          {team.teacher ? ` · ครู${team.teacher}` : ""}
        </span>
        {team.note && <span className="tag"> · {team.note}</span>}
      </span>
    </Link>
  );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) return <p className="empty">ยังไม่มีคำถามที่ถามบ่อย</p>;
  return (
    <div>
      {faqs.map((f) => (
        <details className="faq" key={f.id}>
          <summary>{f.question}</summary>
          <p>{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function LiveBar({ matches }: { matches: Match[] }) {
  const live = matches.find((m) => m.status === "live");
  if (!live) return null;
  const a = live.team_a?.name ?? live.label_a ?? "TBD";
  const b = live.team_b?.name ?? live.label_b ?? "TBD";
  return (
    <div className="livebar">
      <div className="shell">
        <span className="pulse" aria-hidden="true" />
        <b>กำลังแข่ง</b>
        <span>
          {live.division ? `${DIVISION_LABEL[live.division]} · ` : ""}
          {live.round_name} · {a} {live.score_a ?? 0} – {live.score_b ?? 0} {b}
        </span>
        <span className="mute" style={{ color: "rgba(255,255,255,.75)" }}>
          {thaiDateTimeShort(live.scheduled_at)}
        </span>
        <Link href="/live">ดูผลสดทั้งหมด →</Link>
      </div>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>;
}
