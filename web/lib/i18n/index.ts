import en from "./en";
import fr from "./fr";
import es from "./es";
import type { Dictionary } from "./en";

export type Locale = "en" | "fr" | "es";

export const locales: Locale[] = ["en", "fr", "es"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Fran\u00e7ais",
  es: "Espa\u00f1ol",
};

export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  es: "es",
};

const dictionaries: Record<Locale, Dictionary> = { en, fr, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE = "flegm_locale";

export type { Dictionary };
