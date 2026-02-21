import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const metadata = {
  title: "Leaderboard — Top YouTube Videos Ranked by the Community",
  description:
    "Top 100 YouTube videos ranked by community upvotes on Flegm. Discover the most popular videos voted by real people.",
  alternates: { canonical: `${baseUrl}/leaderboard` },
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
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Could not load leaderboard: {dbError}. Check DATABASE_URL and run <code className="rounded bg-red-100 px-1">npm run db:push</code> if needed.
          </div>
        )}

        <div className="mb-8 text-center">
          <span className="text-4xl mb-2 block">{"\u{1F3C6}"}</span>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight sm:text-4xl">
            <span className="gradient-text">Leaderboard</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Top 100 videos voted by the community
          </p>
        </div>

        {topVideos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">{dbError ? "Something went wrong." : "No videos yet. Be the first to drop one!"}</p>
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
