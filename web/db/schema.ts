import { sql } from "drizzle-orm";
import {
  doublePrecision,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url"),
});

export const videos = pgTable("videos", {
  id: uuid("id").primaryKey().defaultRandom(),
  youtubeId: varchar("youtube_id", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  channelName: text("channel_name").notNull(),
  channelId: text("channel_id").notNull(),
  channelThumbnail: text("channel_thumbnail"),
  duration: integer("duration").notNull(),
  upvotesCount: integer("upvotes_count").notNull().default(0),
  /** Simulated upvotes for bot-published videos (so we keep real upvotes in `upvotes` table). */
  botUpvotesCount: integer("bot_upvotes_count").notNull().default(0),
  /** YouTube view count (for bot upvote formula). */
  viewCount: integer("view_count"),
  /** YouTube like count (for bot upvote formula, engagement ratio). */
  likeCount: integer("like_count"),
  clippeurId: uuid("clippeur_id").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  youtubePublishedAt: timestamp("youtube_published_at", { withTimezone: true }),
  shuffleKey: doublePrecision("shuffle_key").notNull().default(0),
});

/** Order by total upvotes (user + bot) for ranking. */
export const totalUpvotesSql = sql`(videos.upvotes_count + coalesce(videos.bot_upvotes_count, 0))`;

export const upvotes = pgTable(
  "upvotes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => profiles.id),
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.videoId] }),
  })
);

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  videoId: uuid("video_id")
    .notNull()
    .references(() => videos.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id),
  parentId: uuid("parent_id"), // references comments.id (self) for threading
  content: text("content").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("approved"),
  riskScore: integer("risk_score"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
