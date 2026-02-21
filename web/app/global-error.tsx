"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-zinc-100 text-zinc-900 flex flex-col items-center justify-center px-4">
        <div className="rounded-xl border border-zinc-200 bg-white px-8 py-10 text-center max-w-sm">
          <h1 className="text-lg font-semibold mb-2">Something went wrong</h1>
          <p className="text-zinc-500 text-sm mb-6">{error.message}</p>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-block rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Try again
          </button>
          <a href="/" className="mt-3 block text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
