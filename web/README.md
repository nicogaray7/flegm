# Flegm Platform (Next.js workspace)

Next.js 14 with TypeScript, Tailwind CSS, and App Router. Light mode only. Drizzle ORM + PostgreSQL (Supabase).

## Setup

1. **Install dependencies**
   ```bash
   cd web && npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Set `DATABASE_URL` to your Supabase Postgres connection string (Project Settings → Database)

3. **Database**
   ```bash
   npm run db:push    # push schema to Supabase
   npm run db:studio  # open Drizzle Studio (optional)
   ```

4. **Run**
   ```bash
   npm run dev
   ```

## Schema (Drizzle)

- **profiles** – id, username, avatar_url  
- **videos** – id, youtube_id (unique), title, channel_name, channel_id, channel_thumbnail, duration, upvotes_count, clippeur_id, created_at  
- **upvotes** – composite PK (user_id, video_id)  
- **comments** – id, video_id, user_id, parent_id (threading), content, status (default `approved`), risk_score  
