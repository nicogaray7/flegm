import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getVideoPageData, getUserUpvoteStatus } from "@/lib/video-page-data";
import { VideoPlayer } from "./video-player";
import { UpvoteButton } from "./upvote-button";
import { CommentForm } from "./comment-form";
import { CommentTree } from "./comment-tree";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { SignInButton } from "@/app/submit/sign-in-button";
import { GaEvent } from "@/app/components/ga-event";
import { SubmitSuccessBanner } from "@/app/components/submit-success-banner";
import { formatDurationHMS } from "@/lib/format-duration";

type Props = {
  params: Promise<{ youtube_id: string }>;
  searchParams: Promise<{ submitted?: string }>;
};

export default async function VideoPage({ params, searchParams }: Props) {
  const { youtube_id } = await params;
  const { submitted } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const data = await getVideoPageData(youtube_id, user?.id ?? null);
  if (!data) notFound();

  const { video, commentTree } = data;
  const upvoted = await getUserUpvoteStatus(video.id, user?.id ?? null);
  const signInNext = `/v/${youtube_id}`;

  const durationFormatted = formatDurationHMS(video.duration);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <GaEvent
        eventName="video_view"
        params={{
          video_id: video.youtubeId,
          video_title: video.title,
          channel_name: video.channelName,
        }}
      />
      {submitted === "1" && (
        <GaEvent eventName="video_submit" params={{ youtube_id: video.youtubeId }} />
      )}
      <Header />

      <main className="mx-auto max-w-2xl px-3 py-6 pb-24 sm:px-4 sm:pb-8">
        {submitted === "1" && (
          <SubmitSuccessBanner path={`/v/${youtube_id}`} />
        )}
        {/* Video player: full-bleed feel */}
        <div className="mb-4 overflow-hidden rounded-2xl bg-[var(--surface)] ring-1 ring-[var(--border)]">
          <VideoPlayer videoId={video.youtubeId} title={video.title} />
        </div>

        {/* Title + channel + actions row (TikTok-style compact) */}
        <div className="mb-4 flex gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold text-[var(--foreground)] leading-snug line-clamp-2 sm:text-lg">
              {video.title}
            </h1>
            <Link
              href={`/channel/${encodeURIComponent(video.channelId)}`}
              className="mt-2 flex items-center gap-2 group"
            >
              {video.channelThumbnail && (
                <Image
                  src={video.channelThumbnail}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover ring-2 ring-[var(--border)]"
                  width={28}
                  height={28}
                />
              )}
              <span className="text-sm font-medium text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors truncate">
                {video.channelName}
              </span>
              <svg className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0">
            <UpvoteButton
              videoUuid={video.id}
              initialCount={video.upvotesCount}
              initialUpvoted={upvoted}
              signedIn={!!user}
              signInNext={signInNext}
            />
            <span className="text-[10px] font-medium text-[var(--muted)] tabular-nums">
              {durationFormatted}
            </span>
          </div>
        </div>

        {/* Comments */}
        <section className="card p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
            Comments
          </h2>
          {user && (
            <div className="mb-4">
              <CommentForm youtubeId={youtube_id} videoUuid={video.id} parentId={null} />
            </div>
          )}
          {!user && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3">
              <p className="text-sm text-[var(--muted)]">Sign in to join the discussion.</p>
              <SignInButton next={signInNext} context="comment" />
            </div>
          )}
          {commentTree.length === 0 ? (
            <p className="text-sm text-[var(--muted)] py-2">No comments yet. Be the first.</p>
          ) : (
            <CommentTree youtubeId={youtube_id} videoUuid={video.id} tree={commentTree} signedIn={!!user} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
