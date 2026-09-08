"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RESOURCES } from "@/lib/admin-schema";

const FIXED = [
  { href: "/admin", label: "ภาพรวม" },
  { href: "/admin/live", label: "คุมผลสดหน้างาน" },
  { href: "/admin/registrations", label: "ใบสมัคร" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const items = [
    ...FIXED,
    ...RESOURCES.map((r) => ({ href: `/admin/${r.key}`, label: r.title })),
    { href: "/admin/settings", label: "ตั้งค่างาน" },
  ];

  return (
    <nav className="admin-nav" aria-label="เมนูผู้ดูแล">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
