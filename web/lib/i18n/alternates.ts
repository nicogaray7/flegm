import { locales, defaultLocale } from "./index";
import type { Locale } from "./index";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

/**
 * Path without leading slash and without locale prefix, e.g. "leaderboard", "v/abc123".
 */
export function getAlternateLanguages(pathWithoutLocale: string): Record<string, string> {
  const path = pathWithoutLocale.replace(/^\/+/, "") || ""; // home when empty
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    const url = path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
    languages[locale] = url;
  }
  languages["x-default"] = path
    ? `${baseUrl}/${defaultLocale}/${path}`
    : `${baseUrl}/${defaultLocale}`;
  return languages;
}

export function getCanonicalForLocale(locale: Locale, pathWithoutLocale: string): string {
  const path = pathWithoutLocale.replace(/^\/+/, "") || "";
  return path ? `${baseUrl}/${locale}/${path}` : `${baseUrl}/${locale}`;
}
