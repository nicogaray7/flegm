import Link from "next/link";
import Image from "next/image";
import { formatDurationHMS } from "@/lib/format-duration";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  upvotesCount: number;
  duration: number;
};

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
      className="group feed-card block"
    >
      {/* Thumbnail: TikTok-style tall-ish block */}
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--surface)]">
        <Image
          src={thumbUrl}
          alt=""
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 400px"
          unoptimized
        />
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-1 text-xs font-medium text-white tabular-nums backdrop-blur-sm">
          {formatDurationHMS(video.duration)}
        </span>
        {rank !== undefined && (
          <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-sm font-bold text-white backdrop-blur-sm">
            {rank}
          </span>
        )}
        <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          <svg width="10" height="8" viewBox="0 0 12 8" fill="currentColor">
            <path d="M6 0L11.196 7.5H0.804L6 0Z" />
          </svg>
          {video.upvotesCount}
        </span>
      </div>

      {/* Info below thumbnail */}
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-semibold text-[var(--foreground)] leading-snug group-hover:text-[var(--accent)] transition-colors">
          {video.title}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)] truncate">
          {video.channelName}
        </p>
      </div>
    </Link>
  );
}
