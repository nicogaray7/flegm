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
      className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.07]"
    >
      {rank !== undefined && (
        <span className="hidden sm:flex h-7 w-7 shrink-0 items-center justify-center text-sm font-semibold text-zinc-600">
          {rank}
        </span>
      )}

      {/* Thumbnail */}
      <div className="relative shrink-0 h-16 w-28 overflow-hidden rounded-xl bg-white/[0.06]">
        <Image
          src={thumbUrl}
          alt=""
          fill
          className="object-cover"
          sizes="112px"
          unoptimized
        />
        <span className="absolute bottom-1 right-1 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-medium text-white leading-none">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-white group-hover:text-emerald-400 truncate text-sm leading-snug">
          {video.title}
        </p>
        <p className="mt-1 text-xs text-zinc-500 truncate">
          {video.channelName}
        </p>
      </div>

      {/* Upvote badge */}
      <div className="shrink-0 flex flex-col items-center gap-0.5 rounded-xl border border-white/[0.1] px-3 py-1.5 text-zinc-500 group-hover:border-emerald-500/40 group-hover:text-emerald-400 transition-colors">
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
