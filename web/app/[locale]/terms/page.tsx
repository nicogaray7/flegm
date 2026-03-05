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
    title: t.termsPage.title,
    description: t.termsPage.metaDescription,
    alternates: {
      canonical: getCanonicalForLocale(locale as Locale, "terms"),
      languages: getAlternateLanguages("terms"),
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  const { t } = await getServerDictionary(locale as Locale);
  const p = t.termsPage;
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <span className="text-3xl mb-2 block">{"\u{1F4DC}"}</span>
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
            <p className="mb-2">{p.section3Intro}</p>
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
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{p.section4Li1}</li>
              <li>{p.section4Li2}</li>
              <li>{p.section4Li3}</li>
              <li>{p.section4Li4}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section5Heading}
            </h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>{p.section5Li1}</li>
              <li>{p.section5Li2}</li>
              <li>{p.section5Li3}</li>
              <li>{p.section5Li4}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-[var(--foreground)] mb-2">
              {p.section6Heading}
            </h2>
            <p>{p.section6Body}</p>
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
            <p>
              {p.section8Body}{" "}
              <a href="mailto:contact@flegm.fr" className="font-semibold text-purple-600 hover:underline">
                contact@flegm.fr
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--muted)]">
            {p.seeAlso}{" "}
            <Link href={`/${locale}/privacy`} className="font-semibold text-purple-600 hover:underline">
              {p.privacyPolicy}
            </Link>
            {" "}&middot;{" "}
            <Link href={`/${locale}/cookies`} className="font-semibold text-purple-600 hover:underline">
              {p.cookiePolicy}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
