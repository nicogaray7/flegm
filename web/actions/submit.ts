"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { videos, profiles } from "@/db/schema";
import { extractVideoId, fetchVideoMetadata } from "@/lib/youtube";
import { eq } from "drizzle-orm";

export type SubmitResult = { error?: string; youtubeId?: string };

export async function submitVideo(
  _prev: SubmitResult | null,
  formData: FormData
): Promise<SubmitResult> {
  const url = formData.get("url");
  if (typeof url !== "string" || !url.trim()) {
    return { error: "Please enter a YouTube URL." };
  }

  const youtubeId = extractVideoId(url);
  if (!youtubeId) {
    return { error: "Invalid YouTube URL. Use a link like youtube.com/watch?v=... or youtu.be/..." };
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "You must be signed in to submit a video." };
  }

  const existing = await db.query.videos.findFirst({
    where: eq(videos.youtubeId, youtubeId),
    columns: { youtubeId: true },
  });

  if (existing) {
    redirect(`/v/${youtubeId}`);
  }

  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey) {
    return { error: "YouTube API is not configured." };
  }

  const metadata = await fetchVideoMetadata(youtubeId, apiKey);
  if (!metadata) {
    return { error: "Could not fetch video details. Check the URL and try again." };
  }

  const username =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";
  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  await db
    .insert(profiles)
    .values({
      id: user.id,
      username,
      avatarUrl,
    })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { username, avatarUrl },
    });

  await db.insert(videos).values({
    youtubeId,
    title: metadata.title,
    channelName: metadata.channelName,
    channelId: metadata.channelId,
    channelThumbnail: metadata.channelThumbnail,
    duration: metadata.duration,
    upvotesCount: 0,
    clippeurId: user.id,
  });

  redirect(`/v/${youtubeId}?submitted=1`);
}
