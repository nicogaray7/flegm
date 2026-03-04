"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { locales, localeNames } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale: currentLocale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(newLocale: string) {
    if (newLocale === currentLocale) return;
    // pathname is e.g. /fr/leaderboard or /en
    const segments = pathname.split("/").filter(Boolean);
    const hasLocale = segments.length > 0 && locales.includes(segments[0] as "en" | "fr" | "es");
    const pathWithoutLocale = hasLocale ? segments.slice(1) : segments;
    const newPath = pathWithoutLocale.length > 0
      ? `/${newLocale}/${pathWithoutLocale.join("/")}`
      : `/${newLocale}`;
    router.push(newPath);
  }

  return (
    <div className="flex items-center gap-1.5">
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleChange(loc)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            loc === currentLocale
              ? "gradient-bg text-white shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-purple-50"
          }`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}
