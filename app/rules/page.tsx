import type { Metadata } from "next";
import { FaqList, PageHead, SectionHead } from "@/components/ui";
import { PENALTY_NOTE } from "@/lib/fallback";
import { getBannedSkins, getFaqs, getPenalties, getPrizes, getRules } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ระเบียบและกติกาการแข่งขัน",
  description:
    "ระเบียบการแข่งขันกีฬา E-Sport เกม Arena of Valor (RoV) คุณสมบัติผู้สมัคร โครงสร้างทีม อุปกรณ์ที่ต้องเตรียม รูปแบบการแข่งขัน กติกา สกินที่ห้ามใช้ บทลงโทษ และรางวัล",
};

export default async function RulesPage() {
  const [rules, faqs, prizes, penalties, bannedSkins] = await Promise.all([
    getRules(),
    getFaqs(),
    getPrizes(),
    getPenalties(),
    getBannedSkins(),
  ]);

  return (
    <>
      <PageHead
        kicker="RULES & REGULATIONS"
        title="ระเบียบการแข่งขันกีฬา E-Sport เกม RoV"
        lead="การแข่งขันกีฬานักเรียน นักศึกษาและประชาชน ชิงชนะเลิศแห่งจังหวัดจันทบุรี ประจำปี 2569"
      />
      <section>
        <div className="shell">
          <div className="alert alert-info" style={{ marginBottom: "2rem" }}>
            จัดโดยสมาคมกีฬาแห่งจังหวัดจันทบุรี ร่วมกับโรงเรียนเบญจมราชูทิศ จังหวัดจันทบุรี ·
            ครูที่ปรึกษาประจำทีมมีหน้าที่ชี้แจงระเบียบให้นักกีฬาในสังกัดรับทราบก่อนวันแข่งขัน
          </div>

          <nav className="jumpnav" aria-label="ข้ามไปยังหัวข้อ">
            <a href="#rules">ระเบียบทั้งหมด</a>
            <a href="#skins">สกินที่ห้ามใช้</a>
            <a href="#penalties">ตารางบทลงโทษ</a>
            <a href="#prizes">รางวัล</a>
            <a href="#faq">คำถามที่ถามบ่อย</a>
          </nav>

          <div id="rules" className="grid-3" style={{ marginBottom: "2.8rem" }}>
            {rules.map((r) => (
              <article className="rule-card" key={r.id}>
                <h3>{r.heading}</h3>
                <p>{r.body}</p>
              </article>
            ))}
          </div>

          {/* ── สกินที่ห้ามใช้ ── */}
          {bannedSkins.length > 0 && (
            <div id="skins" style={{ marginBottom: "2.8rem" }}>
              <SectionHead
                title="สกินที่ห้ามใช้ในการแข่งขัน"
                lead={`ตามระเบียบข้อ 5.6 รวมทั้งสิ้น ${bannedSkins.length} รายการ กดเพื่อเปิดดูรายชื่อทั้งหมด`}
              />
              <details className="panel">
                <summary style={{ cursor: "pointer", fontWeight: 600, color: "var(--navy)" }}>
                  เปิดดูรายชื่อสกินที่ห้ามใช้ทั้ง {bannedSkins.length} รายการ
                </summary>
                <div className="tablewrap" style={{ marginTop: "1rem" }}>
                  <table className="data">
                    <thead>
                      <tr>
                        <th scope="col">ลำดับ</th>
                        <th scope="col">ฮีโร่</th>
                        <th scope="col">สกิน</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bannedSkins.map((s, i) => (
                        <tr key={s.id}>
                          <td className="time">{i + 1}</td>
                          <td>{s.hero}</td>
                          <td>{s.skin}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          )}

          {/* ── ตารางบทลงโทษ ── */}
          {penalties.length > 0 && (
            <div id="penalties" style={{ marginBottom: "2.8rem" }}>
              <SectionHead title="ตารางสรุปบทลงโทษ" lead="ตามระเบียบข้อ 6.7" />
              <div className="tablewrap">
                <table className="data">
                  <thead>
                    <tr>
                      <th scope="col">ประเภทความผิด</th>
                      <th scope="col">ครั้งที่ 1</th>
                      <th scope="col">ครั้งที่ 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {penalties.map((p) => (
                      <tr key={p.id}>
                        <td>{p.offense}</td>
                        <td>{p.first_offense}</td>
                        <td className="mute">{p.second_offense ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="note" style={{ marginTop: "1rem" }}>
                <b>หมายเหตุ</b> — {PENALTY_NOTE}
              </p>
            </div>
          )}

          {/* ── รางวัล ── */}
          {prizes.length > 0 && (
            <div id="prizes" style={{ marginBottom: "2.8rem" }}>
              <SectionHead
                title="รางวัลการแข่งขัน"
                lead="คณะกรรมการจัดรางวัลให้กับทีมที่ชนะการแข่งขันในแต่ละรุ่น ทั้งรุ่น ม.ต้น และรุ่น ม.ปลาย (ระเบียบข้อ 8)"
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

          <div id="faq">
            <SectionHead title="คำถามที่ถามบ่อย" />
            <FaqList faqs={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
