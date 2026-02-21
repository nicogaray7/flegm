import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-8 py-10 text-center max-w-sm">
        <p className="text-4xl font-bold text-zinc-800 mb-3">404</p>
        <h1 className="text-lg font-semibold text-white mb-2">
          Page not found
        </h1>
        <p className="text-zinc-500 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
