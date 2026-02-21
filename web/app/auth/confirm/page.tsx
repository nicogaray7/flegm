"use client";

/**
 * Handles magic link callback from email. Supports:
 * 1. Fragment: #access_token=...&refresh_token=... (default Supabase redirect)
 * 2. Query: ?token_hash=...&type=email (use if your email client strips the hash;
 *    set Magic Link template to {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }})
 */
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasErrorParam = searchParams.get("error") === "invalid";
  const [status, setStatus] = useState<"loading" | "ok" | "error">(
    hasErrorParam ? "error" : "loading"
  );

  useEffect(() => {
    const next = searchParams.get("next");
    const redirectTo =
      next?.startsWith("/") && !next.startsWith("//") ? next : "/";

    const supabase = createClient();

    const finish = () => {
      setStatus("ok");
      const sep = redirectTo.includes("?") ? "&" : "?";
      router.replace(`${redirectTo}${sep}signed_in=1`);
    };

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash) {
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      if (access_token && refresh_token) {
        supabase.auth
          .setSession({ access_token, refresh_token })
          .then(finish)
          .catch(() => setStatus("error"));
        return;
      }
    }

    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type") ?? "email";
    if (tokenHash) {
      supabase.auth
        .verifyOtp({ token_hash: tokenHash, type: type as "email" | "magiclink" })
        .then(({ error }) => {
          if (error) setStatus("error");
          else finish();
        })
        .catch(() => setStatus("error"));
      return;
    }

    setStatus("error");
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-[var(--muted)]">Signing you in…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] px-4 text-center">
        <p className="text-[var(--foreground)]">
          This link is invalid or has expired.
        </p>
        <p className="text-sm text-[var(--muted)] max-w-sm">
          Request a new sign-in link from the app. If this keeps happening, your
          email client may be stripping the link. Ask your admin to set the
          Supabase Magic Link template to use the verify-email URL (see
          app/auth/verify-email/route.ts).
        </p>
        <a
          href="/submit"
          className="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <p className="text-[var(--muted)]">Redirecting…</p>
    </div>
  );
}
