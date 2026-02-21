import type { Metadata } from "next";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best YouTube Videos of All Time — Community Ranked",
  description:
    "The all-time best YouTube videos ranked by community upvotes on Flegm. The definitive list of videos the community loves most.",
  alternates: { canonical: `${baseUrl}/top/all-time` },
  openGraph: {
    title: "Best YouTube Videos of All Time — Flegm",
    description: "The all-time greatest YouTube videos, voted by real people.",
    type: "website",
    url: `${baseUrl}/top/all-time`,
  },
};

export default async function TopAllTimePage() {
  const topVideos = await db
    .select()
    .from(videos)
    .orderBy(desc(videos.upvotesCount))
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
      <GaEvent eventName="top_alltime_view" />
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8 text-center">
          <span className="text-4xl mb-2 block">{"\u{1F451}"}</span>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight sm:text-4xl">
            <span className="gradient-text">All-Time Best</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            The greatest YouTube videos ever ranked on Flegm, voted by the community
          </p>
        </div>

        <nav className="mb-6 flex flex-wrap items-center justify-center gap-2 text-sm">
          <Link href="/trending" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            Trending
          </Link>
          <Link href="/top/week" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            This Week
          </Link>
          <Link href="/top/month" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            This Month
          </Link>
          <span className="pill bg-[var(--accent)] px-4 py-1.5 text-white font-bold text-xs">
            All Time
          </span>
          <Link href="/leaderboard" className="pill border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:border-purple-300 transition-colors">
            Leaderboard
          </Link>
        </nav>

        {topVideos.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              No videos yet. <Link href="/submit" className="font-bold text-[var(--accent)] hover:underline">Be the first to drop one!</Link>
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
            The Definitive YouTube Video Rankings
          </h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">
            This is the ultimate list &mdash; every video that has ever been dropped
            on Flegm, ranked by total community upvotes. From viral sensations to
            underrated gems, these are the videos that stood the test of time and
            earned the community&apos;s seal of approval.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
