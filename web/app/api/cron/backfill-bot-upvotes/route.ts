import { NextResponse } from "next/server";
import { runBackfillBotUpvotes } from "@/lib/backfill-bot-upvotes";

/**
 * Daily cron (6:00 UTC): backfill bot_upvotes_count for bot-published videos
 * using the organic formula (spread ∝ mean, 25% bump, jitter ±2).
 * Call with Authorization: Bearer <CRON_SECRET> or ?secret=<CRON_SECRET>.
 * Requires FLEGM_BOT_USER_ID and CRON_SECRET in env.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: "Cron not configured" }, { status: 501 });
  }

  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const querySecret = new URL(request.url).searchParams.get("secret");
  const ok = bearer === cronSecret || querySecret === cronSecret;

  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const botUserId = process.env.FLEGM_BOT_USER_ID;
  if (!botUserId) {
    return NextResponse.json({ error: "FLEGM_BOT_USER_ID not set" }, { status: 501 });
  }

  try {
    const { updated } = await runBackfillBotUpvotes(botUserId);
    return NextResponse.json({ ok: true, updated });
  } catch (err) {
    console.error("Backfill bot upvotes cron error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Backfill failed" },
      { status: 500 }
    );
  }
}
