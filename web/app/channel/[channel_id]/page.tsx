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

      <main className="mx-auto max-w-3xl px-4 py-8">
        {/* Channel header card */}
        <section className="mb-8 flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5">
          {channelThumbnail ? (
            <Image
              src={channelThumbnail}
              alt=""
              className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
              width={56}
              height={56}
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
              {channelName?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900">{channelName}</h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {channelVideos.length} video{channelVideos.length !== 1 ? "s" : ""} on Flegm
            </p>
          </div>
        </section>

        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Videos
          </h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
            {channelVideos.length}
          </span>
        </div>
        <ul className="space-y-2">
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
