import type { Metadata } from "next";
import { PageHead } from "@/components/ui";
import { getGallery } from "@/lib/queries";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "ภาพบรรยากาศการแข่งขัน",
  description: "ภาพบรรยากาศจากสนามแข่งขัน อัปโหลดโดยฝ่ายจัดการแข่งขัน",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageHead
        kicker="GALLERY"
        title="ภาพบรรยากาศการแข่งขัน"
        lead="ภาพจากสนามแข่งขัน อัปโหลดโดยฝ่ายประชาสัมพันธ์ระหว่างการแข่งขัน"
      />
      <section>
        <div className="shell">
          {items.length === 0 ? (
            <p className="empty">
              ยังไม่มีภาพบรรยากาศ — เจ้าหน้าที่เพิ่มภาพได้ที่แผงผู้ดูแล เมนู “ภาพบรรยากาศ”
            </p>
          ) : (
            <div className="grid-3">
              {items.map((item) => (
                <figure key={item.id} className="card" style={{ padding: 0 }}>
                  {/* ใช้ img ธรรมดาเพราะรูปมาจากลิงก์ภายนอกที่กำหนดเองได้ */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.caption ?? "ภาพบรรยากาศการแข่งขัน"} loading="lazy" />
                  {item.caption && (
                    <figcaption
                      style={{ padding: "0.7rem 0.9rem", fontSize: 13.5, color: "var(--mute)" }}
                    >
                      {item.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
