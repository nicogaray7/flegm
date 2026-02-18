import { db } from "@/db";
import { videos } from "@/db/schema";
import { and, desc, gte, lt, sql } from "drizzle-orm";

export type VideoRow = {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  channelId: string;
  channelThumbnail: string | null;
  duration: number;
  upvotesCount: number;
  createdAt: Date;
};

function startOfDayUTC(d: Date): Date {
  const t = new Date(d);
  t.setUTCHours(0, 0, 0, 0);
  return t;
}

function daysAgo(days: number): Date {
  const t = new Date();
  t.setDate(t.getDate() - days);
  return t;
}

export async function getHomeVideos() {
  const now = new Date();
  const startOfToday = startOfDayUTC(now);
  const startOfYesterday = startOfDayUTC(daysAgo(1));
  const sevenDaysAgo = startOfDayUTC(daysAgo(7));
  const thirtyDaysAgo = startOfDayUTC(daysAgo(30));

  const [todayVideos, yesterdayVideos, lastWeekVideos, lastMonthVideos] =
    await Promise.all([
      db
        .select()
        .from(videos)
        .where(gte(videos.createdAt, startOfToday))
        .orderBy(desc(videos.upvotesCount))
        .limit(20),
      db
        .select()
        .from(videos)
        .where(
          and(
            gte(videos.createdAt, startOfYesterday),
            lt(videos.createdAt, startOfToday)
          )
        )
        .orderBy(desc(videos.upvotesCount))
        .limit(20),
      db
        .select()
        .from(videos)
        .where(
          and(
            gte(videos.createdAt, sevenDaysAgo),
            lt(videos.createdAt, startOfYesterday)
          )
        )
        .orderBy(desc(videos.upvotesCount))
        .limit(5),
      db
        .select()
        .from(videos)
        .where(
          and(
            gte(videos.createdAt, thirtyDaysAgo),
            lt(videos.createdAt, sevenDaysAgo)
          )
        )
        .orderBy(desc(videos.upvotesCount))
        .limit(5),
    ]);

  const [lastWeekCount, lastMonthCount] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(videos)
      .where(
        and(
          gte(videos.createdAt, sevenDaysAgo),
          lt(videos.createdAt, startOfYesterday)
        )
      )
      .then((r) => Number((r[0] as { count: number })?.count ?? 0)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(videos)
      .where(
        and(
          gte(videos.createdAt, thirtyDaysAgo),
          lt(videos.createdAt, sevenDaysAgo)
        )
      )
      .then((r) => Number((r[0] as { count: number })?.count ?? 0)),
  ]);

  return {
    today: todayVideos as VideoRow[],
    yesterday: yesterdayVideos as VideoRow[],
    lastWeek: { videos: lastWeekVideos as VideoRow[], count: lastWeekCount },
    lastMonth: { videos: lastMonthVideos as VideoRow[], count: lastMonthCount },
  };
}
