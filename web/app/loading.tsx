export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-emerald-500" />
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
