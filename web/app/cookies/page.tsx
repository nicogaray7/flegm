import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import Link from "next/link";
import { CookiePreferencesButton } from "./cookie-preferences-button";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.vercel.app";

export const metadata = {
  title: "Cookie Policy",
  description: "Flegm cookie policy — what cookies we use and why.",
  alternates: { canonical: `${baseUrl}/cookies` },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <span className="text-3xl mb-2 block">{"\u{1F36A}"}</span>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            Cookie Policy
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
              We use cookies to keep you signed in, understand how you use Flegm, and
              (if you opt in) for marketing purposes. You can change your preferences
              any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              1. What are cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit a website.
              They help the site remember your preferences, keep you logged in, and
              understand how you interact with the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              2. Cookies we use
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">Category</th>
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">Purpose</th>
                    <th className="pb-2 font-bold text-[var(--foreground)]">Can you opt out?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                      Necessary
                    </td>
                    <td className="py-3 pr-4 text-[var(--muted)]">
                      Authentication (Supabase session), security tokens, cookie consent
                      preference. The site won&apos;t work without them.
                    </td>
                    <td className="py-3 text-[var(--muted)]">No</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                      Analytics
                    </td>
                    <td className="py-3 pr-4 text-[var(--muted)]">
                      Google Analytics 4 &mdash; page views, button clicks, sign-in events,
                      usage patterns. Helps us understand what&apos;s working and what&apos;s not.
                    </td>
                    <td className="py-3 text-[var(--muted)]">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--foreground)]">
                      Marketing
                    </td>
                    <td className="py-3 pr-4 text-[var(--muted)]">
                      Advertising cookies, retargeting pixels, ad personalization.
                      Used to show relevant ads and measure ad campaign effectiveness.
                    </td>
                    <td className="py-3 text-[var(--muted)]">Yes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              3. Specific cookies
            </h2>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">Cookie</th>
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">Provider</th>
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">Duration</th>
                    <th className="pb-2 font-bold text-[var(--foreground)]">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">sb-*-auth-token</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Supabase</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Session</td>
                    <td className="py-3 text-[var(--muted)]">Necessary</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">flegm_cookie_consent</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Flegm</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Persistent</td>
                    <td className="py-3 text-[var(--muted)]">Necessary</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">_ga, _ga_*</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Google</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">2 years</td>
                    <td className="py-3 text-[var(--muted)]">Analytics</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">_gid</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Google</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">24 hours</td>
                    <td className="py-3 text-[var(--muted)]">Analytics</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">_gcl_*, IDE, NID</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Google Ads</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">3 &ndash; 13 months</td>
                    <td className="py-3 text-[var(--muted)]">Marketing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              4. Google Consent Mode v2
            </h2>
            <p>
              We use{" "}
              <strong>Google Consent Mode v2</strong> to respect your cookie choices.
              When you decline analytics or marketing cookies, Google tags load
              in a privacy-safe mode &mdash; no identifying cookies are set, and only
              aggregate, cookieless pings are sent. This lets Google provide basic
              conversion modeling without tracking you individually.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              5. Managing your preferences
            </h2>
            <p className="mb-3">
              You can change your cookie preferences at any time using the button below,
              or through your browser settings.
            </p>
            <CookiePreferencesButton />
            <p className="mt-3">
              Most browsers also let you block or delete cookies. Note that blocking
              necessary cookies may prevent the site from working properly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              6. Third-party cookies
            </h2>
            <p>
              Some cookies are set by third-party services we use (Google Analytics,
              Google Ads). These services have their own privacy policies:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Google Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              7. Contact
            </h2>
            <p>
              Questions about our cookie practices? Email{" "}
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
            {" "}&middot;{" "}
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
