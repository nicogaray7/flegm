import { db } from "@/db";
import { videos, comments, profiles, upvotes } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";

export type CommentWithAuthor = {
  id: string;
  videoId: string;
  userId: string;
  parentId: string | null;
  content: string;
  status: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: Date;
};

export type CommentNode = CommentWithAuthor & { replies: CommentNode[] };

function buildCommentTree(
  flat: CommentWithAuthor[],
  parentId: string | null = null
): CommentNode[] {
  return flat
    .filter((c) => c.parentId === parentId)
    .map((c) => ({
      ...c,
      replies: buildCommentTree(flat, c.id),
    }))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

/**
 * Get video and comment tree. Comments shown: all 'approved', OR current user's own (any status e.g. pending).
 */
export async function getVideoPageData(
  youtubeId: string,
  currentUserId: string | null = null
) {
  const video = await db.query.videos.findFirst({
    where: eq(videos.youtubeId, youtubeId),
  });
  if (!video) return null;

  const commentFilter =
    currentUserId == null
      ? and(eq(comments.videoId, video.id), eq(comments.status, "approved"))
      : and(
          eq(comments.videoId, video.id),
          or(
            eq(comments.status, "approved"),
            eq(comments.userId, currentUserId)
          )
        );

  const allComments = await db
    .select({
      id: comments.id,
      videoId: comments.videoId,
      userId: comments.userId,
      parentId: comments.parentId,
      content: comments.content,
      status: comments.status,
      createdAt: comments.createdAt,
      username: profiles.username,
      avatarUrl: profiles.avatarUrl,
    })
    .from(comments)
    .leftJoin(profiles, eq(comments.userId, profiles.id))
    .where(commentFilter)
    .orderBy(comments.createdAt);

  const commentNodes: CommentWithAuthor[] = allComments.map((c) => ({
    id: c.id,
    videoId: c.videoId,
    userId: c.userId,
    parentId: c.parentId,
    content: c.content,
    status: c.status,
    authorName: c.username ?? "Anonymous",
    authorAvatar: c.avatarUrl ?? null,
    createdAt: c.createdAt,
  }));

  const commentTree = buildCommentTree(commentNodes);

  return {
    video,
    commentTree,
  };
}

export async function getUserUpvoteStatus(
  videoUuid: string,
  userId: string | null
): Promise<boolean> {
  if (!userId) return false;
  const row = await db.query.upvotes.findFirst({
    where: and(
      eq(upvotes.videoId, videoUuid),
      eq(upvotes.userId, userId)
    ),
  });
  return !!row;
}
