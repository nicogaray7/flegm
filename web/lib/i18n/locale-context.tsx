"use client";

import { createContext, useContext, useMemo } from "react";
import type { Dictionary } from "./en";
import type { Locale } from "./index";
import { getDictionary } from "./index";

type LocaleContextValue = {
  locale: Locale;
  t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: "en",
  t: getDictionary("en"),
});

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const t = useMemo(() => getDictionary(locale), [locale]);
  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useTranslation() {
  return useContext(LocaleContext).t;
}
