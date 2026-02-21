import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leaderboard",
  description:
    "Top 100 YouTube videos ranked by community upvotes on Flegm.",
};

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
    <div className="min-h-screen bg-[var(--background)]">
      <GaEvent eventName="leaderboard_view" />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {dbError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Could not load leaderboard: {dbError}. Check DATABASE_URL and run <code className="rounded bg-red-100 px-1">npm run db:push</code> if needed.
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--foreground)] tracking-tight sm:text-3xl">
            The YouTube Leaderboard
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Top 100 videos by community upvotes
          </p>
        </div>

        {topVideos.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted-light)]">{dbError ? "Database error." : "No videos yet."}</p>
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
