import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Terms of Use",
  description: "Flegm terms of use — the rules for using the platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <span className="text-3xl mb-2 block">{"\u{1F4DC}"}</span>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            Terms of Use
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Last updated: February 2026
          </p>
        </div>

        <div className="space-y-8 text-sm text-[var(--foreground)]/85 leading-relaxed">
          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              TL;DR
            </h2>
            <p>
              Flegm is a community platform for sharing and discovering YouTube videos.
              Be cool, don&apos;t spam, and respect others. We can remove content or
              accounts that break these rules. That&apos;s basically it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              1. What Flegm is
            </h2>
            <p>
              Flegm (&quot;we&quot;, &quot;us&quot;, &quot;the platform&quot;) is a community-driven
              YouTube video leaderboard. You can drop videos, upvote them, and leave
              comments. We don&apos;t host any video content — everything plays through YouTube.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              2. Your account
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You need to sign in (via Google or email) to drop videos, upvote, or comment.</li>
              <li>You&apos;re responsible for your account. Keep your credentials safe.</li>
              <li>One account per person. Don&apos;t create alts to game the leaderboard.</li>
              <li>We can suspend or delete accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              3. Community rules
            </h2>
            <p className="mb-2">Keep it chill. Don&apos;t:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Spam, self-promote excessively, or use bots</li>
              <li>Post hateful, violent, or illegal content</li>
              <li>Harass other users in comments</li>
              <li>Try to manipulate votes or game the leaderboard</li>
              <li>Impersonate others or misrepresent your identity</li>
            </ul>
            <p className="mt-2">
              We moderate content using automated risk scoring and may hold comments
              for review. We reserve the right to remove any content at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              4. Content you share
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>You can only share YouTube videos that are publicly available.</li>
              <li>By dropping a video, you&apos;re sharing a link — you&apos;re not claiming ownership of that content.</li>
              <li>Your comments are your own. You grant Flegm permission to display them on the platform.</li>
              <li>We can remove any content that violates these terms or that we consider harmful.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              5. What we provide (and don&apos;t)
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Flegm is provided &quot;as is&quot;. We do our best but can&apos;t guarantee uptime or perfection.</li>
              <li>We&apos;re not responsible for the content of YouTube videos shared on the platform.</li>
              <li>We may change, update, or discontinue features at any time.</li>
              <li>We&apos;re not liable for any damages from using (or not being able to use) Flegm.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              6. Intellectual property
            </h2>
            <p>
              The Flegm name, logo, and design are ours. The YouTube videos belong
              to their creators. You keep ownership of your comments, but give us a
              license to display them on the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              7. Changes to these terms
            </h2>
            <p>
              We might update these terms from time to time. If we make significant
              changes, we&apos;ll let you know. Continuing to use Flegm after changes
              means you accept them.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              8. Contact
            </h2>
            <p>
              Questions? Hit us up at{" "}
              <a href="mailto:contact@flegm.fr" className="font-semibold text-purple-600 hover:underline">
                contact@flegm.fr
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)]">
            See also:{" "}
            <Link href="/privacy" className="font-semibold text-purple-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
