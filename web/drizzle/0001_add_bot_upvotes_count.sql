-- Add bot_upvotes_count so we can track simulated upvotes for bot-published videos
-- separately from real user upvotes (upvotes_count + upvotes table).
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "bot_upvotes_count" integer DEFAULT 0 NOT NULL;
