import type { Metadata } from "next";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { getServerDictionary } from "@/lib/i18n/server";
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

export default async function AboutPage() {
  const { t } = await getServerDictionary();
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
            {t.about.title} <span className="gradient-text">{t.about.titleHighlight}</span>
          </h1>
          <p className="mt-3 text-base text-[var(--muted)]">
            {t.about.subtitle}
          </p>
        </div>

        <div className="space-y-10 text-sm text-[var(--foreground)]/85 leading-relaxed">
          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              {t.about.whatIsTitle}
            </h2>
            <p>{t.about.whatIsText1}</p>
            <p className="mt-2">{t.about.whatIsText2}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              {t.about.howItWorksTitle}
            </h2>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>{t.about.step1Title}</strong> &mdash; {t.about.step1Text}
              </li>
              <li>
                <strong>{t.about.step2Title}</strong> &mdash; {t.about.step2Text}
              </li>
              <li>
                <strong>{t.about.step3Title}</strong> &mdash; {t.about.step3Text}{" "}
                <Link href="/trending" className="font-semibold text-[var(--accent)] hover:underline">
                  {t.about.step3TrendingVideos}
                </Link>,
                {" "}{t.about.step3The}{" "}
                <Link href="/leaderboard" className="font-semibold text-[var(--accent)] hover:underline">
                  {t.about.step3LeaderboardLink}
                </Link>, {t.about.step3Or}{" "}
                <Link href="/top/all-time" className="font-semibold text-[var(--accent)] hover:underline">
                  {t.about.step3AllTime}
                </Link>.
              </li>
              <li>
                <strong>{t.about.step4Title}</strong> &mdash; {t.about.step4Text}
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              {t.about.whyTitle}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{1F465}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">{t.about.communityDriven}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{t.about.communityDrivenDesc}</p>
              </div>
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{26A1}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">{t.about.realTime}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{t.about.realTimeDesc}</p>
              </div>
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{1F48E}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">{t.about.hiddenGems}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{t.about.hiddenGemsDesc}</p>
              </div>
              <div className="card-shadow p-4">
                <span className="text-2xl mb-1 block">{"\u{1F4AC}"}</span>
                <p className="font-bold text-[var(--foreground)] text-sm">{t.about.realConversations}</p>
                <p className="text-xs text-[var(--muted)] mt-1">{t.about.realConversationsDesc}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-3">
              {t.about.faqTitle}
            </h2>
            <div className="space-y-4">
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  {t.about.faqFreeQ}
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">{"\u25BE"}</span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">{t.about.faqFreeA}</p>
              </details>
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  {t.about.faqDiffQ}
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">{"\u25BE"}</span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">{t.about.faqDiffA}</p>
              </details>
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  {t.about.faqAnyQ}
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">{"\u25BE"}</span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">{t.about.faqAnyA}</p>
              </details>
              <details className="group card-shadow p-4">
                <summary className="cursor-pointer font-bold text-[var(--foreground)] text-sm flex items-center justify-between">
                  {t.about.faqAccountQ}
                  <span className="text-[var(--muted)] group-open:rotate-180 transition-transform">{"\u25BE"}</span>
                </summary>
                <p className="mt-2 text-xs text-[var(--muted)]">{t.about.faqAccountA}</p>
              </details>
            </div>
          </section>

          <section className="text-center pt-4">
            <p className="text-[var(--muted)] text-sm mb-4">{t.about.readyDiscover}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className="btn-primary px-6 py-3 text-sm">{t.about.browseVideos}</Link>
              <Link href="/submit" className="btn-secondary px-6 py-3 text-sm">{t.nav.dropAVideo}</Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
