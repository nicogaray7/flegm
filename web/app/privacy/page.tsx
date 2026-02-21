import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description: "Flegm privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <span className="text-3xl mb-2 block">{"\u{1F512}"}</span>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            Privacy Policy
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
              We collect the minimum we need to run Flegm — your sign-in info, what you
              do on the platform, and basic analytics. We don&apos;t sell your data. Ever.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              1. What we collect
            </h2>

            <h3 className="font-bold text-[var(--foreground)] mt-3 mb-1">Account info</h3>
            <p>When you sign in, we get:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>Google sign-in:</strong> your name, email, and profile picture</li>
              <li><strong>Email sign-in:</strong> just your email address</li>
            </ul>
            <p className="mt-2">This is handled by Supabase Auth. We store your profile (username, avatar) so the site works.</p>

            <h3 className="font-bold text-[var(--foreground)] mt-4 mb-1">Your activity</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Videos you drop</li>
              <li>Videos you upvote</li>
              <li>Comments you post</li>
            </ul>
            <p className="mt-1">This is visible to other users — that&apos;s the whole point of the platform.</p>

            <h3 className="font-bold text-[var(--foreground)] mt-4 mb-1">Analytics</h3>
            <p>
              We use <strong>Google Analytics 4</strong> to understand how people use Flegm
              (page views, button clicks, sign-in events). GA may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Your IP address (anonymized by Google)</li>
              <li>Browser type and device info</li>
              <li>Pages you visit and how long you stay</li>
              <li>Referral source (how you found us)</li>
            </ul>

            <h3 className="font-bold text-[var(--foreground)] mt-4 mb-1">Cookies</h3>
            <p>We use cookies for:</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>Authentication:</strong> keeping you signed in across pages (Supabase session cookies)</li>
              <li><strong>Analytics:</strong> Google Analytics cookies to track usage patterns</li>
            </ul>
            <p className="mt-1">We don&apos;t use cookies for ads or tracking you across other sites.</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              2. How we use your data
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>To run Flegm — show your profile, display your votes and comments</li>
              <li>To keep the platform safe — our moderation system scores comments for risk</li>
              <li>To understand usage — analytics help us improve the experience</li>
              <li>To send you sign-in links if you use email auth</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              3. Who sees your data
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Other users:</strong> your username, avatar, dropped videos, upvotes, and comments are public</li>
              <li><strong>Supabase:</strong> hosts our database and handles authentication</li>
              <li><strong>Google:</strong> provides Analytics and OAuth sign-in</li>
              <li><strong>Vercel:</strong> hosts the website</li>
              <li><strong>Resend:</strong> sends sign-in emails and moderation alerts</li>
            </ul>
            <p className="mt-2">
              We don&apos;t sell, rent, or share your personal data with advertisers or data brokers. Period.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              4. Where your data lives
            </h2>
            <p>
              Our infrastructure is hosted on Supabase (cloud) and Vercel. Your data
              may be processed in the US or EU depending on the service. All connections
              use HTTPS encryption.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              5. How long we keep it
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Account data:</strong> as long as your account exists</li>
              <li><strong>Videos &amp; comments:</strong> as long as the content is on the platform</li>
              <li><strong>Analytics:</strong> retained per Google&apos;s default retention policies</li>
            </ul>
            <p className="mt-2">
              If you delete your account, we&apos;ll remove your personal data. Public
              content (comments, dropped videos) may remain anonymized.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              6. Your rights
            </h2>
            <p className="mb-2">You can:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Access</strong> your data — ask us what we have</li>
              <li><strong>Delete</strong> your account — email us and we&apos;ll wipe it</li>
              <li><strong>Export</strong> your data — we can provide what we store</li>
              <li><strong>Opt out</strong> of analytics — use a browser extension to block GA</li>
            </ul>
            <p className="mt-2">
              If you&apos;re in the EU, you have additional rights under GDPR
              (rectification, restriction, portability, objection). Just reach out.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              7. Kids
            </h2>
            <p>
              Flegm is not designed for anyone under 13. We don&apos;t knowingly collect
              data from children. If you&apos;re under 13, please don&apos;t use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              8. Changes to this policy
            </h2>
            <p>
              We might update this policy as Flegm evolves. If we make significant
              changes, we&apos;ll let you know. The &quot;last updated&quot; date at the top
              always reflects the current version.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              9. Contact
            </h2>
            <p>
              Got questions about your data? Email us at{" "}
              <a href="mailto:contact@flegm.fr" className="font-semibold text-purple-600 hover:underline">
                contact@flegm.fr
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)]">
            See also:{" "}
            <Link href="/terms" className="font-semibold text-purple-600 hover:underline">
              Terms of Use
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
