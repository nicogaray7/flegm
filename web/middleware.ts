import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const LOCALE_COOKIE = "flegm_locale";
const supportedLocales = ["en", "fr", "es"];
const defaultLocale = "en";

function detectPreferredLocale(request: NextRequest): string {
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

function hasLocalePrefix(pathname: string): boolean {
  const segment = pathname.split("/")[1];
  return !!segment && supportedLocales.includes(segment);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Pass pathname to server for <html lang> (via request header)
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  // Routes that stay without locale prefix
  if (pathname.startsWith("/auth/") || pathname === "/auth") {
    const res = await updateSession(request);
    return NextResponse.next({
      request: { headers: requestHeaders },
      headers: res.headers,
    });
  }

  // Already has locale prefix: set cookie and continue
  if (hasLocalePrefix(pathname)) {
    const locale = pathname.split("/")[1];
    const response = await updateSession(request);
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return NextResponse.next({
      request: { headers: requestHeaders },
      headers: response.headers,
    });
  }

  // No locale: redirect to same path with preferred locale
  const preferred = detectPreferredLocale(request);
  const newPath = pathname === "/" ? `/${preferred}` : `/${preferred}${pathname}`;
  const url = request.nextUrl.clone();
  url.pathname = newPath;

  const sessionResponse = await updateSession(request);
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, preferred, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  sessionResponse.cookies.getAll().forEach((c) => response.cookies.set(c.name, c.value, c));
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
