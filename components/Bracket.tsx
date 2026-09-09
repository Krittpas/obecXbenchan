import MatchCard from "./MatchCard";
import type { Match, Round } from "@/lib/types";

/* ขนาดคงที่ของผัง — ใช้คำนวณตำแหน่งแนวตั้งให้คู่ถัดไปอยู่กึ่งกลางระหว่างคู่ที่ป้อนเข้ามา */
const CARD_W = 268; // ความกว้างการ์ดหนึ่งคู่
const CARD_H = 106; // ความสูงการ์ดหนึ่งคู่ (ล็อกไว้ใน globals.css ด้วย)
const GAP_X = 64; // ระยะห่างระหว่างรอบ
const ROW = 132; // ระยะห่างแนวตั้งต่อหนึ่งคู่ในรอบแรก
const HEAD_H = 42; // ความสูงแถบชื่อรอบ

type Placed = { match: Match; x: number; y: number; center: number };
type Line = { key: string; left: number; top: number; width: number; height: number };

/**
 * คำนวณตำแหน่งของทุกคู่
 * คู่ในรอบแรกวางเรียงลงมาตามลำดับ ส่วนคู่รอบถัดไปวางที่ "ค่ากลาง" ของคู่ที่ป้อนเข้ามา
 * ทำให้ผังตรงกันทั้งกรณีสายเต็ม 16 ทีม และสายที่มีทีมบายอย่างรุ่น ม.ปลาย
 */
function layout(rounds: Round[]) {
  /* คู่ไหนป้อนเข้าคู่ไหนบ้าง — กลับด้านจาก next_code ของแต่ละแมตช์ */
  const feeders = new Map<string, Match[]>();
  for (const round of rounds) {
    for (const m of round.matches) {
      if (!m.next_code) continue;
      const list = feeders.get(m.next_code) ?? [];
      list.push(m);
      feeders.set(m.next_code, list);
    }
  }

  const centerOf = new Map<string, number>();
  const placed: Placed[] = [];
  let maxCenter = 0;

  rounds.forEach((round, roundIndex) => {
    let fallback = 0.5;
    for (const m of round.matches) {
      const sources = (feeders.get(m.code) ?? [])
        .map((f) => centerOf.get(f.code))
        .filter((v): v is number => typeof v === "number");

      const center =
        sources.length > 0
          ? sources.reduce((sum, v) => sum + v, 0) / sources.length
          : fallback;

      if (sources.length === 0) fallback = center + 1;
      centerOf.set(m.code, center);
      maxCenter = Math.max(maxCenter, center);

      placed.push({
        match: m,
        x: roundIndex * (CARD_W + GAP_X),
        y: HEAD_H + center * ROW - CARD_H / 2,
        center,
      });
    }
  });

  /* เส้นโยงจากคู่ที่ป้อนเข้ามา ไปยังคู่ถัดไป */
  const lines: Line[] = [];
  rounds.forEach((round, roundIndex) => {
    if (roundIndex === 0) return;
    const x = roundIndex * (CARD_W + GAP_X);
    const midX = x - GAP_X / 2;

    for (const m of round.matches) {
      const sources = feeders.get(m.code) ?? [];
      const centers = sources
        .map((f) => centerOf.get(f.code))
        .filter((v): v is number => typeof v === "number");
      if (centers.length === 0) continue;

      const target = centerOf.get(m.code);
      if (typeof target !== "number") continue;

      /* เส้นนอนออกจากการ์ดต้นทางแต่ละใบ */
      for (const c of centers) {
        lines.push({
          key: `${m.code}-in-${c}`,
          left: x - GAP_X,
          top: HEAD_H + c * ROW,
          width: GAP_X / 2,
          height: 1,
        });
      }

      /* เส้นตั้งเชื่อมต้นทางบน–ล่างเข้าหากัน */
      const top = Math.min(...centers, target);
      const bottom = Math.max(...centers, target);
      if (bottom > top) {
        lines.push({
          key: `${m.code}-join`,
          left: midX,
          top: HEAD_H + top * ROW,
          width: 1,
          height: (bottom - top) * ROW,
        });
      }

      /* เส้นนอนเข้าการ์ดปลายทาง */
      lines.push({
        key: `${m.code}-out`,
        left: midX,
        top: HEAD_H + target * ROW,
        width: GAP_X / 2,
        height: 1,
      });
    }
  });

  return {
    placed,
    lines,
    width: rounds.length * CARD_W + Math.max(0, rounds.length - 1) * GAP_X,
    height: HEAD_H + (maxCenter + 0.6) * ROW,
  };
}

export default function Bracket({ rounds }: { rounds: Round[] }) {
  if (rounds.length === 0) {
    return <p className="empty">ยังไม่มีการประกาศสายการแข่งขัน</p>;
  }

  const { placed, lines, width, height } = layout(rounds);
  const lastOrder = rounds[rounds.length - 1].order;
  const finalRound = rounds[rounds.length - 1];

  return (
    <div className="bracket-scroll">
      <div className="bracket-canvas" style={{ width, height }}>
        {rounds.map((round, i) => (
          <div
            className="bracket-round-head"
            key={round.order}
            style={{ left: i * (CARD_W + GAP_X), width: CARD_W }}
          >
            {round.name}
          </div>
        ))}

        {lines.map((line) => (
          <span
            className="bracket-line"
            key={line.key}
            aria-hidden="true"
            style={{ left: line.left, top: line.top, width: line.width, height: line.height }}
          />
        ))}

        {placed.map(({ match, x, y }) => (
          <div className="bracket-slot" key={match.id} style={{ left: x, top: y, width: CARD_W }}>
            <MatchCard
              match={match}
              isFinal={match.round_order === lastOrder && finalRound.matches.length === 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
