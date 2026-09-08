import { thaiDateTimeShort } from "@/lib/format";
import type { Match, Side } from "@/lib/types";

export function StatusPill({ status }: { status: Match["status"] }) {
  if (status === "live") {
    return (
      <span className="pill pill-live">
        <span className="pulse" style={{ background: "currentColor" }} aria-hidden="true" />
        กำลังแข่ง
      </span>
    );
  }
  if (status === "done") return <span className="pill pill-done">จบแล้ว</span>;
  return <span className="pill pill-wait">รอแข่ง</span>;
}

function sideClass(match: Match, side: Side) {
  if (!match[side === "a" ? "team_a" : "team_b"]) return "side tbd";
  if (match.status !== "done" || !match.winner) return "side";
  return match.winner === side ? "side win" : "side lose";
}

export default function MatchCard({ match, isFinal = false }: { match: Match; isFinal?: boolean }) {
  const teamA = match.team_a ?? null;
  const teamB = match.team_b ?? null;

  const cls = [
    "match",
    match.status === "live" ? "is-live" : "",
    isFinal ? "is-final" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cls} aria-label={`คู่ ${match.code}`}>
      <header className="match-cap">
        <span>
          {match.code} · {thaiDateTimeShort(match.scheduled_at)} · Bo{match.best_of}
        </span>
        <StatusPill status={match.status} />
      </header>

      <div className={sideClass(match, "a")}>
        <span className="chip" style={teamA?.color ? { background: teamA.color } : undefined} />
        <span className="nm">{teamA?.name ?? "รอผู้ชนะรอบก่อนหน้า"}</span>
        <span className="sc num">{match.score_a ?? "–"}</span>
      </div>

      <div className={sideClass(match, "b")}>
        <span className="chip" style={teamB?.color ? { background: teamB.color } : undefined} />
        <span className="nm">{teamB?.name ?? "รอผู้ชนะรอบก่อนหน้า"}</span>
        <span className="sc num">{match.score_b ?? "–"}</span>
      </div>

      {match.note && (
        <p style={{ padding: "0.5rem 0.75rem", fontSize: 12.5, color: "var(--mute)" }}>{match.note}</p>
      )}
    </article>
  );
}
