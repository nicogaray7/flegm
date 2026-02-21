import type { MetadataRoute } from "next";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc, sql } from "drizzle-orm";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.vercel.app";

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

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "hourly", priority: 1 },
    { url: `${baseUrl}/leaderboard`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/trending`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/top/week`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/top/month`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/top/all-time`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/cookies`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const videoPages: MetadataRoute.Sitemap = allVideos.map((v) => ({
    url: `${baseUrl}/v/${v.youtubeId}`,
    lastModified: v.createdAt,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const channelPages: MetadataRoute.Sitemap = channels.map((c) => ({
    url: `${baseUrl}/channel/${encodeURIComponent(c.channelId)}`,
    lastModified: c.lastUpdated,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...videoPages, ...channelPages];
}
