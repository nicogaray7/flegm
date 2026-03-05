/**
 * Delete from the database all videos considered as Shorts (duration <= threshold).
 * Also removes related upvotes and comments.
 *
 * Usage (from web/): npx tsx scripts/clean-shorts.ts
 * Requires: DATABASE_URL in env (e.g. .env.local).
 *
 * Optional: SHORTS_MAX_DURATION_SECONDS (default 60).
 */

import { db } from "../db";
import { videos, upvotes, comments } from "../db/schema";
import { lte, inArray } from "drizzle-orm";

const THRESHOLD = parseInt(process.env.SHORTS_MAX_DURATION_SECONDS ?? "180", 10);

async function main() {
  const shorts = await db
    .select({ id: videos.id, youtubeId: videos.youtubeId, duration: videos.duration })
    .from(videos)
    .where(lte(videos.duration, THRESHOLD));

  if (shorts.length === 0) {
    console.log(`No videos with duration <= ${THRESHOLD}s found.`);
    return;
  }

  const ids = shorts.map((v) => v.id);
  console.log(`Found ${shorts.length} short(s) (duration <= ${THRESHOLD}s):`);
  shorts.forEach((v) => console.log(`  - ${v.youtubeId} (${v.duration}s)`));

  await db.delete(upvotes).where(inArray(upvotes.videoId, ids));
  await db.delete(comments).where(inArray(comments.videoId, ids));
  await db.delete(videos).where(inArray(videos.id, ids));

  console.log(`Deleted ${shorts.length} video(s) and their upvotes/comments.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
