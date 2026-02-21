import type { Metadata } from "next";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc, gte } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trending YouTube Videos Today — Community Picks",
  description:
    "See what YouTube videos are trending right now on Flegm. Fresh picks voted by the community, updated every hour.",
  alternates: { canonical: `${baseUrl}/trending` },
  openGraph: {
    title: "Trending YouTube Videos Today — Flegm",
    description:
      "Fresh YouTube videos trending right now, voted by the community.",
    type: "website",
    url: `${baseUrl}/trending`,
  },
};

export default async function TrendingPage() {
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
      url: `${baseUrl}/v/${v.youtubeId}`,
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
            <span className="gradient-text">Trending Now</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            The hottest YouTube videos in the last 24 hours, voted by the community
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="pill bg-[var(--accent)] px-4 py-1.5 text-white font-bold text-xs">
            Trending
          </span>
          <Link href="/top/week" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            This Week
          </Link>
          <Link href="/top/month" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            This Month
          </Link>
          <Link href="/top/all-time" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            All Time
          </Link>
          <Link href="/leaderboard" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            Leaderboard
          </Link>
        </nav>

        {trending.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              No trending videos yet today. <Link href="/submit" className="font-bold text-[var(--accent)] hover:underline">Be the first to drop one!</Link>
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
                />
              </li>
            ))}
          </ul>
        )}

        <section className="mt-12 card-shadow p-6">
          <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
            What is Flegm Trending?
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            Flegm Trending shows the YouTube videos that are getting the most love
            from the community right now. Unlike algorithmic recommendations, these
            picks are 100% community-driven &mdash; real people dropping and upvoting
            the videos they think are worth watching. Updated continuously throughout
            the day.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
