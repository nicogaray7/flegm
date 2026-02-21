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

  const durationStr =
    Math.floor(video.duration / 60) > 0
      ? `${Math.floor(video.duration / 60)}m ${video.duration % 60}s`
      : `${video.duration}s`;

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

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Video player */}
        <div className="mb-6 overflow-hidden rounded-xl shadow-sm">
          <VideoPlayer videoId={video.youtubeId} title={video.title} />
        </div>

        {/* Title + meta row */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[var(--foreground)] mb-3">{video.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <UpvoteButton
              videoUuid={video.id}
              initialCount={video.upvotesCount}
              initialUpvoted={upvoted}
              signedIn={!!user}
              signInNext={signInNext}
            />
            <span className="text-[var(--border)]">|</span>
            <span className="text-sm text-[var(--muted)]">{durationStr}</span>
          </div>
        </div>

        {/* Channel card */}
        <section className="card p-4 mb-6">
          <Link
            href={`/channel/${encodeURIComponent(video.channelId)}`}
            className="flex items-center gap-3 group"
          >
            {video.channelThumbnail && (
              <Image
                src={video.channelThumbnail}
                alt=""
                className="h-10 w-10 rounded-full object-cover ring-2 ring-zinc-100"
                width={40}
                height={40}
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-[var(--foreground)] group-hover:text-emerald-600 transition-colors">
                {video.channelName}
              </p>
              <p className="text-xs text-[var(--muted)]">View channel</p>
            </div>
            <svg className="h-4 w-4 text-[var(--muted-light)] group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        {/* Comments */}
        <section className="card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)] mb-4">
            Comments
          </h2>
          {user && (
            <div className="mb-6">
              <CommentForm youtubeId={youtube_id} videoUuid={video.id} parentId={null} />
            </div>
          )}
          {!user && (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-zinc-50 px-4 py-3">
              <p className="text-sm text-[var(--muted)]">Sign in to join the discussion.</p>
              <SignInButton next={signInNext} context="comment" />
            </div>
          )}
          {commentTree.length === 0 ? (
            <p className="text-sm text-[var(--muted-light)] py-2">No comments yet. Be the first to share your thoughts.</p>
          ) : (
            <CommentTree youtubeId={youtube_id} videoUuid={video.id} tree={commentTree} signedIn={!!user} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
