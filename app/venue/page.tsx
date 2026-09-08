import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { getSettings } from "@/lib/queries";
import { thaiDate } from "@/lib/format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "สนามแข่งขันและการเดินทาง",
  description: "ที่ตั้งสนามแข่งขัน ทางเข้า ที่จอดรถ และช่องทางติดต่อฝ่ายจัดการแข่งขัน",
};

export default async function VenuePage() {
  const settings = await getSettings();

  return (
    <>
      <PageHead
        kicker="VENUE"
        title="สนามแข่งขันและการเดินทาง"
        lead="แข่งขันในสถานที่จริง ผู้สนใจเข้าชมได้ฟรีตลอดสองวัน"
      />
      <section>
        <div className="shell grid-2">
          <div className="venue-card">
            <h3>{settings.venue_name}</h3>
            <p style={{ marginBottom: "1rem" }}>{settings.venue_address}</p>
            <ul className="vlist">
              <li>
                <span className="k">วันแข่งขัน</span>
                <span className="v">
                  {thaiDate(settings.start_at)} – {thaiDate(settings.end_at)}
                </span>
              </li>
              <li>
                <span className="k">ลงทะเบียน</span>
                <span className="v">08:30 น. หน้าห้องแข่งขัน</span>
              </li>
              <li>
                <span className="k">ทางเข้า</span>
                <span className="v">ประตูฝั่งถนนศรียานุสรณ์ ตรงป้อมยาม</span>
              </li>
              <li>
                <span className="k">ที่จอดรถ</span>
                <span className="v">ลานจอดในโรงเรียน จอดตามป้ายที่เจ้าหน้าที่กำหนด</span>
              </li>
              <li>
                <span className="k">ค่าเข้าชม</span>
                <span className="v">ไม่มีค่าใช้จ่าย ไม่ต้องลงทะเบียนล่วงหน้า</span>
              </li>
            </ul>
            <a
              className="btn btn-gold"
              style={{ marginTop: "1.2rem" }}
              href={settings.venue_maps_url}
              target="_blank"
              rel="noopener"
            >
              เปิดแผนที่ Google Maps
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="venue-card">
              <h3>สิ่งที่นักกีฬาต้องเตรียมมา</h3>
              <p>
                บัตรประจำตัวนักเรียนหรือบัตรประชาชน หนังสือรับรองสถานภาพนักเรียน
                อุปกรณ์ส่วนตัวที่ได้รับอนุญาต และรายงานตัวก่อนเวลาแข่งอย่างน้อย 30 นาที
              </p>
            </div>
            <div className="venue-card">
              <h3>ติดต่อฝ่ายจัดการแข่งขัน</h3>
              <ul className="vlist">
                <li>
                  <span className="k">โทรศัพท์</span>
                  <span className="v">{settings.contact_phone}</span>
                </li>
                <li>
                  <span className="k">LINE</span>
                  <span className="v">{settings.contact_line}</span>
                </li>
                <li>
                  <span className="k">เพจประชาสัมพันธ์</span>
                  <span className="v">
                    <a href={settings.contact_facebook} target="_blank" rel="noopener">
                      Facebook
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
