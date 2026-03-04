"use client";

import { useConsent } from "@/lib/cookie-consent";

export function CookiePreferencesButton() {
  const { acceptAll, rejectAll } = useConsent();

  function handleReset() {
    try {
      localStorage.removeItem("flegm_cookie_consent");
    } catch {}
    rejectAll();
    window.location.reload();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={acceptAll} className="btn-primary px-4 py-2 text-xs">
        Accept all cookies
      </button>
      <button type="button" onClick={handleReset} className="btn-secondary px-4 py-2 text-xs">
        Reset preferences
      </button>
    </div>
  );
}
