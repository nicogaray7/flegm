import { getHomeVideos } from "@/lib/home-data";
import { HomeSection } from "./components/home-section";
import { Header } from "./components/header";
import { Footer } from "./components/footer";

export const dynamic = "force-dynamic";

type HomeData = Awaited<ReturnType<typeof getHomeVideos>>;
const emptyHomeData: HomeData = {
  today: [],
  yesterday: [],
  lastWeek: { videos: [], count: 0 },
  lastMonth: { videos: [], count: 0 },
};

export default async function Home() {
  let data = emptyHomeData;
  let dbError: string | null = null;
  try {
    data = await getHomeVideos();
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database unavailable";
  }

  const { today, yesterday, lastWeek, lastMonth } = data;

  return (
    <div className="prismatic-bg min-h-screen">
      <Header />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pt-12 pb-8">
        {dbError && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Could not load videos: {dbError}. Check DATABASE_URL in .env.local and run <code className="rounded bg-red-500/20 px-1">npm run db:push</code> if needed.
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Top videos
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            The best videos, ranked by the community
          </p>
        </div>

        <HomeSection
          title="Launching Today"
          videos={today}
          emptyMessage="No videos submitted today yet. Be the first!"
        />

        <HomeSection
          title="Yesterday"
          videos={yesterday}
          emptyMessage="No videos from yesterday."
        />

        <HomeSection
          title="This Week"
          videos={lastWeek.videos}
          summary={
            lastWeek.count > 0
              ? `${lastWeek.count} video${lastWeek.count !== 1 ? "s" : ""} submitted this week`
              : undefined
          }
          emptyMessage="No videos from the past week."
        />

        <HomeSection
          title="This Month"
          videos={lastMonth.videos}
          summary={
            lastMonth.count > 0
              ? `${lastMonth.count} video${lastMonth.count !== 1 ? "s" : ""} submitted this month`
              : undefined
          }
          emptyMessage="No videos from the past month."
        />
      </main>

      <Footer />
    </div>
  );
}
