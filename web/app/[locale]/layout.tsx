import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CookieConsentProvider } from "@/lib/cookie-consent";
import { Analytics } from "@/app/components/analytics";
import { CookieBanner } from "@/app/components/cookie-banner";
import { GaUserId } from "@/app/components/ga-user-id";
import { SignInSuccessTracker } from "@/app/components/sign-in-success-tracker";
import { LocaleProvider } from "@/lib/i18n/locale-context";
import { locales, localeHtmlLang, getDictionary } from "@/lib/i18n";
import { getAlternateLanguages } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n";

const siteName = "Flegm";
const tagline = "The YouTube Leaderboard";
const description =
  "Drop, upvote, and discover the top YouTube videos every day.";
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) return { title: siteName };

  const languages = getAlternateLanguages("");
  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${siteName} – ${tagline}`,
      template: `%s | ${siteName}`,
    },
    description,
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages,
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    },
    openGraph: {
      title: `${siteName} – ${tagline}`,
      description,
      type: "website",
      url: `${baseUrl}/${locale}`,
      siteName,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteName} – ${tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} – ${tagline}`,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const dict = getDictionary(locale as Locale);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    description,
    inLanguage: localeHtmlLang[locale as Locale],
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${locale}/leaderboard`,
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    sameAs: [],
  };

  return (
    <LocaleProvider locale={locale as Locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <CookieConsentProvider>
        {children}
        <Suspense fallback={null}>
          <SignInSuccessTracker />
          {gaId && <Analytics gaId={gaId} />}
          <GaUserId />
        </Suspense>
        <CookieBanner />
      </CookieConsentProvider>
    </LocaleProvider>
  );
}
