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
};

export function HomeSection({
  title,
  videos,
  summary,
  emptyMessage = "No videos yet.",
}: Props) {
  return (
    <section className="mb-10">
      <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500 mb-3">
        {title}
      </h2>
      {summary && (
        <p className="text-slate-600 text-sm mb-3">{summary}</p>
      )}
      {videos.length === 0 ? (
        <p className="text-slate-400 text-sm py-4">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {videos.map((video) => (
            <li key={video.id}>
              <VideoCard video={video} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
