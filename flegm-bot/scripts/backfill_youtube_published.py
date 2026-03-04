"""One-off: fetch YouTube publishedAt for all videos and set youtube_published_at in Supabase."""

import os
import sys
from datetime import datetime, timezone

# Run from repo root so bot.* imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.isfile(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

def main():
    load_env()
    api_key = os.environ.get("YOUTUBE_API_KEY")
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_ANON_KEY")
    if not all((api_key, supabase_url, supabase_key)):
        print("Missing YOUTUBE_API_KEY, SUPABASE_URL or SUPABASE_ANON_KEY in .env")
        sys.exit(1)

    from supabase import create_client
    from bot.scraper import YouTubeScraper

    client = create_client(supabase_url, supabase_key)
    scraper = YouTubeScraper(api_key)

    r = client.table("videos").select("id, youtube_id").execute()
    rows = r.data or []
    if not rows:
        print("No videos in DB.")
        return

    id_by_youtube_id = {r["youtube_id"]: r["id"] for r in rows}
    youtube_ids = list(id_by_youtube_id.keys())
    batch_size = 50
    updated = 0
    for i in range(0, len(youtube_ids), batch_size):
        batch = youtube_ids[i : i + batch_size]
        videos = scraper._enrich_videos(batch)
        for v in videos:
            uid = id_by_youtube_id.get(v.video_id)
            if not uid:
                continue
            # ISO format with Z for UTC
            published_at = v.published_at
            if published_at.tzinfo is None:
                published_at = published_at.replace(tzinfo=timezone.utc)
            value = published_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            client.table("videos").update({"youtube_published_at": value}).eq("id", uid).execute()
            updated += 1
        print(f"Batch {i // batch_size + 1}: updated {len(videos)} rows (total {updated})")

    print(f"Done. Set youtube_published_at for {updated} videos.")

if __name__ == "__main__":
    main()
