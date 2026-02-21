import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
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
    <div className="prismatic-bg min-h-screen">
      <GaEvent eventName="leaderboard_view" />
      <Header />
      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-12 pb-8">
        {dbError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Could not load leaderboard: {dbError}. Check DATABASE_URL and run <code className="rounded bg-red-500/20 px-1">npm run db:push</code> if needed.
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Leaderboard
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Top 100 videos by community upvotes
          </p>
        </div>

        {topVideos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.08] px-6 py-8 text-center">
            <p className="text-sm text-zinc-600">{dbError ? "Database error." : "No videos yet."}</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {topVideos.map((video, index) => (
              <li key={video.id}>
                <VideoCard
                  video={{
                    id: video.id,
                    youtubeId: video.youtubeId,
                    title: video.title,
                    channelName: video.channelName,
                    upvotesCount: video.upvotesCount,
                    duration: video.duration,
                  }}
                  rank={index + 1}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </div>
  );
}
