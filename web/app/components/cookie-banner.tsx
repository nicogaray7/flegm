"use client";

import { useState } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/cookie-consent";

export function CookieBanner() {
  const { decided, acceptAll, rejectAll, save } = useConsent();
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  if (decided) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-4">
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl">
        {!showSettings ? (
          <>
            <p className="text-sm text-[var(--foreground)] leading-relaxed">
              We use cookies to improve your experience, measure site performance, and show relevant content.{" "}
              <Link href="/cookies" className="font-medium text-[var(--accent)] hover:underline">
                Cookie policy
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={acceptAll}
                className="btn-primary px-4 py-2 text-xs"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={rejectAll}
                className="btn-secondary px-4 py-2 text-xs"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(true)}
                className="px-3 py-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Manage
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4 text-sm font-bold text-[var(--foreground)]">Cookie preferences</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-[var(--foreground)]">Necessary</span>
                  <p className="text-xs text-[var(--muted)]">Authentication, security, core functions</p>
                </div>
                <span className="text-xs font-medium text-[var(--muted)]">Always on</span>
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-[var(--foreground)]">Analytics</span>
                  <p className="text-xs text-[var(--muted)]">Google Analytics, page views, usage patterns</p>
                </div>
                <Toggle checked={analytics} onChange={setAnalytics} />
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-[var(--foreground)]">Marketing</span>
                  <p className="text-xs text-[var(--muted)]">Ads, retargeting, personalized content</p>
                </div>
                <Toggle checked={marketing} onChange={setMarketing} />
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => save({ analytics, marketing })}
                className="btn-primary px-4 py-2 text-xs"
              >
                Save preferences
              </button>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-3 py-2 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 border-transparent transition-colors ${
        checked ? "bg-[var(--accent)]" : "bg-zinc-200"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
