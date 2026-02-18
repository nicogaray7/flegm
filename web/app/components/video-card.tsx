import Link from "next/link";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  upvotesCount: number;
  duration: number;
};

export function VideoCard({ video }: { video: Video }) {
  const minutes = Math.floor(video.duration / 60);
  const seconds = video.duration % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  return (
    <Link
      href={`/v/${video.youtubeId}`}
      className="group flex items-start gap-3 rounded-lg border border-slate-200/80 bg-white px-4 py-3 transition-colors hover:border-slate-300 hover:bg-slate-50/50"
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900 group-hover:text-emerald-600 truncate">
          {video.title}
        </p>
        <p className="mt-0.5 text-sm text-slate-500">{video.channelName}</p>
        <p className="mt-1 text-xs text-slate-400">
          {video.upvotesCount} upvote{video.upvotesCount !== 1 ? "s" : ""} · {timeStr}
        </p>
      </div>
      <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">
        →
      </span>
    </Link>
  );
}
