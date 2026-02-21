import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { SignInSuccessTracker } from "./components/sign-in-success-tracker";
import "./globals.css";

const siteName = "Flegm";
const tagline = "The YouTube Leaderboard";
const description =
  "Join a community to submit, upvote, and discover the top YouTube videos every day.";
const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "https://flegm.vercel.app";

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

  return (
    <html lang="en">
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
        {children}
        <Suspense fallback={null}>
          <SignInSuccessTracker />
        </Suspense>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
