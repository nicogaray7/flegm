import Link from "next/link";
import { getHomeVideos } from "@/lib/home-data";
import { GaEvent } from "./components/ga-event";
import { HomeSection } from "./components/home-section";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { SubmitIntentLink } from "./components/submit-intent-link";

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
  const videosThisWeek = today.length + yesterday.length + lastWeek.count;
  const videosThisMonth = videosThisWeek + lastMonth.count;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <GaEvent eventName="home_view" />
      <Header />

      <main className="mx-auto max-w-2xl px-3 py-6 sm:px-4 sm:py-8 pb-24">
        {dbError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            Could not load videos: {dbError}. Check DATABASE_URL in .env.local and run <code className="rounded bg-red-500/20 px-1">npm run db:push</code> if needed.
          </div>
        )}

        {/* Compact top: title + CTAs + KPIs in one row */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl">
              For You
            </h1>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              Top videos, every day
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-full bg-[var(--surface)] px-2 py-1 text-xs tabular-nums text-[var(--muted)]">
              <span className="font-semibold text-[var(--foreground)]">{today.length}</span> today
              <span className="text-[var(--border)]">·</span>
              <span className="font-semibold text-[var(--foreground)]">{videosThisWeek}</span> week
            </div>
            <SubmitIntentLink
              href="/submit"
              source="hero"
              className="pill flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--accent)] text-[var(--background)] hover:opacity-90 transition-opacity sm:h-9 sm:w-auto sm:px-4 sm:gap-1.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden sm:inline text-sm font-semibold">Submit</span>
            </SubmitIntentLink>
          </div>
        </section>

        {/* Sections */}
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
