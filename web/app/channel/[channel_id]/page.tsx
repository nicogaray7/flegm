import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
import { Footer } from "@/app/components/footer";
import { GaEvent } from "@/app/components/ga-event";

type Props = { params: Promise<{ channel_id: string }> };

export default async function ChannelPage({ params }: Props) {
  const { channel_id } = await params;
  const decodedId = decodeURIComponent(channel_id);

  const channelVideos = await db
    .select()
    .from(videos)
    .where(eq(videos.channelId, decodedId))
    .orderBy(desc(videos.upvotesCount));

  if (channelVideos.length === 0) notFound();

  const channelName = channelVideos[0].channelName;
  const channelThumbnail = channelVideos[0].channelThumbnail;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <GaEvent
        eventName="channel_view"
        params={{ channel_id: decodedId, channel_name: channelName }}
      />
      <Header />

      <main className="mx-auto max-w-2xl px-3 py-6 pb-24 sm:px-4 sm:pb-8">
        <section className="mb-6 card flex items-center gap-4 p-4">
          {channelThumbnail ? (
            <Image
              src={channelThumbnail}
              alt=""
              className="h-14 w-14 rounded-full object-cover ring-2 ring-[var(--border)]"
              width={56}
              height={56}
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-lg font-bold text-[var(--accent)]">
              {channelName?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[var(--foreground)] truncate">{channelName}</h1>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              {channelVideos.length} video{channelVideos.length !== 1 ? "s" : ""} on Flegm
            </p>
          </div>
        </section>

        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Videos</h2>
          <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-medium text-[var(--muted)]">
            {channelVideos.length}
          </span>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {channelVideos.map((video, index) => (
            <li key={video.id}>
              <VideoCard
                video={{
                  id: video.id,
                  youtubeId: video.youtubeId,
                  title: video.title,
                  channelName: video.channelName,
                  upvotesCount: video.upvotesCount,
                  duration: video.duration,
                }}
                rank={index + 1}
              />
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
