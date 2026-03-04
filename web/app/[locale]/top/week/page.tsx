import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc, gte } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";
import { getServerDictionary } from "@/lib/i18n/server";
import { getAlternateLanguages, getCanonicalForLocale } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getCanonicalForLocale(locale as Locale, "top/week");
  return {
    title: "Best YouTube Videos This Week — Community Ranked",
    description:
      "The top YouTube videos of the week, ranked by community upvotes on Flegm. Discover what people are watching and loving this week.",
    alternates: { canonical, languages: getAlternateLanguages("top/week") },
    openGraph: {
      title: "Best YouTube Videos This Week — Flegm",
      description: "Top YouTube videos of the week, voted by real people.",
      type: "website",
      url: canonical,
    },
  };
}

export default async function TopWeekPage({ params }: Props) {
  const { locale, t } = await getServerDictionary();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const topVideos = await db
    .select()
    .from(videos)
    .where(gte(videos.createdAt, sevenDaysAgo))
    .orderBy(desc(videos.upvotesCount))
    .limit(50);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best YouTube Videos This Week on Flegm",
    description: "Top YouTube videos of the week ranked by community upvotes",
    numberOfItems: topVideos.length,
    itemListElement: topVideos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${baseUrl}/${locale}/v/${v.youtubeId}`,
      name: v.title,
    })),
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GaEvent eventName="top_week_view" />
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <span className="text-4xl mb-2 block">{"\u{1F4C5}"}</span>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight sm:text-4xl">
            <span className="gradient-text">{t.topWeek.title}</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t.topWeek.subtitle}
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <Link href={`/${locale}/trending`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navTrending}
          </Link>
          <span className="pill bg-[var(--accent)] px-4 py-1.5 text-white font-bold text-xs">
            {t.trending.navThisWeek}
          </span>
          <Link href={`/${locale}/top/month`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navThisMonth}
          </Link>
          <Link href={`/${locale}/top/all-time`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navAllTime}
          </Link>
          <Link href={`/${locale}/leaderboard`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navLeaderboard}
          </Link>
        </nav>

        {topVideos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              {t.topWeek.empty} <Link href={`/${locale}/submit`} className="font-bold text-[var(--accent)] hover:underline">{t.topWeek.emptyLink}</Link>
            </p>
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
                  locale={locale}
                />
              </li>
            ))}
          </ul>
        )}

        <section className="mt-12 card-shadow p-6">
          <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
            {t.topWeek.seoTitle}
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {t.topWeek.seoText}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
