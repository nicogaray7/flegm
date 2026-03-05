import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, defaultLocale, locales, getDictionary } from "./index";
import type { Locale } from "./index";

/**
 * Detect locale on the server side.
 * Priority: cookie > Accept-Language header > default.
 */
export async function getLocale(): Promise<Locale> {
  // 1. Check cookie
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Parse Accept-Language header
  const headerStore = await headers();
  const acceptLang = headerStore.get("accept-language");
  if (acceptLang) {
    const preferred = parseAcceptLanguage(acceptLang);
    for (const lang of preferred) {
      const short = lang.slice(0, 2).toLowerCase();
      if (locales.includes(short as Locale)) {
        return short as Locale;
      }
    }
  }

  return defaultLocale;
}

function parseAcceptLanguage(header: string): string[] {
  return header
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .map((item) => item.lang);
}

/**
 * Get the dictionary for the current request.
 * When localeOverride is provided (e.g. from [locale] route params), use it so the page
 * language matches the URL. Otherwise use cookie / Accept-Language.
 */
export async function getServerDictionary(localeOverride?: Locale) {
  const locale =
    localeOverride && locales.includes(localeOverride)
      ? localeOverride
      : await getLocale();
  return { locale, t: getDictionary(locale) };
}
