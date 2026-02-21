import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/app/submit/sign-out-button";
import { SubmitIntentLink } from "@/app/components/submit-intent-link";
import type { User } from "@supabase/supabase-js";

export async function Header() {
  let user: User | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Auth misconfigured or unavailable; render without user
  }

  const avatarUrl =
    user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture ?? null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="pill flex items-center gap-2 bg-zinc-100 px-3 py-1.5 hover:bg-zinc-200 transition-colors"
          aria-label="Flegm home"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            F
          </span>
          <span className="text-sm font-bold tracking-tight text-[var(--foreground)]">
            Flegm
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            Leaderboard
          </Link>
          <SubmitIntentLink
            href="/submit"
            source="header"
            className="pill inline-flex items-center gap-2 bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Submit
          </SubmitIntentLink>
          {user ? (
            <div className="flex items-center gap-2.5">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-zinc-200"
                  width={28}
                  height={28}
                  unoptimized={false}
                />
              ) : (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700"
                  aria-hidden
                >
                  {user.user_metadata?.full_name?.[0] ??
                    user.email?.[0]?.toUpperCase() ??
                    "?"}
                </span>
              )}
              <SignOutButton />
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
