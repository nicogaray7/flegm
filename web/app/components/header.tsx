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
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-2xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
          aria-label="Flegm home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] text-sm font-black text-[var(--background)]">
            F
          </span>
          <span className="text-base font-bold tracking-tight text-[var(--foreground)] hidden sm:inline">
            Flegm
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link
            href="/leaderboard"
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] transition-colors sm:h-9 sm:w-auto sm:px-4 sm:gap-2"
            aria-label="Leaderboard"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="hidden sm:inline text-sm font-medium">Leaderboard</span>
          </Link>
          <SubmitIntentLink
            href="/submit"
            source="header"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--background)] hover:opacity-90 transition-opacity sm:h-9 sm:w-auto sm:px-4 sm:gap-2 sm:rounded-full"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span className="hidden sm:inline text-sm font-semibold">Submit</span>
          </SubmitIntentLink>
          {user ? (
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--border)]"
                  width={32}
                  height={32}
                  unoptimized={false}
                />
              ) : (
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface)] text-xs font-semibold text-[var(--accent)] border border-[var(--border)]"
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
