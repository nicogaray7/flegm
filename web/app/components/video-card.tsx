import Link from "next/link";
import Image from "next/image";
import { formatDurationHMS } from "@/lib/format-duration";
import type { Locale } from "@/lib/i18n";

type Video = {
  id: string;
  youtubeId: string;
  title: string;
  channelName: string;
  upvotesCount: number;
  duration: number;
};

function getRankDisplay(rank: number): string {
  if (rank === 1) return "\u{1F947}";
  if (rank === 2) return "\u{1F948}";
  if (rank === 3) return "\u{1F949}";
  return "";
}

export function VideoCard({
  video,
  rank,
  locale = "en",
}: {
  video: Video;
  rank?: number;
  locale?: Locale;
}) {
  const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
  const rankEmoji = rank !== undefined ? getRankDisplay(rank) : "";

  return (
    <Link
      href={`/${locale}/v/${video.youtubeId}`}
      className="group card flex items-center gap-4 px-4 py-3 hover-lift"
    >
      {rank !== undefined && (
        <span className="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold">
          {rankEmoji || (
            <span className="text-[var(--muted-light)]">{rank}</span>
          )}
        </span>
      )}

      {/* Thumbnail */}
      <div className="relative shrink-0 h-[72px] w-32 overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={thumbUrl}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="128px"
          unoptimized
        />
        <span className="absolute bottom-1.5 right-1.5 rounded-lg bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-white leading-none tabular-nums backdrop-blur-sm">
          {formatDurationHMS(video.duration)}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[var(--foreground)] group-hover:text-purple-600 truncate text-sm leading-snug transition-colors">
          {video.title}
        </p>
        <p className="mt-1 text-xs text-[var(--muted)] truncate">
          {video.channelName}
        </p>
      </div>

      {/* Upvote badge */}
      <div className="shrink-0 flex flex-col items-center gap-1 rounded-xl border border-[var(--border)] px-3 py-2 text-[var(--muted)] group-hover:border-purple-300 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-current">
          <path d="M6 0L11.196 7.5H0.804L6 0Z" fill="currentColor" />
        </svg>
        <span className="text-xs font-bold leading-none">{video.upvotesCount}</span>
      </div>
    </Link>
  );
}
