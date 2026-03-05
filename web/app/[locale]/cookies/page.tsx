import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import Link from "next/link";
import { CookiePreferencesButton } from "./cookie-preferences-button";
import { getServerDictionary } from "@/lib/i18n/server";
import { getAlternateLanguages, getCanonicalForLocale } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { t } = await getServerDictionary(locale as Locale);
  return {
    title: t.cookiesPage.title,
    description: t.cookiesPage.metaDescription,
    alternates: {
      canonical: getCanonicalForLocale(locale as Locale, "cookies"),
      languages: getAlternateLanguages("cookies"),
    },
  };
}

export default async function CookiesPage({ params }: Props) {
  const { locale } = await params;
  const { t } = await getServerDictionary(locale as Locale);
  const p = t.cookiesPage;
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <span className="text-3xl mb-2 block">{"\u{1F36A}"}</span>
          <h1 className="text-3xl font-black tracking-tight text-[var(--foreground)]">
            {p.title}
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{p.lastUpdated}</p>
        </div>

        <div className="space-y-8 text-sm text-[var(--foreground)]/85 leading-relaxed">
          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.tldrHeading}
            </h2>
            <p>{p.tldrBody}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section1Heading}
            </h2>
            <p>{p.section1Body}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section2Heading}
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">{p.tableCategory}</th>
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">{p.tablePurpose}</th>
                    <th className="pb-2 font-bold text-[var(--foreground)]">{p.tableOptOut}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--foreground)]">{p.necessaryRow}</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">{p.necessaryPurpose}</td>
                    <td className="py-3 text-[var(--muted)]">{p.no}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--foreground)]">{p.analyticsRow}</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">{p.analyticsPurpose}</td>
                    <td className="py-3 text-[var(--muted)]">{p.yes}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-[var(--foreground)]">{p.marketingRow}</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">{p.marketingPurpose}</td>
                    <td className="py-3 text-[var(--muted)]">{p.yes}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section3Heading}
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">{p.tableCookie}</th>
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">{p.tableProvider}</th>
                    <th className="pb-2 pr-4 font-bold text-[var(--foreground)]">{p.tableDuration}</th>
                    <th className="pb-2 font-bold text-[var(--foreground)]">{p.tableCategory}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">sb-*-auth-token</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Supabase</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Session</td>
                    <td className="py-3 text-[var(--muted)]">{p.necessaryRow}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">flegm_cookie_consent</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Flegm</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Persistent</td>
                    <td className="py-3 text-[var(--muted)]">{p.necessaryRow}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">_ga, _ga_*</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Google</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">2 years</td>
                    <td className="py-3 text-[var(--muted)]">{p.analyticsRow}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">_gid</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Google</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">24 hours</td>
                    <td className="py-3 text-[var(--muted)]">{p.analyticsRow}</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs text-[var(--foreground)]">_gcl_*, IDE, NID</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">Google Ads</td>
                    <td className="py-3 pr-4 text-[var(--muted)]">3 – 13 months</td>
                    <td className="py-3 text-[var(--muted)]">{p.marketingRow}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section4Heading}
            </h2>
            <p>{p.section4Body}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section5Heading}
            </h2>
            <p className="mb-3">{p.section5Intro}</p>
            <CookiePreferencesButton />
            <p className="mt-3">{p.section5Outro}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section6Heading}
            </h2>
            <p>{p.section6Body}</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  {p.googlePrivacy}
                </a>
              </li>
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  {p.gaOptout}
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section7Heading}
            </h2>
            <p>
              {p.section7Body}{" "}
              <a href="mailto:contact@flegm.fr" className="font-semibold text-purple-600 hover:underline">
                contact@flegm.fr
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)]">
            {t.termsPage.seeAlso}{" "}
            <Link href={`/${locale}/privacy`} className="font-semibold text-purple-600 hover:underline">
              {p.privacyPolicy}
            </Link>
            {" "}&middot;{" "}
            <Link href={`/${locale}/terms`} className="font-semibold text-purple-600 hover:underline">
              {p.termsOfUse}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
