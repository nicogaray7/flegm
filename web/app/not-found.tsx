import Link from "next/link";
import { getServerDictionary } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getServerDictionary();
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4">
      <div className="card px-8 py-10 text-center max-w-sm">
        <p className="text-5xl font-bold text-zinc-200 mb-3">404</p>
        <h1 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          {t.notFound.title}
        </h1>
        <p className="text-[var(--muted)] text-sm mb-6">
          {t.notFound.text}
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
        >
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  );
}
