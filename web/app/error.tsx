"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-8 py-10 text-center max-w-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-zinc-500 text-sm mb-6 max-w-md">
          {error.message}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="mt-3 block text-sm text-zinc-600 hover:text-white transition-colors"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
