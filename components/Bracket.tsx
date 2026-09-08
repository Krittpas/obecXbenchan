import MatchCard from "./MatchCard";
import type { Round } from "@/lib/types";

export default function Bracket({ rounds }: { rounds: Round[] }) {
  if (rounds.length === 0) {
    return <p className="empty">ยังไม่มีการประกาศสายการแข่งขัน</p>;
  }

  const lastOrder = rounds[rounds.length - 1].order;

  return (
    <div className="bracket-scroll">
      <div className="bracket">
        {rounds.map((round) => (
          <div className="round" key={round.order}>
            <h3>{round.name}</h3>
            {round.matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                isFinal={round.order === lastOrder && round.matches.length === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
