import Link from "next/link";
import type { Settings, Sponsor } from "@/lib/types";

export default function SiteFooter({
  settings,
  sponsors,
}: {
  settings: Settings;
  sponsors: Sponsor[];
}) {
  return (
    <footer className="site">
      <div className="shell">
        <div className="foot-grid">
          <div>
            <h4>{settings.event_name}</h4>
            <p style={{ maxWidth: "46ch" }}>
              {settings.tagline} จัดการแข่งขัน ณ {settings.venue_name}
            </p>
            <p style={{ marginTop: "0.8rem" }}>
              โทร. {settings.contact_phone} · LINE {settings.contact_line}
            </p>
          </div>

          <div>
            <h4>ลัดไปยังหน้า</h4>
            <ul>
              <li>
                <Link href="/live">ผลสด</Link>
              </li>
              <li>
                <Link href="/bracket">สายการแข่งขัน</Link>
              </li>
              <li>
                <Link href="/schedule">กำหนดการ</Link>
              </li>
              <li>
                <Link href="/teams">ทีมที่เข้าแข่ง</Link>
              </li>
              <li>
                <Link href="/register">สมัครแข่งขัน</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>ผู้จัดและผู้สนับสนุน</h4>
            <ul>
              {sponsors.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="foot-end">
          <span>© 2569 {settings.event_short} · เว็บไซต์เพื่อการประชาสัมพันธ์การแข่งขัน</span>
          <Link href="/admin">สำหรับเจ้าหน้าที่</Link>
        </div>
      </div>
    </footer>
  );
}
