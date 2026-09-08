import type { Metadata } from "next";
import ScheduleTabs from "@/components/ScheduleTabs";
import { PageHead } from "@/components/ui";
import { getSchedule, getSettings } from "@/lib/queries";
import { thaiDate } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "กำหนดการแข่งขัน",
  description: "ตารางเวลาการแข่งขันตลอดสองวัน ตั้งแต่ลงทะเบียนจนถึงพิธีมอบรางวัล",
};

export default async function SchedulePage() {
  const [schedule, settings] = await Promise.all([getSchedule(), getSettings()]);

  return (
    <>
      <PageHead
        kicker="SCHEDULE"
        title="กำหนดการแข่งขัน"
        lead={`ระหว่างวันที่ ${thaiDate(settings.start_at)} ถึง ${thaiDate(settings.end_at)} เวลาอาจคลาดเคลื่อนตามความเหมาะสมหน้างาน`}
      />
      <section>
        <div className="shell">
          <ScheduleTabs items={schedule} />
          <p className="note" style={{ marginTop: "1.6rem" }}>
            ให้ยึดประกาศของคณะกรรมการจัดการแข่งขันที่สนามเป็นหลัก
            หากมีการเปลี่ยนแปลงจะประกาศผ่านหน้าข่าวสารของเว็บไซต์
          </p>
        </div>
      </section>
    </>
  );
}
