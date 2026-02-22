import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const LOCALE_COOKIE = "flegm_locale";
const supportedLocales = ["en", "fr", "es"];
const defaultLocale = "en";

function detectLocale(request: NextRequest): string {
  const existing = request.cookies.get(LOCALE_COOKIE)?.value;
  if (existing && supportedLocales.includes(existing)) return existing;

  const acceptLang = request.headers.get("accept-language");
  if (acceptLang) {
    const langs = acceptLang
      .split(",")
      .map((p) => {
        const [lang, q] = p.trim().split(";q=");
        return { lang: lang.trim().slice(0, 2).toLowerCase(), q: q ? parseFloat(q) : 1 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { lang } of langs) {
      if (supportedLocales.includes(lang)) return lang;
    }
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  if (!request.cookies.get(LOCALE_COOKIE)?.value) {
    const locale = detectLocale(request);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
