"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { LOCALE_COOKIE, locales, defaultLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { videos, profiles } from "@/db/schema";
import { extractVideoId, fetchVideoMetadata, SHORTS_MAX_DURATION_SECONDS } from "@/lib/youtube";
import { desc, eq } from "drizzle-orm";

/** Cooldown between submissions per user (minutes). */
const SUBMIT_COOLDOWN_MINUTES = 5;

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

  const cooldownMs = SUBMIT_COOLDOWN_MINUTES * 60 * 1000;
  const [lastSubmitted] = await db
    .select({ createdAt: videos.createdAt })
    .from(videos)
    .where(eq(videos.clippeurId, user.id))
    .orderBy(desc(videos.createdAt))
    .limit(1);
  if (
    lastSubmitted &&
    lastSubmitted.createdAt.getTime() > Date.now() - cooldownMs
  ) {
    return {
      error: `You can only submit one video every ${SUBMIT_COOLDOWN_MINUTES} minutes. Try again later.`,
    };
  }

  const existing = await db.query.videos.findFirst({
    where: eq(videos.youtubeId, youtubeId),
    columns: { youtubeId: true },
  });

  const cookieStore = await cookies();
  const locale = (locales.includes(cookieStore.get(LOCALE_COOKIE)?.value as Locale)
    ? cookieStore.get(LOCALE_COOKIE)?.value
    : defaultLocale) as Locale;

  if (existing) {
    redirect(`/${locale}/v/${youtubeId}`);
  }

  const apiKey = process.env.YOUTUBE_DATA_API_KEY;
  if (!apiKey) {
    return { error: "YouTube API is not configured." };
  }

  const metadata = await fetchVideoMetadata(youtubeId, apiKey);
  if (!metadata) {
    return { error: "Could not fetch video details. Check the URL and try again." };
  }
  if (metadata.duration <= SHORTS_MAX_DURATION_SECONDS) {
    return {
      error: "Short videos (≤3 min) are not allowed. Please submit a longer video.",
    };
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
    viewCount: metadata.viewCount,
    likeCount: metadata.likeCount,
    clippeurId: user.id,
    shuffleKey: Math.random(),
  });

  redirect(`/${locale}/v/${youtubeId}?submitted=1`);
}
