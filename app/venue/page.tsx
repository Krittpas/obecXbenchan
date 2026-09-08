import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { getSettings } from "@/lib/queries";
import { clockTime, thaiDateRange } from "@/lib/format";

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
        lead="จัดโดยสมาคมกีฬาแห่งจังหวัดจันทบุรี ร่วมกับโรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี · เข้าชมฟรีตลอดสองวัน"
      />
      <section>
        <div className="shell grid-2">
          <div className="venue-card">
            <h3>{settings.venue_name}</h3>
            <p style={{ marginBottom: "1rem" }}>{settings.venue_address}</p>
            <ul className="vlist">
              <li>
                <span className="k">วันแข่งขัน</span>
                <span className="v">{thaiDateRange(settings.start_at, settings.end_at)}</span>
              </li>
              <li>
                <span className="k">เวลาแข่งขัน</span>
                <span className="v">
                  ลงทะเบียน {clockTime(settings.start_at)} น. · แข่งขันถึง{" "}
                  {clockTime(settings.end_at)} น.
                </span>
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
                บัตรประจำตัวนักเรียน และอุปกรณ์ส่วนตัวที่ต้องผ่านการตรวจจากกรรมการก่อนใช้งาน
                · รายงานตัว ณ จุดที่คณะกรรมการกำหนดก่อนเวลาแข่งขัน 15 นาที
                หากเลยเวลาแข่งขันไป 15 นาทีโดยไม่มีเหตุอันสมควรจะถูกปรับเป็นแพ้บาย
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
                  <span className="k">ประธานคณะกรรมการ</span>
                  <span className="v">นายศิรปัญจพล พงสินณัฐญากร</span>
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
