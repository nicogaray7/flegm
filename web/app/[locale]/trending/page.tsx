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
  const canonical = getCanonicalForLocale(locale as Locale, "trending");
  return {
    title: "Trending YouTube Videos Today — Community Picks",
    description:
      "See what YouTube videos are trending right now on Flegm. Fresh picks voted by the community, updated every hour.",
    alternates: { canonical, languages: getAlternateLanguages("trending") },
    openGraph: {
      title: "Trending YouTube Videos Today — Flegm",
      description:
        "Fresh YouTube videos trending right now, voted by the community.",
      type: "website",
      url: canonical,
    },
  };
}

export default async function TrendingPage({ params }: Props) {
  const { locale, t } = await getServerDictionary();
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const trending = await db
    .select()
    .from(videos)
    .where(gte(videos.createdAt, oneDayAgo))
    .orderBy(desc(videos.upvotesCount))
    .limit(50);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trending YouTube Videos on Flegm",
    description: "The most upvoted YouTube videos in the last 24 hours",
    numberOfItems: trending.length,
    itemListElement: trending.map((v, i) => ({
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
      <GaEvent eventName="trending_view" />
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <span className="text-4xl mb-2 block">{"\u{1F525}"}</span>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight sm:text-4xl">
            <span className="gradient-text">{t.trending.title}</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t.trending.subtitle}
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="pill bg-[var(--accent)] px-4 py-1.5 text-white font-bold text-xs">
            {t.trending.navTrending}
          </span>
          <Link href={`/${locale}/top/week`} className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            {t.trending.navThisWeek}
          </Link>
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

        {trending.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              {t.trending.empty} <Link href={`/${locale}/submit`} className="font-bold text-[var(--accent)] hover:underline">{t.trending.emptyLink}</Link>
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {trending.map((video, index) => (
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
            {t.trending.whatIsTitle}
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            {t.trending.whatIsText}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
