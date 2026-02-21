"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const next = searchParams.get("next");
    const redirectTo = next?.startsWith("/") && !next.startsWith("//") ? next : "/";

    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) {
      setStatus("error");
      return;
    }

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (!access_token || !refresh_token) {
      setStatus("error");
      return;
    }

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(() => {
        setStatus("ok");
        const sep = redirectTo.includes("?") ? "&" : "?";
        router.replace(`${redirectTo}${sep}signed_in=1`);
      })
      .catch(() => setStatus("error"));
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
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--background)] px-4">
        <p className="text-center text-[var(--foreground)]">
          This link is invalid or has expired.
        </p>
        <a
          href="/submit"
          className="text-sm font-medium text-emerald-600 hover:underline"
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
