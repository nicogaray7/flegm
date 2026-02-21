import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/app/submit/sign-out-button";
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
    <header className="sticky top-4 z-50 mx-auto max-w-4xl px-4">
      <div className="glass-nav flex h-12 items-center justify-between rounded-full px-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          aria-label="Flegm home"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
            <path d="M8 8l4 4-4 4M13 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-base font-bold tracking-tight text-white">
            flegm
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/leaderboard"
            className="rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/submit"
            className="ml-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Submit
          </Link>
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-white/20"
                  width={28}
                  height={28}
                  unoptimized={false}
                />
              ) : (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white"
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
