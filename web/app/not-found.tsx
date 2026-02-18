import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <h1 className="text-xl font-semibold text-slate-900 mb-2">
        404 – Page not found
      </h1>
      <p className="text-slate-600 text-sm mb-4">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
      >
        Back to home
      </Link>
    </div>
  );
}
