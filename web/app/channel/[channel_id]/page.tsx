import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { VideoCard } from "@/app/components/video-card";
import { Header } from "@/app/components/header";
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
    <div className="min-h-screen bg-white">
      <GaEvent
        eventName="channel_view"
        params={{ channel_id: decodedId, channel_name: channelName }}
      />
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <section className="mb-8 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
          {channelThumbnail && (
            <Image
              src={channelThumbnail}
              alt=""
              className="h-14 w-14 rounded-full object-cover"
              width={56}
              height={56}
            />
          )}
          <div>
            <h1 className="text-xl font-semibold text-slate-900">{channelName}</h1>
            <p className="text-sm text-slate-500">
              {channelVideos.length} video{channelVideos.length !== 1 ? "s" : ""} on Flegm
            </p>
          </div>
        </section>

        <h2 className="text-sm font-medium uppercase tracking-wide text-slate-500 mb-3">
          Videos
        </h2>
        <ul className="space-y-2">
          {channelVideos.map((video) => (
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
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
