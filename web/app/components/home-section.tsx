import { VideoCard } from "./video-card";
import type { Locale } from "@/lib/i18n";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  upvotesCount: number;
  botUpvotesCount?: number | null;
  duration: number;
};

type Props = {
  title: string;
  emoji?: string;
  videos: Video[];
  summary?: string;
  emptyMessage?: string;
  showRanks?: boolean;
  locale?: Locale;
};

export function HomeSection({
  title,
  emoji,
  videos,
  summary,
  emptyMessage = "No videos yet.",
  showRanks = true,
  locale = "en",
}: Props) {
  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2.5">
        {emoji && <span className="text-xl">{emoji}</span>}
        <h2 className="text-lg font-extrabold tracking-tight text-[var(--foreground)]">
          {title}
        </h2>
        {videos.length > 0 && (
          <span className="rounded-full gradient-bg px-2.5 py-0.5 text-xs font-bold text-white">
            {videos.length}
          </span>
        )}
      </div>
      {summary && (
        <p className="mb-4 text-sm text-[var(--muted)]">{summary}</p>
      )}
      {videos.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/50 px-6 py-8 text-center">
          <p className="text-[var(--muted)] text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {videos.map((video, index) => (
            <li key={video.id}>
              <VideoCard
                video={video}
                rank={showRanks ? index + 1 : undefined}
                locale={locale}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
