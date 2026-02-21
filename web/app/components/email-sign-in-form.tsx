"use client";

import { useState } from "react";
import { signInWithEmail } from "@/actions/auth";

type Props = {
  next?: string;
  className?: string;
};

export function EmailSignInForm({ next, className }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const result = await signInWithEmail(email, next);
    if (result.error) {
      setStatus("error");
      setMessage(result.error);
      return;
    }
    setStatus("success");
    setMessage("Check your email for a sign-in link.");
  }

  if (status === "success") {
    return (
      <p
        className="text-center text-sm text-[var(--muted)]"
        data-testid="email-sign-in-success"
      >
        Check your email for a sign-in link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} data-testid="email-sign-in-form">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="flex-1 rounded-full border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="pill shrink-0 bg-[var(--foreground)] px-5 py-3 font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {status === "loading" ? "Sending…" : "Continue with Email"}
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
