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
    <div className="min-h-screen bg-white">
      <GaEvent
        eventName="video_view"
        params={{
          video_id: video.youtubeId,
          video_title: video.title,
          channel_name: video.channelName,
        }}
      />
      {submitted === "1" && (
        <GaEvent
          eventName="video_submit"
          params={{ youtube_id: video.youtubeId }}
        />
      )}
      <Header />

      <main className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <VideoPlayer videoId={video.youtubeId} title={video.title} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <UpvoteButton
            videoUuid={video.id}
            initialCount={video.upvotesCount}
            initialUpvoted={upvoted}
            signedIn={!!user}
            signInNext={signInNext}
          />
          <span className="text-slate-400 text-sm">·</span>
          <span className="text-sm text-slate-600">{durationStr}</span>
        </div>

        <h1 className="text-xl font-semibold text-slate-900 mb-2">{video.title}</h1>

        <section className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 mb-8">
          <h2 className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">
            Channel
          </h2>
          <Link
            href={`/channel/${encodeURIComponent(video.channelId)}`}
            className="flex items-center gap-3 group"
          >
            {video.channelThumbnail && (
              <Image
                src={video.channelThumbnail}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
                width={40}
                height={40}
              />
            )}
            <span className="font-medium text-slate-900 group-hover:text-emerald-600">
              {video.channelName}
            </span>
            <span className="text-slate-400 group-hover:text-emerald-500">→</span>
          </Link>
        </section>

        <section className="border-t border-slate-200 pt-6">
          <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500 mb-4">
            Comments
          </h2>
          {user && (
            <div className="mb-6">
              <CommentForm
                youtubeId={youtube_id}
                videoUuid={video.id}
                parentId={null}
              />
            </div>
          )}
          {!user && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="text-sm text-slate-500">Sign in to comment.</p>
              <SignInButton next={signInNext} context="comment" />
            </div>
          )}
          {commentTree.length === 0 ? (
            <p className="text-sm text-slate-400">No comments yet.</p>
          ) : (
            <CommentTree
              youtubeId={youtube_id}
              videoUuid={video.id}
              tree={commentTree}
              signedIn={!!user}
            />
          )}
        </section>
      </main>
    </div>
  );
}
