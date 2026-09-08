"use client";

import { useEffect, useState } from "react";

type Unit = { key: string; label: string; value: number };

function diff(target: number) {
  return Math.max(0, target - Date.now());
}

export default function Countdown({ startAt, endAt }: { startAt: string; endAt: string }) {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ก่อน hydrate ยังไม่รู้เวลาเครื่องผู้ใช้ จึงกันช่องว่างไว้ไม่ให้หน้ากระตุก */
  if (now === null) {
    return <div className="count" aria-hidden="true" style={{ minHeight: "76px" }} />;
  }

  if (now >= end) {
    return (
      <div className="count done">
        <div className="cell" style={{ minWidth: "auto", padding: "0.7rem 1.1rem" }}>
          <b style={{ fontSize: "1.15rem" }}>การแข่งขันเสร็จสิ้นแล้ว</b>
          <span>ขอบคุณทุกทีมที่ร่วมการแข่งขัน</span>
        </div>
      </div>
    );
  }

  if (now >= start) {
    return (
      <div className="count done">
        <div className="cell" style={{ minWidth: "auto", padding: "0.7rem 1.1rem" }}>
          <b style={{ fontSize: "1.15rem" }}>กำลังแข่งขันอยู่ในขณะนี้</b>
          <span>ติดตามผลสดได้ที่หน้าผลสด</span>
        </div>
      </div>
    );
  }

  const ms = diff(start);
  const s = Math.floor(ms / 1000);
  const units: Unit[] = [
    { key: "d", label: "วัน", value: Math.floor(s / 86400) },
    { key: "h", label: "ชั่วโมง", value: Math.floor((s % 86400) / 3600) },
    { key: "m", label: "นาที", value: Math.floor((s % 3600) / 60) },
    { key: "s", label: "วินาที", value: s % 60 },
  ];

  return (
    <div className="count" aria-live="off">
      {units.map((u) => (
        <div className="cell" key={u.key}>
          <b>{String(u.value).padStart(2, "0")}</b>
          <span>{u.label}</span>
        </div>
      ))}
    </div>
  );
}
