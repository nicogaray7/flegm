"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ConsentCategories = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "flegm_cookie_consent";

const defaultConsent: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};

type ConsentState = {
  consent: ConsentCategories;
  decided: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  save: (c: Omit<ConsentCategories, "necessary">) => void;
};

const ConsentContext = createContext<ConsentState>({
  consent: defaultConsent,
  decided: false,
  acceptAll: () => {},
  rejectAll: () => {},
  save: () => {},
});

export function useConsent() {
  return useContext(ConsentContext);
}

function persist(c: ConsentCategories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {}
}

function load(): ConsentCategories | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics !== "boolean") return null;
    return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing ?? false };
  } catch {
    return null;
  }
}

function syncGtagConsent(c: ConsentCategories) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentCategories>(defaultConsent);
  const [decided, setDecided] = useState(false);

  useEffect(() => {
    const stored = load();
    if (stored) {
      setConsent(stored);
      setDecided(true);
      syncGtagConsent(stored);
    }
  }, []);

  const acceptAll = useCallback(() => {
    const c: ConsentCategories = { necessary: true, analytics: true, marketing: true };
    setConsent(c);
    setDecided(true);
    persist(c);
    syncGtagConsent(c);
  }, []);

  const rejectAll = useCallback(() => {
    const c: ConsentCategories = { necessary: true, analytics: false, marketing: false };
    setConsent(c);
    setDecided(true);
    persist(c);
    syncGtagConsent(c);
  }, []);

  const save = useCallback((partial: Omit<ConsentCategories, "necessary">) => {
    const c: ConsentCategories = { necessary: true, ...partial };
    setConsent(c);
    setDecided(true);
    persist(c);
    syncGtagConsent(c);
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, decided, acceptAll, rejectAll, save }}>
      {children}
    </ConsentContext.Provider>
  );
}
