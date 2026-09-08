import type { Metadata } from "next";
import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";
import { PageHead } from "@/components/ui";
import { getGames, getSettings } from "@/lib/queries";
import { thaiDate } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "สมัครเข้าแข่งขัน",
  description: "แบบฟอร์มสมัครเข้าร่วมการแข่งขันสำหรับทีมตัวแทนสถานศึกษา ไม่มีค่าสมัคร",
};

export default async function RegisterPage() {
  const [settings, games] = await Promise.all([getSettings(), getGames()]);

  return (
    <>
      <PageHead
        kicker="REGISTRATION"
        title="สมัครเข้าแข่งขัน"
        lead={
          settings.register_open
            ? `เปิดรับสมัครถึงวันที่ ${thaiDate(settings.register_deadline ?? settings.start_at)} ไม่มีค่าสมัคร โรงเรียนละ 1 ทีมต่อรายการ`
            : "ขณะนี้ปิดรับสมัครแล้ว"
        }
      />
      <section>
        <div className="shell" style={{ maxWidth: 860 }}>
          {!settings.register_open ? (
            <div className="alert alert-info">
              <b>ปิดรับสมัครแล้ว</b>
              <p style={{ marginTop: "0.4rem" }}>
                ติดตามประกาศครั้งถัดไปได้ที่หน้า <Link href="/news">ข่าวประชาสัมพันธ์</Link>{" "}
                หรือติดต่อ {settings.contact_phone}
              </p>
            </div>
          ) : (
            <>
              <div className="alert alert-info">
                กรุณากรอกข้อมูลให้ครบถ้วนและตรวจสอบความถูกต้องก่อนส่ง
                ฝ่ายจัดการแข่งขันจะติดต่อกลับเพื่อยืนยันสิทธิ์ภายใน 3 วันทำการ ·{" "}
                <Link href="/rules">อ่านระเบียบการแข่งขัน</Link>
              </div>
              <RegisterForm games={games} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
