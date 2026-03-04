import type { MetadataRoute } from "next";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { locales } from "@/lib/i18n";
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

  const staticPages: MetadataRoute.Sitemap = [];
  for (const { path, changeFrequency, priority } of staticPaths) {
    for (const locale of locales) {
      const url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
      staticPages.push({ url, changeFrequency, priority });
    }
  }

  const videoPages: MetadataRoute.Sitemap = [];
  for (const v of allVideos) {
    for (const locale of locales) {
      videoPages.push({
        url: `${baseUrl}/${locale}/v/${v.youtubeId}`,
        lastModified: v.createdAt,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  const channelPages: MetadataRoute.Sitemap = [];
  for (const c of channels) {
    for (const locale of locales) {
      channelPages.push({
        url: `${baseUrl}/${locale}/channel/${encodeURIComponent(c.channelId)}`,
        lastModified: c.lastUpdated,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...videoPages, ...channelPages];
}
