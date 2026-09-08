import Link from "next/link";
import { PageHead } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageHead kicker="404" title="ไม่พบหน้าที่ต้องการ" lead="หน้าที่คุณเปิดอาจถูกย้ายหรือถูกลบไปแล้ว" />
      <section>
        <div className="shell">
          <div className="row">
            <Link className="btn btn-navy" href="/">
              กลับหน้าแรก
            </Link>
            <Link className="btn btn-ink" href="/live">
              ดูผลการแข่งขันสด
            </Link>
            <Link className="btn btn-ink" href="/schedule">
              กำหนดการ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
