import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import Link from "next/link";
import { getServerDictionary } from "@/lib/i18n/server";
import { getAlternateLanguages, getCanonicalForLocale } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const { t } = await getServerDictionary(locale as Locale);
  return {
    title: t.privacyPage.title,
    description: t.privacyPage.metaDescription,
    alternates: {
      canonical: getCanonicalForLocale(locale as Locale, "privacy"),
      languages: getAlternateLanguages("privacy"),
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  const { t } = await getServerDictionary(locale as Locale);
  const p = t.privacyPage;
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <span className="text-3xl mb-2 block">{"\u{1F512}"}</span>
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
            <h3 className="font-bold text-[var(--foreground)] mt-3 mb-1">{p.accountInfo}</h3>
            <p>{p.accountInfoIntro}</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>{p.googleSignIn}</strong> {p.googleSignInDetail}</li>
              <li><strong>{p.emailSignIn}</strong> {p.emailSignInDetail}</li>
            </ul>
            <p className="mt-2">{p.accountInfoOutro}</p>

            <h3 className="font-bold text-[var(--foreground)] mt-4 mb-1">{p.yourActivity}</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>{p.yourActivityLi1}</li>
              <li>{p.yourActivityLi2}</li>
              <li>{p.yourActivityLi3}</li>
            </ul>
            <p className="mt-1">{p.yourActivityOutro}</p>

            <h3 className="font-bold text-[var(--foreground)] mt-4 mb-1">{p.analytics}</h3>
            <p>{p.analyticsIntro}</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>{p.analyticsLi1}</li>
              <li>{p.analyticsLi2}</li>
              <li>{p.analyticsLi3}</li>
              <li>{p.analyticsLi4}</li>
            </ul>

            <h3 className="font-bold text-[var(--foreground)] mt-4 mb-1">{p.cookies}</h3>
            <p>{p.cookiesIntro}</p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li><strong>{p.necessary}</strong> {p.necessaryDetail}</li>
              <li><strong>{p.analyticsCat}</strong> {p.analyticsCatDetail}</li>
              <li><strong>{p.marketing}</strong> {p.marketingDetail}</li>
            </ul>
            <p className="mt-1">
              {p.cookiesOutro}{" "}
              <Link href={`/${locale}/cookies`} className="font-semibold text-purple-600 hover:underline">
                {p.cookiePolicyPage}
              </Link>{" "}{p.page}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section2Heading}
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{p.section2Li1}</li>
              <li>{p.section2Li2}</li>
              <li>{p.section2Li3}</li>
              <li>{p.section2Li4}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section3Heading}
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{p.section3Li1}</li>
              <li>{p.section3Li2}</li>
              <li>{p.section3Li3}</li>
              <li>{p.section3Li4}</li>
              <li>{p.section3Li5}</li>
            </ul>
            <p className="mt-2">{p.section3Outro}</p>
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
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>{p.accountData}</strong> {p.accountDataDetail}</li>
              <li><strong>{p.videosComments}</strong> {p.videosCommentsDetail}</li>
              <li><strong>{p.analyticsRetention}</strong> {p.analyticsRetentionDetail}</li>
            </ul>
            <p className="mt-2">{p.section5Outro}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section6Heading}
            </h2>
            <p className="mb-2">{p.section6Intro}</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{p.access}</li>
              <li>{p.delete}</li>
              <li>{p.export}</li>
              <li>
                {p.optOutBeforeLink}
                <Link href={`/${locale}/cookies`} className="font-semibold text-purple-600 hover:underline">
                  {p.cookiePolicyPage}
                </Link>
                {p.optOutAfterLink}
              </li>
            </ul>
            <p className="mt-2">{p.section6Outro}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section7Heading}
            </h2>
            <p>{p.section7Body}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section8Heading}
            </h2>
            <p>{p.section8Body}</p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section9Heading}
            </h2>
            <p>
              {p.section9Body}{" "}
              <a href="mailto:contact@flegm.fr" className="font-semibold text-purple-600 hover:underline">
                contact@flegm.fr
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)]">
            {p.seeAlso}{" "}
            <Link href={`/${locale}/terms`} className="font-semibold text-purple-600 hover:underline">
              {p.termsOfUse}
            </Link>
            {" "}&middot;{" "}
            <Link href={`/${locale}/cookies`} className="font-semibold text-purple-600 hover:underline">
              {t.cookiesPage.title}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
