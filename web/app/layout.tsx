import { headers } from "next/headers";
import { locales, localeHtmlLang, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import "./globals.css";

function getLocaleFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  if (segment && locales.includes(segment as Locale)) return segment as Locale;
  return null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const locale = getLocaleFromPath(pathname) ?? defaultLocale;
  const lang = localeHtmlLang[locale];

  return (
    <html lang={lang}>
      <body className="antialiased bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
