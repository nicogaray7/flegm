"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE, locales } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

export async function setLocale(locale: string) {
  if (!locales.includes(locale as Locale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
