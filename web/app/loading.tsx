export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-emerald-500" />
        <p className="text-[var(--muted)] text-sm">Loading...</p>
      </div>
    </div>
  );
}
