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

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const canonical = getCanonicalForLocale(locale as Locale, "leaderboard");
  const title = "Leaderboard — Top YouTube Videos Ranked by the Community";
  const description =
    "Top 100 YouTube videos ranked by community upvotes on Flegm. Discover the most popular videos voted by real people.";
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getAlternateLanguages("leaderboard"),
    },
    openGraph: {
      title: "Leaderboard — Top YouTube Videos | Flegm",
      description,
      type: "website",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: "Leaderboard — Top YouTube Videos | Flegm",
      description,
    },
  };
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export default async function LeaderboardPage({ params }: Props) {
  const { locale, t } = await getServerDictionary();
  let topVideos: { id: string; youtubeId: string; title: string; channelName: string; upvotesCount: number; botUpvotesCount: number; duration: number }[] = [];
  let dbError: string | null = null;
  try {
    topVideos = await db
      .select()
      .from(videos)
      .orderBy(desc(totalUpvotesSql), asc(videos.shuffleKey))
      .limit(100);
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database unavailable";
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top YouTube Videos — Flegm Leaderboard",
    description: "The top YouTube videos ranked by community upvotes on Flegm",
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
      <GaEvent eventName="leaderboard_view" />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8">
        {dbError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t.leaderboard.dbError(dbError)}
          </div>
        )}

        <div className="mb-8 text-center">
          <span className="text-4xl mb-2 block">{"\u{1F3C6}"}</span>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight sm:text-4xl">
            <span className="gradient-text">{t.leaderboard.title}</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {t.leaderboard.subtitle}
          </p>
        </div>

        {topVideos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">{dbError ? t.leaderboard.somethingWrong : t.leaderboard.empty}</p>
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
      </main>
      <Footer />
    </div>
  );
}
