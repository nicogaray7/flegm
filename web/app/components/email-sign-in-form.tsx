"use client";

import { useState } from "react";
import { signInWithEmail } from "@/actions/auth";
import { trackEvent } from "@/lib/gtag";
import { useTranslation } from "@/lib/i18n/locale-context";

type Props = {
  next?: string;
  className?: string;
};

export function EmailSignInForm({ next, className }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const t = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    trackEvent("sign_in_start", { from_context: "email" });
    const result = await signInWithEmail(email, next);
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
      trackEvent("sign_in_error", { method: "email", error: result.error });
      return;
    }
    setStatus("success");
    setMessage(t.auth.checkEmail);
    trackEvent("magic_link_sent");
  }

  if (status === "success") {
    return (
      <div
        className="text-center rounded-2xl bg-purple-50 border border-purple-100 px-4 py-4"
        data-testid="email-sign-in-success"
      >
        <span className="text-2xl block mb-1">{"\u{2728}"}</span>
        <p className="text-sm font-semibold text-purple-700">
          {t.auth.checkEmail}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} data-testid="email-sign-in-form">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder={t.auth.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="pill shrink-0 gradient-bg px-5 py-3 font-bold text-white hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
        >
          {status === "loading" ? t.auth.sending : t.auth.continueWithEmail}
        </button>
      </div>
      {message && (
        <p className="mt-2 text-sm text-red-600" data-testid="email-sign-in-error">
          {message}
        </p>
      )}
    </form>
  );
}
