import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/app/submit/sign-out-button";
import { SubmitIntentLink } from "@/app/components/submit-intent-link";
import { getServerDictionary } from "@/lib/i18n/server";
import type { User } from "@supabase/supabase-js";

export async function Header() {
  const { t } = await getServerDictionary();
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
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Flegm home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl gradient-bg text-sm font-black text-white shadow-md shadow-purple-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all group-active:scale-90">
            F
          </span>
          <span className="text-base font-extrabold tracking-tight text-[var(--foreground)]">
            flegm
          </span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/trending"
            className="pill hidden sm:inline-flex px-3 py-1.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-purple-50 transition-all"
          >
            {t.nav.trending}
          </Link>
          <Link
            href="/leaderboard"
            className="pill px-3 py-1.5 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-purple-50 transition-all"
          >
            {t.nav.leaderboard}
          </Link>
          <SubmitIntentLink
            href="/submit"
            source="header"
            className="btn-primary text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {t.nav.dropAVideo}
          </SubmitIntentLink>
          {user ? (
            <div className="flex items-center gap-2.5">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-xl object-cover ring-2 ring-purple-200 hover:ring-purple-400 transition-all"
                  width={32}
                  height={32}
                  unoptimized={false}
                />
              ) : (
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-xl gradient-bg text-xs font-bold text-white"
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
