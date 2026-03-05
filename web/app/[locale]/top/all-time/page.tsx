import type { Metadata } from "next";
import { db } from "@/db";
import { videos, totalUpvotesSql } from "@/db/schema";
import { asc, desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";
import { getServerDictionary } from "@/lib/i18n/server";
import { getAlternateLanguages, getCanonicalForLocale } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getCanonicalForLocale(locale as Locale, "top/all-time");
  return {
    title: "Best YouTube Videos of All Time — Community Ranked",
    description:
      "The all-time best YouTube videos ranked by community upvotes on Flegm. The definitive list of videos the community loves most.",
    alternates: { canonical, languages: getAlternateLanguages("top/all-time") },
    openGraph: {
      title: "Best YouTube Videos of All Time — Flegm",
      description: "The all-time greatest YouTube videos, voted by real people.",
      type: "website",
      url: canonical,
    },
  };
}

export default async function TopAllTimePage({ params }: Props) {
  const { locale, t } = await getServerDictionary();
  const topVideos = await db
    .select()
    .from(videos)
    .orderBy(desc(totalUpvotesSql), asc(videos.shuffleKey))
    .limit(100);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best YouTube Videos of All Time on Flegm",
    description: "The all-time top YouTube videos ranked by community upvotes",
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
      <GaEvent eventName="top_alltime_view" />
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <span className="text-4xl mb-2 block">{"\u{1F451}"}</span>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight sm:text-4xl">
            <span className="gradient-text">{t.topAllTime.title}</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t.topAllTime.subtitle}
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <Link href={`/${locale}/trending`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navTrending}
          </Link>
          <Link href={`/${locale}/top/week`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navThisWeek}
          </Link>
          <Link href={`/${locale}/top/month`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navThisMonth}
          </Link>
          <span className="pill bg-[var(--accent)] px-4 py-1.5 text-white font-bold text-xs">
            {t.trending.navAllTime}
          </span>
          <Link href={`/${locale}/leaderboard`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navLeaderboard}
          </Link>
        </nav>

        {topVideos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              {t.topAllTime.empty} <Link href={`/${locale}/submit`} className="font-bold text-[var(--accent)] hover:underline">{t.topAllTime.emptyLink}</Link>
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
                    botUpvotesCount: video.botUpvotesCount,
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
            {t.topAllTime.seoTitle}
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {t.topAllTime.seoText}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
