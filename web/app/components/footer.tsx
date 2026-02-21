import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg gradient-bg text-[10px] font-black text-white">
            F
          </span>
          <span className="text-sm font-bold text-[var(--foreground)]">flegm</span>
          <span className="text-xs text-[var(--muted)]">the youtube leaderboard</span>
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
          <Link href="/" className="hover:text-purple-600 transition-colors">Home</Link>
          <Link href="/leaderboard" className="hover:text-purple-600 transition-colors">Leaderboard</Link>
          <Link href="/submit" className="hover:text-purple-600 transition-colors">Drop a video</Link>
        </nav>
      </div>
    </footer>
  );
}
