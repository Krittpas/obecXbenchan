"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const NAV = [
  { href: "/live", label: "ผลสด" },
  { href: "/bracket", label: "สายการแข่งขัน" },
  { href: "/schedule", label: "กำหนดการ" },
  { href: "/teams", label: "ทีมที่เข้าแข่ง" },
  { href: "/standings", label: "อันดับ" },
  { href: "/news", label: "ข่าวสาร" },
  { href: "/gallery", label: "ภาพบรรยากาศ" },
  { href: "/rules", label: "กติกา" },
  { href: "/venue", label: "สนามแข่ง" },
];

export default function SiteHeader({
  eventShort,
  registerOpen,
}: {
  eventShort: string;
  registerOpen: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isOn = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="topbar">
      <div className="shell topbar-in">
        <Link className="brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            บ
          </span>
          <span>
            <b>{eventShort}</b>
            <span>การแข่งขันกีฬาอีสปอร์ตนักเรียน ประจำปี 2569</span>
          </span>
        </Link>

        <nav className="navlinks" aria-label="เมนูหลัก">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isOn(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
          {registerOpen && (
            <Link href="/register" aria-current={isOn("/register") ? "page" : undefined}>
              <b style={{ color: "var(--gold)" }}>สมัครแข่งขัน</b>
            </Link>
          )}
        </nav>

        <button
          className="burger"
          aria-expanded={open}
          aria-controls="site-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "ปิด" : "เมนู"}
        </button>
      </div>

      <div className={`shell drawer${open ? " open" : ""}`} id="site-drawer">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        {registerOpen && <Link href="/register">สมัครแข่งขัน</Link>}
      </div>
    </header>
  );
}
