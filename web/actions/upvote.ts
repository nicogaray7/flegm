"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { videos, upvotes } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export type UpvoteResult = { count: number; upvoted: boolean; error?: string };

export async function toggleUpvote(videoId: string): Promise<UpvoteResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { count: 0, upvoted: false, error: "Sign in to upvote." };
  }

  const video = await db.query.videos.findFirst({
    where: eq(videos.id, videoId),
    columns: { id: true, upvotesCount: true },
  });
  if (!video) {
    return { count: 0, upvoted: false, error: "Video not found." };
  }

  const existing = await db.query.upvotes.findFirst({
    where: and(
      eq(upvotes.userId, user.id),
      eq(upvotes.videoId, video.id)
    ),
  });

  if (existing) {
    await db.delete(upvotes).where(
      and(eq(upvotes.userId, user.id), eq(upvotes.videoId, video.id))
    );
    await db
      .update(videos)
      .set({ upvotesCount: sql`GREATEST(${videos.upvotesCount} - 1, 0)` })
      .where(eq(videos.id, video.id));
    return { count: Math.max(0, video.upvotesCount - 1), upvoted: false };
  } else {
    await db.insert(upvotes).values({
      userId: user.id,
      videoId: video.id,
    });
    await db
      .update(videos)
      .set({ upvotesCount: sql`${videos.upvotesCount} + 1` })
      .where(eq(videos.id, video.id));
    return { count: video.upvotesCount + 1, upvoted: true };
  }
}
