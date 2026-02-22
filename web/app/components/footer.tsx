"use client";

import Link from "next/link";
import { useTranslation, useLocale } from "@/lib/i18n/locale-context";
import { LanguageSwitcher } from "./language-switcher";

export function Footer() {
  const t = useTranslation();
  const { locale } = useLocale();

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg gradient-bg text-[10px] font-black text-white">
            F
          </span>
          <span className="text-sm font-bold text-[var(--foreground)]">flegm</span>
          <span className="text-xs text-[var(--muted)]">{t.footer.tagline}</span>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-[var(--muted)]">
          <Link href="/" className="hover:text-purple-600 transition-colors">{t.nav.home}</Link>
          <Link href="/trending" className="hover:text-purple-600 transition-colors">{t.nav.trending}</Link>
          <Link href="/leaderboard" className="hover:text-purple-600 transition-colors">{t.nav.leaderboard}</Link>
          <Link href="/top/all-time" className="hover:text-purple-600 transition-colors">{t.nav.allTimeBest}</Link>
          <Link href="/submit" className="hover:text-purple-600 transition-colors">{t.nav.dropAVideo}</Link>
          <Link href="/about" className="hover:text-purple-600 transition-colors">{t.nav.about}</Link>
          <Link href="/terms" className="hover:text-purple-600 transition-colors">{t.nav.terms}</Link>
          <Link href="/privacy" className="hover:text-purple-600 transition-colors">{t.nav.privacy}</Link>
          <Link href="/cookies" className="hover:text-purple-600 transition-colors">{t.nav.cookies}</Link>
        </nav>
      </div>
      <div className="mx-auto flex max-w-5xl items-center justify-center px-4 pb-4">
        <LanguageSwitcher />
      </div>
    </footer>
  );
}
