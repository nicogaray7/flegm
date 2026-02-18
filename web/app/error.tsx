"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold text-slate-900 mb-2">
        Something went wrong
      </h1>
      <p className="text-slate-600 text-sm mb-4 text-center max-w-md">
        {error.message}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
      >
        Try again
      </button>
      <a
        href="/"
        className="mt-3 text-sm text-slate-500 hover:text-slate-700"
      >
        Back to home
      </a>
    </div>
  );
}
