import type { Metadata } from "next";
import { Suspense } from "react";
import { CookieConsentProvider } from "@/lib/cookie-consent";
import { Analytics } from "./components/analytics";
import { CookieBanner } from "./components/cookie-banner";
import { SignInSuccessTracker } from "./components/sign-in-success-tracker";
import "./globals.css";

const siteName = "Flegm";
const tagline = "The YouTube Leaderboard";
const description =
  "Drop, upvote, and discover the top YouTube videos every day.";
const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} – ${tagline}`,
    template: `%s | ${siteName}`,
  },
  description,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: `${siteName} – ${tagline}`,
    description,
    type: "website",
    url: baseUrl,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: baseUrl,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/leaderboard`,
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
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
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
          </Suspense>
          {gaId && <Analytics gaId={gaId} />}
          <CookieBanner />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
