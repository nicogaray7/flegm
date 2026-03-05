/**
 * Core logic for backfilling bot_upvotes_count. Used by the CLI script and the cron API route.
 * Formula (Option B): mean = min(M, A × (1 + k×E)) with
 * - A = age component (base + ageDays × growth, capped)
 * - E = α×E_views + (1−α)×E_ratio (engagement: views + like rate)
 */
import { db } from "@/db";
import { videos } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export type BackfillOptions = {
  base?: number;
  growth?: number;
  maxMean?: number;
  /** Fixed spread (used if spreadRatio not used). */
  spread?: number;
  /** Spread as fraction of mean (e.g. 0.5 → ±50% of mean). Makes variance scale with level. */
  spreadRatio?: number;
  /** Max spread cap when using spreadRatio. */
  spreadMax?: number;
  /** Extra random “bump” probability (0–1): sometimes add extra variance for more organic spread. */
  organicBumpProbability?: number;
  /** Reference views for normalisation (E_views = ln(1+V)/ln(1+V_ref)). */
  viewRef?: number;
  /** Reference like ratio for normalisation (E_ratio from r = likes/views). */
  likeRatioRef?: number;
  /** Weight of views in engagement (1−alpha = weight of like ratio). */
  alpha?: number;
  /** Engagement multiplier strength (mean = A × (1 + k×E)). */
  k?: number;
  dryRun?: boolean;
};

const DEFAULTS = {
  base: 8,
  growth: 2,
  maxMean: 200,
  spread: 12,
  spreadRatio: 0.55,
  spreadMax: 45,
  organicBumpProbability: 0.25,
  viewRef: 10_000,
  likeRatioRef: 0.03,
  alpha: 0.65,
  k: 0.3,
};

export async function runBackfillBotUpvotes(
  botUserId: string,
  options: BackfillOptions = {}
): Promise<{ updated: number }> {
  const {
    base,
    growth,
    maxMean,
    spread,
    spreadRatio,
    spreadMax,
    organicBumpProbability,
    viewRef,
    likeRatioRef,
    alpha,
    k,
    dryRun = false,
  } = { ...DEFAULTS, ...options };

  /** Organic-like upvote count: spread scales with mean, optional extra variance, small jitter. */
  function randomUpvotes(mean: number): number {
    const useRatio = spreadRatio != null && spreadRatio > 0;
    const effectiveSpread = useRatio
      ? Math.min(spreadMax ?? 45, Math.max(6, Math.floor(mean * spreadRatio)))
      : spread;
    let lo = Math.max(0, Math.floor(mean - effectiveSpread));
    let hi = Math.max(lo, Math.floor(mean + effectiveSpread));
    if (organicBumpProbability != null && organicBumpProbability > 0 && Math.random() < organicBumpProbability) {
      const bump = Math.floor(effectiveSpread * 0.6);
      lo = Math.max(0, lo - bump);
      hi = hi + bump;
    }
    const value = lo + Math.floor(Math.random() * (hi - lo + 1));
    const jitter = Math.floor(Math.random() * 5) - 2;
    return Math.max(0, value + jitter);
  }

  const botVideos = await db
    .select({
      id: videos.id,
      youtubeId: videos.youtubeId,
      createdAt: videos.createdAt,
      botUpvotesCount: videos.botUpvotesCount,
      viewCount: videos.viewCount,
      likeCount: videos.likeCount,
    })
    .from(videos)
    .where(eq(videos.clippeurId, botUserId))
    .orderBy(asc(videos.createdAt));

  let updated = 0;
  const now = Date.now();

  for (const v of botVideos) {
    const ageMs = now - new Date(v.createdAt).getTime();
    const ageDays = ageMs / (24 * 60 * 60 * 1000);

    // Age component: A = min(maxMean, base + ageDays × growth)
    const A = Math.min(maxMean, base + ageDays * growth);

    // Engagement (Option B): E = α×E_views + (1−α)×E_ratio
    const V = v.viewCount ?? 0;
    const L = v.likeCount ?? 0;
    const E_views = Math.log(1 + V) / Math.log(1 + viewRef);
    const r = V > 0 ? L / V : 0;
    const E_ratio = Math.log(1 + 100 * r) / Math.log(1 + 100 * likeRatioRef);
    const E = alpha * E_views + (1 - alpha) * E_ratio;

    // Mean: μ = min(M, A × (1 + k×E))
    const mean = Math.min(maxMean, A * (1 + k * E));
    const newCount = randomUpvotes(mean);

    if (!dryRun) {
      await db.update(videos).set({ botUpvotesCount: newCount }).where(eq(videos.id, v.id));
      updated++;
    }
  }

  return { updated };
}
