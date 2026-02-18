import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { GaEvent } from "@/app/components/ga-event";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  let topVideos: { id: string; youtubeId: string; title: string; channelName: string; upvotesCount: number; duration: number }[] = [];
  let dbError: string | null = null;
  try {
    topVideos = await db
      .select()
      .from(videos)
      .orderBy(desc(videos.upvotesCount))
      .limit(100);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database unavailable";
  }

  return (
    <div className="min-h-screen bg-white">
      <GaEvent eventName="leaderboard_view" />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {dbError && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Could not load leaderboard: {dbError}. Check DATABASE_URL and run <code className="rounded bg-amber-100 px-1">npm run db:push</code> if needed.
          </div>
        )}
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-2">
          All-time leaderboard
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Top 100 videos by upvotes
        </p>
        {topVideos.length === 0 ? (
          <p className="text-sm text-slate-500">{dbError ? "Database error." : "No videos yet."}</p>
        ) : (
          <ul className="space-y-2">
            {topVideos.map((video, index) => (
              <li key={video.id} className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium text-slate-500 bg-slate-100"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <VideoCard
                  video={{
                    id: video.id,
                    youtubeId: video.youtubeId,
                    title: video.title,
                    channelName: video.channelName,
                    upvotesCount: video.upvotesCount,
                    duration: video.duration,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
