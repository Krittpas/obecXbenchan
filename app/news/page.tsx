import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/ui";
import { getNews } from "@/lib/queries";
import { thaiDate } from "@/lib/format";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ข่าวประชาสัมพันธ์",
  description: "ประกาศและข่าวสารจากฝ่ายจัดการแข่งขัน",
};

export default async function NewsPage() {
  const posts = await getNews();

  return (
    <>
      <PageHead
        kicker="NEWS"
        title="ข่าวประชาสัมพันธ์"
        lead="ประกาศอย่างเป็นทางการจากคณะกรรมการจัดการแข่งขัน เรียงจากใหม่ไปเก่า"
      />
      <section>
        <div className="shell">
          {posts.length === 0 ? (
            <p className="empty">ยังไม่มีข่าวประชาสัมพันธ์</p>
          ) : (
            posts.map((post) => (
              <Link className="newsitem" href={`/news/${post.slug}`} key={post.id}>
                <time dateTime={post.published_at}>
                  {thaiDate(post.published_at)}
                  {post.pinned ? " · ปักหมุด" : ""}
                </time>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </>
  );
}
