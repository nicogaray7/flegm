"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { comments, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const MAX_COMMENT_LENGTH = 2000;
import { calculateRiskScore, shouldHoldForReview } from "@/lib/moderation";
import { sendModerationAlert } from "@/lib/resend-alert";

export type AddCommentResult = { error?: string };

function getVideoPageUrl(youtubeId: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  return `${base.replace(/\/$/, "")}/v/${youtubeId}`;
}

export async function addComment(
  youtubeId: string,
  videoUuid: string,
  content: string,
  parentId: string | null
): Promise<AddCommentResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Sign in to comment." };
  }

  const trimmed = content.trim();
  if (!trimmed) return { error: "Comment cannot be empty." };
  if (trimmed.length > MAX_COMMENT_LENGTH) {
    return { error: `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.` };
  }

  if (parentId) {
    const parentComment = await db.query.comments.findFirst({
      where: and(eq(comments.id, parentId), eq(comments.videoId, videoUuid)),
      columns: { id: true },
    });
    if (!parentComment) return { error: "Invalid parent comment." };
  }

  const riskScore = calculateRiskScore(trimmed);
  const status = shouldHoldForReview(riskScore) ? "pending" : "approved";

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
    .values({ id: user.id, username, avatarUrl })
    .onConflictDoUpdate({
      target: profiles.id,
      set: { username, avatarUrl },
    });

  const [inserted] = await db
    .insert(comments)
    .values({
      videoId: videoUuid,
      userId: user.id,
      parentId: parentId || null,
      content: trimmed,
      status,
      riskScore,
    })
    .returning({ id: comments.id });

  if (status === "pending" && inserted) {
    await sendModerationAlert({
      commentId: inserted.id,
      commentContent: trimmed,
      videoPageUrl: getVideoPageUrl(youtubeId),
      authorName: username,
    });
  }

  revalidatePath(`/v/${youtubeId}`);
  return {};
}
