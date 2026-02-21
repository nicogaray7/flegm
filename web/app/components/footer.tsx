import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            F
          </span>
          <span className="text-sm font-semibold text-[var(--foreground)]">Flegm</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
          <Link href="/leaderboard" className="hover:text-[var(--foreground)] transition-colors">Leaderboard</Link>
          <Link href="/submit" className="hover:text-[var(--foreground)] transition-colors">Submit</Link>
        </nav>
      </div>
    </footer>
  );
}
