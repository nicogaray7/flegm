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
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          {title}
        </h2>
        {videos.length > 0 && (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {videos.length}
          </span>
        )}
      </div>
      {summary && (
        <p className="text-gray-500 text-sm mb-3">{summary}</p>
      )}
      {videos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-8 text-center">
          <p className="text-gray-400 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="space-y-2">
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
