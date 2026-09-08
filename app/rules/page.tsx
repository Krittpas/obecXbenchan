import type { Metadata } from "next";
import { FaqList, PageHead, SectionHead } from "@/components/ui";
import { getFaqs, getRules } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "กติกาและระเบียบการแข่งขัน",
  description: "ระเบียบว่าด้วยคุณสมบัติผู้เข้าแข่งขัน การรายงานตัว อุปกรณ์ มารยาท และการประท้วง",
};

export default async function RulesPage() {
  const [rules, faqs] = await Promise.all([getRules(), getFaqs()]);

  return (
    <>
      <PageHead
        kicker="RULES & REGULATIONS"
        title="กติกาที่ต้องรู้ก่อนลงสนาม"
        lead="ผู้จัดการทีมมีหน้าที่ชี้แจงระเบียบให้นักกีฬาในสังกัดรับทราบก่อนวันแข่งขัน"
      />
      <section>
        <div className="shell">
          <div className="grid-3" style={{ marginBottom: "2.6rem" }}>
            {rules.map((r) => (
              <article className="rule-card" key={r.id}>
                <h3>{r.heading}</h3>
                <p>{r.body}</p>
              </article>
            ))}
          </div>

          <SectionHead title="คำถามที่ถามบ่อย" />
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  );
}
