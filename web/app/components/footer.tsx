import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500 text-[10px] font-bold text-white">
            F
          </span>
          <span className="text-sm font-semibold text-gray-900">Flegm</span>
        </div>
        <nav className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/leaderboard" className="hover:text-gray-900 transition-colors">
            Leaderboard
          </Link>
          <Link href="/submit" className="hover:text-gray-900 transition-colors">
            Submit
          </Link>
        </nav>
      </div>
    </footer>
  );
}
