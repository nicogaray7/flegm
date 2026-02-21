import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-zinc-500">
            <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
            <path d="M8 8l4 4-4 4M13 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-semibold text-zinc-500">flegm</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-zinc-600">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/leaderboard" className="hover:text-white transition-colors">
            Leaderboard
          </Link>
          <Link href="/submit" className="hover:text-white transition-colors">
            Submit
          </Link>
        </nav>
      </div>
    </footer>
  );
}
