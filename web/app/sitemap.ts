import type { MetadataRoute } from "next";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc, sql } from "drizzle-orm";
import { defaultLocale } from "@/lib/i18n";
import { getAlternateLanguages } from "@/lib/i18n/alternates";

export const dynamic = "force-dynamic";

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
  const staticPages: MetadataRoute.Sitemap = staticPaths.map(
    ({ path, changeFrequency, priority }) => {
      const languages = getAlternateLanguages(path);
      const url = languages[defaultLocale] ?? languages["x-default"]!;
      return {
        url,
        changeFrequency,
        priority,
        alternates: { languages },
      };
    },
  );

  let videoPages: MetadataRoute.Sitemap = [];
  let channelPages: MetadataRoute.Sitemap = [];

  try {
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

    videoPages = allVideos.map((v) => {
      const path = `v/${v.youtubeId}`;
      const languages = getAlternateLanguages(path);
      const url = languages[defaultLocale] ?? languages["x-default"]!;
      const lastModified = v.createdAt instanceof Date && !isNaN(v.createdAt.getTime()) ? v.createdAt : undefined;
      return {
        url,
        ...(lastModified && { lastModified }),
        changeFrequency: "daily" as const,
        priority: 0.7,
        alternates: { languages },
      };
    });

    channelPages = channels.map((c) => {
      const path = `channel/${encodeURIComponent(c.channelId)}`;
      const languages = getAlternateLanguages(path);
      const url = languages[defaultLocale] ?? languages["x-default"]!;
      const date = c.lastUpdated instanceof Date ? c.lastUpdated : new Date(c.lastUpdated);
      const lastModified = !isNaN(date.getTime()) ? date : undefined;
      return {
        url,
        ...(lastModified && { lastModified }),
        changeFrequency: "weekly" as const,
        priority: 0.6,
        alternates: { languages },
      };
    });
  } catch (err) {
    console.error("Sitemap: failed to fetch dynamic entries", err);
  }

  return [...staticPages, ...videoPages, ...channelPages];
}
