import { VideoCard } from "./video-card";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  upvotesCount: number;
  duration: number;
};

type Props = {
  title: string;
  videos: Video[];
  summary?: string;
  emptyMessage?: string;
  showRanks?: boolean;
};

export function HomeSection({
  title,
  videos,
  summary,
  emptyMessage = "No videos yet.",
  showRanks = true,
}: Props) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
          {title}
        </h2>
        {videos.length > 0 && (
          <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-medium text-[var(--muted)]">
            {videos.length}
          </span>
        )}
      </div>
      {summary && (
        <p className="mb-3 text-xs text-[var(--muted)]">{summary}</p>
      )}
      {videos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 px-6 py-10 text-center">
          <p className="text-[var(--muted)] text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {videos.map((video, index) => (
            <li key={video.id}>
              <VideoCard
                video={video}
                rank={showRanks ? index + 1 : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
