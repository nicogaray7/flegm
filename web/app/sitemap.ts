import type { MetadataRoute } from "next";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { defaultLocale } from "@/lib/i18n";
import { getAlternateLanguages } from "@/lib/i18n/alternates";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

type StaticPath = { path: string; changeFrequency: "hourly" | "daily" | "weekly" | "monthly"; priority: number };

const staticPaths: StaticPath[] = [
  { path: "", changeFrequency: "hourly", priority: 1 },
  { path: "leaderboard", changeFrequency: "hourly", priority: 0.9 },
  { path: "trending", changeFrequency: "hourly", priority: 0.9 },
  { path: "top/week", changeFrequency: "daily", priority: 0.8 },
  { path: "top/month", changeFrequency: "daily", priority: 0.8 },
  { path: "top/all-time", changeFrequency: "daily", priority: 0.8 },
  { path: "about", changeFrequency: "monthly", priority: 0.5 },
  { path: "terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "cookies", changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allVideos = await db
    .select({
      youtubeId: videos.youtubeId,
      createdAt: videos.createdAt,
    })
    .from(videos)
    .orderBy(desc(videos.createdAt))
    .limit(5000);

  const channels = await db
    .select({
      channelId: videos.channelId,
      lastUpdated: sql<Date>`max(${videos.createdAt})`,
    })
    .from(videos)
    .groupBy(videos.channelId)
    .limit(2000);

  const staticPages: MetadataRoute.Sitemap = staticPaths.map(
    ({ path, changeFrequency, priority }) => {
      const languages = getAlternateLanguages(path);
      const url = languages[defaultLocale] ?? languages["x-default"]!;
      return {
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: { languages },
      };
    },
  );

  const videoPages: MetadataRoute.Sitemap = allVideos.map((v) => {
    const path = `v/${v.youtubeId}`;
    const languages = getAlternateLanguages(path);
    const url = languages[defaultLocale] ?? languages["x-default"]!;
    return {
      url,
      lastModified: v.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.7,
      alternates: { languages },
    };
  });

  const channelPages: MetadataRoute.Sitemap = channels.map((c) => {
    const path = `channel/${encodeURIComponent(c.channelId)}`;
    const languages = getAlternateLanguages(path);
    const url = languages[defaultLocale] ?? languages["x-default"]!;
    return {
      url,
      lastModified: c.lastUpdated,
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: { languages },
    };
  });

  return [...staticPages, ...videoPages, ...channelPages];
}
