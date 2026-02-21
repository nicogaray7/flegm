import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
      <div className="card px-8 py-10 text-center max-w-sm">
        <p className="text-5xl font-bold text-[var(--muted)] mb-3">404</p>
        <h1 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          Page not found
        </h1>
        <p className="text-[var(--muted)] text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-[var(--accent)] px-5 py-2 text-sm font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
