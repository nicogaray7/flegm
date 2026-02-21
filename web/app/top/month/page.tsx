import type { Metadata } from "next";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc, gte } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.vercel.app";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best YouTube Videos This Month — Community Ranked",
  description:
    "The top YouTube videos of the month, ranked by community upvotes on Flegm. Discover the most popular videos people are watching this month.",
  alternates: { canonical: `${baseUrl}/top/month` },
  openGraph: {
    title: "Best YouTube Videos This Month — Flegm",
    description: "Top YouTube videos of the month, voted by real people.",
    type: "website",
    url: `${baseUrl}/top/month`,
  },
};

export default async function TopMonthPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const topVideos = await db
    .select()
    .from(videos)
    .where(gte(videos.createdAt, thirtyDaysAgo))
    .orderBy(desc(videos.upvotesCount))
    .limit(50);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Best YouTube Videos This Month on Flegm",
    description: "Top YouTube videos of the month ranked by community upvotes",
    numberOfItems: topVideos.length,
    itemListElement: topVideos.map((v, i) => ({
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
      <GaEvent eventName="top_month_view" />
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <span className="text-4xl mb-2 block">{"\u{1F30D}"}</span>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight sm:text-4xl">
            <span className="gradient-text">Top This Month</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            The best YouTube videos from the past 30 days, ranked by the community
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <Link href="/trending" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            Trending
          </Link>
          <Link href="/top/week" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            This Week
          </Link>
          <span className="pill bg-[var(--accent)] px-4 py-1.5 text-white font-bold text-xs">
            This Month
          </span>
          <Link href="/top/all-time" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            All Time
          </Link>
          <Link href="/leaderboard" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            Leaderboard
          </Link>
        </nav>

        {topVideos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              No videos this month yet. <Link href="/submit" className="font-bold text-[var(--accent)] hover:underline">Drop the first one!</Link>
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
                />
              </li>
            ))}
          </ul>
        )}

        <section className="mt-12 card-shadow p-6">
          <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
            Monthly YouTube Video Rankings
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            See which YouTube videos dominated the month. Flegm&apos;s monthly rankings
            give you a snapshot of the content the community loved most over the past
            30 days &mdash; from viral hits to hidden gems that deserved more attention.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
