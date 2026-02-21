import Link from "next/link";

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl sm:relative sm:mt-auto sm:border-t sm:bg-transparent sm:backdrop-blur-none">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2 sm:justify-between sm:px-4 sm:py-4">
        <Link href="/" className="flex flex-col items-center gap-0.5 rounded-lg px-4 py-2 text-[var(--muted)] hover:text-[var(--foreground)] sm:flex-row sm:gap-2" aria-label="Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-xs font-medium sm:text-sm">Home</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-0.5 rounded-lg px-4 py-2 text-[var(--muted)] hover:text-[var(--foreground)] sm:flex-row sm:gap-2" aria-label="Leaderboard">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-xs font-medium sm:text-sm">Leaderboard</span>
        </Link>
        <Link href="/submit" className="flex flex-col items-center gap-0.5 rounded-lg px-4 py-2 text-[var(--muted)] hover:text-[var(--foreground)] sm:flex-row sm:gap-2" aria-label="Submit">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span className="text-xs font-medium sm:text-sm">Submit</span>
        </Link>
      </div>
    </footer>
  );
}
