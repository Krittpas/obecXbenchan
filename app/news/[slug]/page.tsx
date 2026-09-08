import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHead } from "@/components/ui";
import { getNews, getNewsPost } from "@/lib/queries";
import { thaiDate } from "@/lib/format";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getNews();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) return { title: "ไม่พบข่าว" };
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function NewsPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getNewsPost(slug);
  if (!post) notFound();

  return (
    <>
      <PageHead kicker={thaiDate(post.published_at)} title={post.title} lead={post.excerpt ?? undefined} />
      <section>
        <div className="shell">
          <article className="prose">
            {post.body.split("\n").map((line, i) =>
              line.trim() === "" ? null : <p key={i}>{line}</p>,
            )}
          </article>
          <Link className="btn btn-ink" style={{ marginTop: "1.6rem" }} href="/news">
            ← กลับไปหน้าข่าวทั้งหมด
          </Link>
        </div>
      </section>
    </>
  );
}
