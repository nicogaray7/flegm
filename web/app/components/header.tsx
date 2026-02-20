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
    <header className="sticky top-0 z-10 border-b border-gray-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          aria-label="Flegm home"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold text-sm">
            F
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Flegm
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/leaderboard"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            Leaderboard
          </Link>
          <Link
            href="/submit"
            className="ml-1 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Submit
          </Link>
          {user ? (
            <div className="ml-2 flex items-center gap-2">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-100"
                  width={32}
                  height={32}
                  unoptimized={false}
                />
              ) : (
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700"
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
