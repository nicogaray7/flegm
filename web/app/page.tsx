import Link from "next/link";
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
  const videosThisWeek = today.length + yesterday.length + lastWeek.count;
  const videosThisMonth = videosThisWeek + lastMonth.count;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10">
        {dbError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Could not load videos: {dbError}. Check DATABASE_URL in .env.local and run <code className="rounded bg-red-100 px-1">npm run db:push</code> if needed.
          </div>
        )}

        {/* Hero */}
        <section className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
            The YouTube Leaderboard
          </h1>
          <p className="mx-auto mt-2 text-sm font-medium uppercase tracking-widest text-[var(--muted)]">
            Top videos, every day
          </p>
          <p className="mx-auto mt-3 max-w-xl text-base text-[var(--muted)] leading-relaxed">
            Join a community to submit, upvote, and discover the top YouTube videos every day.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/submit"
              className="pill inline-flex items-center gap-2 bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Submit a video
            </Link>
            <Link
              href="/leaderboard"
              className="pill inline-flex items-center gap-2 border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Leaderboard
            </Link>
          </div>
        </section>

        {/* KPI row */}
        <section className="mb-10 grid grid-cols-3 gap-3">
          <div className="card-shadow flex flex-col px-4 py-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Videos today
            </span>
            <span className="mt-2 text-2xl font-bold tabular-nums text-[var(--foreground)]">
              {today.length}
            </span>
          </div>
          <div className="card-shadow flex flex-col px-4 py-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              This week
            </span>
            <span className="mt-2 text-2xl font-bold tabular-nums text-[var(--foreground)]">
              {videosThisWeek}
            </span>
          </div>
          <div className="card-shadow flex flex-col px-4 py-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              This month
            </span>
            <span className="mt-2 text-2xl font-bold tabular-nums text-[var(--foreground)]">
              {videosThisMonth}
            </span>
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
