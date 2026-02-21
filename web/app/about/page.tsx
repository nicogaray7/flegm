import type { Metadata } from "next";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const metadata: Metadata = {
  title: "About Flegm — The Community YouTube Leaderboard",
  description:
    "Flegm is a community-driven YouTube video leaderboard where you drop, upvote, and discover the best videos. No algorithm, just real people.",
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    title: "About Flegm — The Community YouTube Leaderboard",
    description:
      "Discover how Flegm works: drop YouTube videos, upvote the best, and watch what the community is loving.",
    type: "website",
    url: `${baseUrl}/about`,
  },
};

export default function AboutPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Flegm?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Flegm is a community-driven YouTube video leaderboard. Users drop YouTube video links, upvote their favorites, and the best videos rise to the top. Think Reddit meets YouTube charts, but 100% community-powered.",
        },
      },
      {
        "@type": "Question",
        name: "How does Flegm work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sign in with Google or email, paste a YouTube URL on the submit page, and your video is live. Other users can upvote it, and videos with the most upvotes climb the leaderboard. You can also comment and discuss videos.",
        },
      },
      {
        "@type": "Question",
        name: "Is Flegm free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Flegm is completely free to use. You can browse, drop videos, upvote, and comment without paying anything.",
        },
      },
      {
        "@type": "Question",
        name: "How is Flegm different from YouTube trending?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "YouTube's trending page is curated by an algorithm. Flegm's rankings are 100% community-driven — real people vote on which videos deserve attention. This surfaces content that algorithms might miss.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg shadow-lg shadow-purple-500/20">
            <span className="text-3xl font-black text-white">F</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl">
            About <span className="gradient-text">Flegm</span>
          </h1>
          <p className="mt-3 text-base text-[var(--muted)]">
            The community-powered YouTube leaderboard
          </p>
        </div>

        <div className="space-y-10 text-sm text-[var(--foreground)]/85 leading-relaxed">
          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              What is Flegm?
            </h2>
            <p>
              Flegm is a platform where the community decides which YouTube videos
              deserve the spotlight. No algorithm, no corporate curation &mdash; just
              real people sharing and voting on the videos they love.
            </p>
            <p className="mt-2">
              Think of it as a living, breathing YouTube chart powered by taste, not
              data science.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              How it works
            </h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Drop a video</strong> &mdash; Paste any YouTube URL and it&apos;s
                instantly live on Flegm.
              </li>
              <li>
                <strong>Upvote</strong> &mdash; See something great? Hit the upvote
                button. The more upvotes a video gets, the higher it climbs.
              </li>
              <li>
                <strong>Discover</strong> &mdash; Browse{" "}
                <Link href="/trending" className="font-semibold text-[var(--accent)] hover:underline">
                  trending videos
                </Link>,
                the{" "}
                <Link href="/leaderboard" className="font-semibold text-[var(--accent)] hover:underline">
                  leaderboard
                </Link>, or{" "}
                <Link href="/top/all-time" className="font-semibold text-[var(--accent)] hover:underline">
                  all-time bests
                </Link>.
              </li>
              <li>
                <strong>Discuss</strong> &mdash; Leave comments and join the conversation
                around each video.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              Why Flegm?
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{1F465}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">Community-driven</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Rankings are 100% based on community votes, not algorithms
                </p>
              </div>
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{26A1}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">Real-time</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  See what&apos;s hot right now, updated continuously
                </p>
              </div>
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{1F48E}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">Surface hidden gems</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Discover videos that YouTube&apos;s algorithm won&apos;t show you
                </p>
              </div>
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{1F4AC}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">Real conversations</p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Discuss videos with people who actually watch them
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  Is Flegm free?
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">
                    {"\u25BE"}
                  </span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Yes, Flegm is completely free. Browse, drop videos, upvote, and comment
                  at no cost.
                </p>
              </details>
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  How is this different from YouTube Trending?
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">
                    {"\u25BE"}
                  </span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  YouTube&apos;s trending page is controlled by an algorithm that favors big
                  channels and advertisers. Flegm&apos;s rankings are purely community-driven.
                </p>
              </details>
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  Can I drop any YouTube video?
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">
                    {"\u25BE"}
                  </span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  Yes, any publicly available YouTube video can be shared on Flegm.
                  Just paste the URL and it&apos;s live instantly.
                </p>
              </details>
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  Do I need an account?
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">
                    {"\u25BE"}
                  </span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">
                  You can browse without an account. To drop videos, upvote, or comment,
                  sign in with Google or email.
                </p>
              </details>
            </div>
          </section>

          <section className="text-center pt-4">
            <p className="text-[var(--muted)] text-sm mb-4">
              Ready to discover something great?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="btn-primary px-6 py-3 text-sm">
                Browse videos
              </Link>
              <Link href="/submit" className="btn-secondary px-6 py-3 text-sm">
                Drop a video
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
