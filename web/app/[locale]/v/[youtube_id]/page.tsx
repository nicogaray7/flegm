import type { Metadata } from "next";
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
import { SignInButton } from "@/app/[locale]/submit/sign-in-button";
import { GaEvent } from "@/app/components/ga-event";
import { SubmitSuccessBanner } from "@/app/components/submit-success-banner";
import { getServerDictionary } from "@/lib/i18n/server";
import { getAlternateLanguages, getCanonicalForLocale } from "@/lib/i18n/alternates";
import type { Locale } from "@/lib/i18n";
import { formatDurationHMS } from "@/lib/format-duration";
import { formatDurationISO } from "@/lib/format-duration";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://flegm.fr";

type Props = {
  params: Promise<{ locale: string; youtube_id: string }>;
  searchParams: Promise<{ submitted?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, youtube_id } = await params;
  const video = await db.query.videos.findFirst({
    where: eq(videos.youtubeId, youtube_id),
  });
  if (!video) return { title: "Video Not Found" };

  const title = `${video.title} — ${video.channelName}`;
  const description = `Watch "${video.title}" by ${video.channelName} on Flegm. ${video.upvotesCount} upvotes. Drop, upvote, and discover the top YouTube videos.`;
  const canonical = getCanonicalForLocale(locale as Locale, `v/${youtube_id}`);

  return {
    title,
    description,
    alternates: { canonical, languages: getAlternateLanguages(`v/${youtube_id}`) },
    openGraph: {
      title,
      description,
      type: "video.other",
      url: canonical,
      images: [
        {
          url: `https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`,
          width: 480,
          height: 360,
          alt: video.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`https://i.ytimg.com/vi/${youtube_id}/hqdefault.jpg`],
    },
  };
}

export default async function VideoPage({ params, searchParams }: Props) {
  const { locale, t } = await getServerDictionary();
  const { youtube_id } = await params;
  const { submitted } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const data = await getVideoPageData(youtube_id, user?.id ?? null);
  if (!data) notFound();

  const { video, commentTree } = data;
  const upvoted = await getUserUpvoteStatus(video.id, user?.id ?? null);
  const signInNext = `/${locale}/v/${youtube_id}`;

  const durationFormatted = formatDurationHMS(video.duration);

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: `${video.title} by ${video.channelName} — community-ranked on Flegm`,
    thumbnailUrl: `https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`,
    uploadDate: video.createdAt.toISOString(),
    duration: formatDurationISO(video.duration),
    contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: "https://schema.org/LikeAction",
      userInteractionCount: video.upvotesCount,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Flegm", item: baseUrl },
      { "@type": "ListItem", position: 2, name: video.channelName, item: `${baseUrl}/${locale}/channel/${encodeURIComponent(video.channelId)}` },
      { "@type": "ListItem", position: 3, name: video.title, item: `${baseUrl}/${locale}/v/${video.youtubeId}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
        {submitted === "1" && (
          <SubmitSuccessBanner path={`/${locale}/v/${youtube_id}`} />
        )}
        {/* Video player */}
        <div className="mb-6 overflow-hidden rounded-2xl shadow-lg shadow-purple-500/10">
          <VideoPlayer videoId={video.youtubeId} title={video.title} />
        </div>

        {/* Title + meta row */}
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-[var(--foreground)] mb-3">{video.title}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <UpvoteButton
              videoUuid={video.id}
              initialCount={video.upvotesCount}
              initialUpvoted={upvoted}
              signedIn={!!user}
              signInNext={signInNext}
            />
            <span className="text-[var(--border)]">|</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-[var(--muted)]">
              {"\u{23F1}"} {durationFormatted}
            </span>
          </div>
        </div>

        {/* Channel card */}
        <section className="card p-4 mb-6">
          <Link
            href={`/${locale}/channel/${encodeURIComponent(video.channelId)}`}
            className="flex items-center gap-3 group"
          >
            {video.channelThumbnail && (
              <Image
                src={video.channelThumbnail}
                alt=""
                className="h-11 w-11 rounded-xl object-cover ring-2 ring-purple-100"
                width={44}
                height={44}
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-bold text-[var(--foreground)] group-hover:text-purple-600 transition-colors">
                {video.channelName}
              </p>
              <p className="text-xs text-[var(--muted)]">{t.video.viewChannel}</p>
            </div>
            <svg className="h-4 w-4 text-[var(--muted-light)] group-hover:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </section>

        {/* Comments */}
        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-[var(--foreground)] mb-4">
            <span>{"\u{1F4AC}"}</span> {t.video.comments}
          </h2>
          {user && (
            <div className="mb-6">
              <CommentForm youtubeId={youtube_id} videoUuid={video.id} parentId={null} />
            </div>
          )}
          {!user && (
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl bg-purple-50 border border-purple-100 px-4 py-3">
              <p className="text-sm text-[var(--muted)]">{t.video.joinConvo}</p>
              <SignInButton next={signInNext} context="comment" />
            </div>
          )}
          {commentTree.length === 0 ? (
            <p className="text-sm text-[var(--muted-light)] py-4 text-center">{t.video.noComments}</p>
          ) : (
            <CommentTree youtubeId={youtube_id} videoUuid={video.id} tree={commentTree} signedIn={!!user} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
