import type { Metadata } from "next";
import Link from "next/link";
import { getHomeVideos } from "@/lib/home-data";
import { getServerDictionary } from "@/lib/i18n/server";
import { GaEvent } from "./components/ga-event";
import { HomeSection } from "./components/home-section";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { SubmitIntentLink } from "./components/submit-intent-link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: baseUrl },
};

type HomeData = Awaited<ReturnType<typeof getHomeVideos>>;
const emptyHomeData: HomeData = {
  today: [],
  yesterday: [],
  lastWeek: { videos: [], count: 0 },
  lastMonth: { videos: [], count: 0 },
};

export default async function Home() {
  const { t } = await getServerDictionary();
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

      <main className="mx-auto max-w-3xl px-4 py-10">
        {dbError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t.home.dbError(dbError)}
          </div>
        )}

        {/* Hero */}
        <section className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
            <span>{"\u{1F525}"}</span> {t.home.communityPowered}
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl">
            {t.home.heroTitle}{" "}
            <span className="gradient-text">{t.home.heroTitleHighlight}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-[var(--muted)] leading-relaxed">
            {t.home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <SubmitIntentLink
              href="/submit"
              source="hero"
              className="btn-primary px-6 py-3 text-base"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t.nav.dropAVideo}
            </SubmitIntentLink>
            <Link
              href="/leaderboard"
              className="btn-secondary px-6 py-3 text-base"
            >
              <span>{"\u{1F3C6}"}</span>
              {t.nav.leaderboard}
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-12 grid grid-cols-3 gap-3">
          <div className="card-shadow flex flex-col items-center px-4 py-5 text-center hover-lift">
            <span className="text-2xl mb-1">{"\u{1F4F9}"}</span>
            <span className="text-2xl font-black tabular-nums text-[var(--foreground)]">
              {today.length}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)] mt-0.5">
              {t.home.today}
            </span>
          </div>
          <div className="card-shadow flex flex-col items-center px-4 py-5 text-center hover-lift">
            <span className="text-2xl mb-1">{"\u{1F4C8}"}</span>
            <span className="text-2xl font-black tabular-nums text-[var(--foreground)]">
              {videosThisWeek}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)] mt-0.5">
              {t.home.thisWeek}
            </span>
          </div>
          <div className="card-shadow flex flex-col items-center px-4 py-5 text-center hover-lift">
            <span className="text-2xl mb-1">{"\u{1F680}"}</span>
            <span className="text-2xl font-black tabular-nums text-[var(--foreground)]">
              {videosThisMonth}
            </span>
            <span className="text-xs font-semibold text-[var(--muted)] mt-0.5">
              {t.home.thisMonth}
            </span>
          </div>
        </section>

        {/* Sections */}
        <HomeSection
          title={t.home.droppingToday}
          emoji={"\u{26A1}"}
          videos={today}
          emptyMessage={t.home.emptyToday}
        />
        <HomeSection
          title={t.home.yesterday}
          emoji={"\u{23EA}"}
          videos={yesterday}
          emptyMessage={t.home.emptyYesterday}
        />
        <HomeSection
          title={t.home.sectionThisWeek}
          emoji={"\u{1F4C5}"}
          videos={lastWeek.videos}
          summary={
            lastWeek.count > 0
              ? t.home.videosDroppedWeek(lastWeek.count)
              : undefined
          }
          emptyMessage={t.home.emptyWeek}
        />
        <HomeSection
          title={t.home.sectionThisMonth}
          emoji={"\u{1F30D}"}
          videos={lastMonth.videos}
          summary={
            lastMonth.count > 0
              ? t.home.videosDroppedMonth(lastMonth.count)
              : undefined
          }
          emptyMessage={t.home.emptyMonth}
        />
      </main>

      <Footer />
    </div>
  );
}
