import Link from "next/link";
import Image from "next/image";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  upvotesCount: number;
  duration: number;
};

function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return minutes > 0
    ? `${minutes}:${seconds.toString().padStart(2, "0")}`
    : `0:${seconds.toString().padStart(2, "0")}`;
}

export function VideoCard({
  video,
  rank,
}: {
  video: Video;
  rank?: number;
}) {
  const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;

  return (
    <Link
      href={`/v/${video.youtubeId}`}
      className="group flex items-center gap-4 rounded-xl border border-gray-200/80 bg-white px-4 py-3 card-hover hover:border-gray-300"
    >
      {rank !== undefined && (
        <span className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center text-sm font-semibold text-gray-400">
          {rank}
        </span>
      )}

      {/* Thumbnail */}
      <div className="relative shrink-0 h-16 w-28 overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={thumbUrl}
          alt=""
          fill
          className="object-cover"
          sizes="112px"
          unoptimized
        />
        <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white leading-none">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 group-hover:text-emerald-600 truncate text-sm leading-snug">
          {video.title}
        </p>
        <p className="mt-1 text-xs text-gray-500 truncate">
          {video.channelName}
        </p>
      </div>

      {/* Upvote badge (PH-style) */}
      <div className="shrink-0 flex flex-col items-center gap-0.5 rounded-lg border border-gray-200 px-3 py-1.5 text-gray-500 group-hover:border-emerald-300 group-hover:text-emerald-600 transition-colors">
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className="text-current"
        >
          <path d="M6 0L11.196 7.5H0.804L6 0Z" fill="currentColor" />
        </svg>
        <span className="text-xs font-semibold leading-none">{video.upvotesCount}</span>
      </div>
    </Link>
  );
}
