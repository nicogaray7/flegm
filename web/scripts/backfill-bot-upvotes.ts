/**
 * Set random bot_upvotes_count on videos published by the bot (clippeur_id = FLEGM_BOT_USER_ID).
 * Older videos get a higher average than newer ones. Real user upvotes stay in upvotes_count.
 *
 * Usage (from web/): FLEGM_BOT_USER_ID=uuid DATABASE_URL=... npx tsx scripts/backfill-bot-upvotes.ts
 *
 * Env: FLEGM_BOT_USER_ID, DATABASE_URL; optional: DRY_RUN, BOT_UPVOTE_BASE, BOT_UPVOTE_GROWTH, BOT_UPVOTE_MAX_MEAN, BOT_UPVOTE_SPREAD.
 */

import { runBackfillBotUpvotes } from "../lib/backfill-bot-upvotes";

const BOT_USER_ID = process.env.FLEGM_BOT_USER_ID;
const DRY_RUN = process.env.DRY_RUN === "true" || process.env.DRY_RUN === "1";
const BASE = parseFloat(process.env.BOT_UPVOTE_BASE ?? "8");
const GROWTH = parseFloat(process.env.BOT_UPVOTE_GROWTH ?? "2");
const MAX_MEAN = parseFloat(process.env.BOT_UPVOTE_MAX_MEAN ?? "200");
const SPREAD = parseInt(process.env.BOT_UPVOTE_SPREAD ?? "12", 10);

async function main() {
  if (!BOT_USER_ID) {
    console.error("FLEGM_BOT_USER_ID is required.");
    process.exit(1);
  }

  console.log(
    `Running backfill. DRY_RUN=${DRY_RUN}. Base=${BASE}, growth/day=${GROWTH}, maxMean=${MAX_MEAN}, spread=±${SPREAD}`
  );

  const { updated } = await runBackfillBotUpvotes(BOT_USER_ID, {
    base: BASE,
    growth: GROWTH,
    maxMean: MAX_MEAN,
    spread: SPREAD,
    dryRun: DRY_RUN,
  });

  console.log(DRY_RUN ? "Dry run complete." : `Done. Updated ${updated} video(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
