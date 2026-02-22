"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/i18n/locale-context";
import { locales, localeNames } from "@/lib/i18n";
import { setLocale } from "@/actions/set-locale";

export function LanguageSwitcher() {
  const { locale: currentLocale } = useLocale();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(newLocale: string) {
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          disabled={isPending}
          onClick={() => handleChange(loc)}
          className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
            loc === currentLocale
              ? "gradient-bg text-white shadow-sm"
              : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-purple-50"
          } ${isPending ? "opacity-50" : ""}`}
        >
          {localeNames[loc]}
        </button>
      ))}
    </div>
  );
}
