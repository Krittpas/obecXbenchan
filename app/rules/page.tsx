import type { Metadata } from "next";
import { FaqList, PageHead, SectionHead } from "@/components/ui";
import { getFaqs, getPrizes, getRules } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ระเบียบและกติกาการแข่งขัน",
  description:
    "ระเบียบการแข่งขันกีฬาอีสปอร์ต (ROV TOURNAMENT 2026) ว่าด้วยคุณสมบัติผู้เข้าแข่งขัน วิธีจัดการแข่งขัน การหยุดเกม วินัย บทลงโทษ รางวัล และการประท้วง",
};

export default async function RulesPage() {
  const [rules, faqs, prizes] = await Promise.all([getRules(), getFaqs(), getPrizes()]);

  return (
    <>
      <PageHead
        kicker="RULES & REGULATIONS"
        title="ระเบียบการแข่งขัน ROV TOURNAMENT 2026"
        lead="ระเบียบการแข่งขันกีฬาอีสปอร์ต การแข่งขันกีฬานักเรียน นักศึกษาและประชาชน ชิงชนะเลิศแห่งจังหวัดจันทบุรี ประจำปี 2569"
      />
      <section>
        <div className="shell">
          <div className="alert alert-info" style={{ marginBottom: "2rem" }}>
            ประกาศ ณ วันที่ 23 กรกฎาคม 2569 โดยคณะกรรมการจัดการแข่งขัน ROV TOURNAMENT 2026
            โรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี · ครูที่ปรึกษาประจำทีมมีหน้าที่ชี้แจงระเบียบ
            ให้นักกีฬาในสังกัดรับทราบก่อนวันแข่งขัน
          </div>

          <div className="grid-3" style={{ marginBottom: "2.6rem" }}>
            {rules.map((r) => (
              <article className="rule-card" key={r.id}>
                <h3>{r.heading}</h3>
                <p>{r.body}</p>
              </article>
            ))}
          </div>

          {prizes.length > 0 && (
            <div style={{ marginBottom: "2.6rem" }}>
              <SectionHead
                title="รางวัลการแข่งขัน"
                lead="คณะกรรมการจัดรางวัลให้กับทีมที่ชนะการแข่งขันในแต่ละรุ่น ทั้งรุ่น ม.ต้น และรุ่น ม.ปลาย (ระเบียบข้อ 9)"
              />
              <div className="prizes">
                {prizes.map((p, i) => (
                  <div className={`prize${i === 0 ? " is-top" : ""}`} key={p.id}>
                    <span className="rank">{i + 1}</span>
                    <div>
                      <h3>{p.place}</h3>
                      <b>{p.amount}</b>
                      {p.note && <span>{p.note}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SectionHead title="คำถามที่ถามบ่อย" />
          <FaqList faqs={faqs} />
        </div>
      </section>
    </>
  );
}
