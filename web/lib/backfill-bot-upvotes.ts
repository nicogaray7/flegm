/**
 * Core logic for backfilling bot_upvotes_count. Used by the CLI script and the cron API route.
 */
import { db } from "@/db";
import { videos } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export type BackfillOptions = {
  base?: number;
  growth?: number;
  maxMean?: number;
  spread?: number;
  dryRun?: boolean;
};

const DEFAULTS = {
  base: 8,
  growth: 2,
  maxMean: 200,
  spread: 12,
};

export async function runBackfillBotUpvotes(
  botUserId: string,
  options: BackfillOptions = {}
): Promise<{ updated: number }> {
  const { base, growth, maxMean, spread, dryRun = false } = { ...DEFAULTS, ...options };

  function randomUpvotes(mean: number): number {
    const lo = Math.max(0, Math.floor(mean - spread));
    const hi = Math.max(lo, Math.floor(mean + spread));
    return lo + Math.floor(Math.random() * (hi - lo + 1));
  }

  const botVideos = await db
    .select({
      id: videos.id,
      youtubeId: videos.youtubeId,
      createdAt: videos.createdAt,
      botUpvotesCount: videos.botUpvotesCount,
    })
    .from(videos)
    .where(eq(videos.clippeurId, botUserId))
    .orderBy(asc(videos.createdAt));

  let updated = 0;
  const now = Date.now();

  for (const v of botVideos) {
    const ageMs = now - new Date(v.createdAt).getTime();
    const ageDays = ageMs / (24 * 60 * 60 * 1000);
    const mean = Math.min(maxMean, base + ageDays * growth);
    const newCount = randomUpvotes(mean);

    if (!dryRun) {
      await db.update(videos).set({ botUpvotesCount: newCount }).where(eq(videos.id, v.id));
      updated++;
    }
  }

  return { updated };
}
