"use client";

import { useCallback, useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { DIVISION_LABEL, type Division, type Match, type Round } from "@/lib/types";

const MATCH_SELECT =
  "*, team_a:teams!matches_team_a_id_fkey(*), team_b:teams!matches_team_b_id_fkey(*)";

function group(matches: Match[]): Round[] {
  const map = new Map<number, Round>();
  for (const m of matches) {
    const round = map.get(m.round_order) ?? { name: m.round_name, order: m.round_order, matches: [] };
    round.matches.push(m);
    map.set(m.round_order, round);
  }
  return [...map.values()]
    .sort((a, b) => a.order - b.order)
    .map((r) => ({ ...r, matches: r.matches.sort((a, b) => a.slot - b.slot) }));
}

export default function LiveBoard({ initial }: { initial: Match[] }) {
  const [matches, setMatches] = useState<Match[]>(initial);
  const [connected, setConnected] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const db = createBrowserSupabase();
    if (!db) return;
    const { data, error } = await db
      .from("matches")
      .select(MATCH_SELECT)
      .order("division")
      .order("round_order")
      .order("slot");
    if (!error && data) {
      setMatches(data as unknown as Match[]);
      setUpdatedAt(new Date().toLocaleTimeString("th-TH", { hour12: false }));
    }
  }, []);

  useEffect(() => {
    const db = createBrowserSupabase();
    if (!db) return;

    void refresh();

    const channel = db
      .channel("matches-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, () => {
        void refresh();
      })
      .subscribe((status: string) => setConnected(status === "SUBSCRIBED"));

    /* กันไว้เผื่อ websocket หลุด — ดึงซ้ำทุก 30 วินาที */
    const poll = setInterval(() => void refresh(), 30_000);

    return () => {
      clearInterval(poll);
      void db.removeChannel(channel);
    };
  }, [refresh]);

  const live = matches.filter((m) => m.status === "live");
  const divisions: Division[] = ["junior", "senior"];

  return (
    <>
      <div className="row" style={{ marginBottom: "1.2rem" }}>
        <span className={`pill ${connected ? "pill-live" : "pill-wait"}`}>
          {connected ? "เชื่อมต่อผลสดแล้ว" : "โหมดอัปเดตตามรอบ"}
        </span>
        {updatedAt && <span className="mute" style={{ fontSize: 13 }}>อัปเดตล่าสุด {updatedAt} น.</span>}
      </div>

      {live.length > 0 && (
        <section style={{ padding: "0 0 2rem" }}>
          <h2 style={{ fontFamily: "var(--display)", fontWeight: 400, color: "var(--navy)", marginBottom: "0.9rem" }}>
            กำลังแข่งขันอยู่ขณะนี้
          </h2>
          <div className="grid-3">
            {live.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        </section>
      )}

      {divisions.map((division) => {
        const rounds = group(matches.filter((m) => m.division === division));
        if (rounds.length === 0) return null;

        return (
          <div key={division} id={division} style={{ marginBottom: "1rem" }}>
            <div className="div-head">
              <h2>{DIVISION_LABEL[division]}</h2>
              <span className="meta">
                {rounds.reduce((n, r) => n + r.matches.length, 0)} คู่
              </span>
            </div>

            {rounds.map((round) => (
              <section key={round.order} style={{ padding: "0 0 2rem" }}>
                <h3
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.08em",
                    color: "var(--mute)",
                    borderBottom: "1px solid var(--line)",
                    paddingBottom: "0.45rem",
                    marginBottom: "0.9rem",
                    textTransform: "uppercase",
                  }}
                >
                  {round.name}
                </h3>
                <div className="grid-3">
                  {round.matches.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        );
      })}
    </>
  );
}
