"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center px-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] px-8 py-10 text-center max-w-sm">
          <h1 className="text-lg font-semibold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-zinc-500 text-sm mb-6 text-center max-w-md">
            {error.message}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            Try again
          </button>
          <a href="/" className="mt-3 block text-sm text-zinc-600 hover:text-white transition-colors">
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
