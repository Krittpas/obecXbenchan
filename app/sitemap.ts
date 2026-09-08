import type { MetadataRoute } from "next";
import { getNews, getTeams } from "@/lib/queries";
import { SITE_URL } from "@/lib/supabase/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [teams, news] = await Promise.all([getTeams(), getNews()]);

  const staticRoutes = [
    "",
    "/live",
    "/bracket",
    "/schedule",
    "/teams",
    "/standings",
    "/news",
    "/gallery",
    "/rules",
    "/venue",
    "/watch",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...teams.map((t) => ({ url: `${SITE_URL}/teams/${t.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...news.map((n) => ({
      url: `${SITE_URL}/news/${n.slug}`,
      lastModified: new Date(n.published_at),
      priority: 0.6,
    })),
  ];
}
