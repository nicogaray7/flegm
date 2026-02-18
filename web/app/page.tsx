import { getHomeVideos } from "@/lib/home-data";
import { HomeSection } from "./components/home-section";
import { Header } from "./components/header";

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
    <div className="min-h-screen bg-white">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        {dbError && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Could not load videos: {dbError}. Check DATABASE_URL in .env.local and run <code className="rounded bg-amber-100 px-1">npm run db:push</code> if needed.
          </div>
        )}
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-8">
          Top videos
        </h1>

        <HomeSection
          title="Top Videos Launching Today"
          videos={today}
          emptyMessage="No videos submitted today yet."
        />

        <HomeSection
          title="Yesterday's Top Videos"
          videos={yesterday}
          emptyMessage="No videos from yesterday."
        />

        <HomeSection
          title="Last Week"
          videos={lastWeek.videos}
          summary={
            lastWeek.count > 0
              ? `${lastWeek.count} video${lastWeek.count !== 1 ? "s" : ""} from the past week. Top by upvotes:`
              : undefined
          }
          emptyMessage="No videos from the past week."
        />

        <HomeSection
          title="Last Month"
          videos={lastMonth.videos}
          summary={
            lastMonth.count > 0
              ? `${lastMonth.count} video${lastMonth.count !== 1 ? "s" : ""} from the past month. Top by upvotes:`
              : undefined
          }
          emptyMessage="No videos from the past month."
        />
      </main>
    </div>
  );
}
