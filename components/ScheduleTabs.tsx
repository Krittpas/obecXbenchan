"use client";

import { useMemo, useState } from "react";
import type { ScheduleItem } from "@/lib/types";
import { thaiDateFull } from "@/lib/format";

export default function ScheduleTabs({ items }: { items: ScheduleItem[] }) {
  const days = useMemo(() => {
    const map = new Map<string, { day: string; title: string; rows: ScheduleItem[] }>();
    for (const item of items) {
      const entry = map.get(item.day) ?? {
        day: item.day,
        title: item.day_title || thaiDateFull(item.day),
        rows: [],
      };
      entry.rows.push(item);
      map.set(item.day, entry);
    }
    return [...map.values()]
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((d) => ({ ...d, rows: d.rows.sort((a, b) => a.sort - b.sort) }));
  }, [items]);

  const [active, setActive] = useState(0);

  if (days.length === 0) return <p className="empty">ยังไม่มีกำหนดการ</p>;

  const current = days[Math.min(active, days.length - 1)];

  return (
    <>
      <div className="daytabs" role="tablist" aria-label="เลือกวันแข่งขัน">
        {days.map((d, i) => (
          <button
            key={d.day}
            className="daytab"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
          >
            {thaiDateFull(d.day)}
          </button>
        ))}
      </div>

      <div className="tablewrap">
        <table className="data">
          <caption>{current.title}</caption>
          <thead>
            <tr>
              <th scope="col">เวลา</th>
              <th scope="col">รายการ</th>
              <th scope="col">หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {current.rows.map((row) => (
              <tr key={row.id} className={row.tag ? `is-${row.tag}` : undefined}>
                <td className="time">{row.time}</td>
                <td>{row.title}</td>
                <td className="mute">{row.note ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
