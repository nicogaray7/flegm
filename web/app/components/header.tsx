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
    <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-slate-900 hover:text-slate-700"
          aria-label="Flegm home"
        >
          Flegm
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Leaderboard
          </Link>
          <Link
            href="/submit"
            className="rounded-md bg-emerald-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Submit video
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200/80"
                  width={32}
                  height={32}
                  unoptimized={false}
                />
              ) : (
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600"
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
