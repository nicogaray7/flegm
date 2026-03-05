"""YouTube API v3 scraper and RSS feed parser."""

import logging
import re
from dataclasses import dataclass, field
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

RSS_URL = "https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"

# YouTube Shorts: max 180 seconds (3 min) — exclude from publishing
SHORTS_MAX_DURATION_SECONDS = 180


def _exclude_shorts(videos: list["Video"]) -> list["Video"]:
    """Filter out Shorts (duration <= 180s)."""
    return [v for v in videos if v.duration > SHORTS_MAX_DURATION_SECONDS]


def _parse_iso8601_duration(duration: str) -> int:
    """Convert ISO 8601 duration (e.g. PT3M45S) to total seconds."""
    match = re.match(
        r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration or ""
    )
    if not match:
        return 0
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


@dataclass
class Video:
    video_id: str
    youtube_url: str
    title: str
    description: str
    thumbnail_url: str
    channel_name: str
    channel_id: str
    published_at: datetime
    view_count: int
    duration: int = 0              # seconds
    tags: list[str] = field(default_factory=list)


class YouTubeScraper:
    def __init__(self, api_key: str):
        self._api_key = api_key
        self._youtube = None

    def _client(self):
        if self._youtube is None:
            from googleapiclient.discovery import build  # lazy import
            self._youtube = build("youtube", "v3", developerKey=self._api_key)
        return self._youtube

    def _build_video(self, item: dict) -> Video:
        snippet = item.get("snippet", {})
        stats = item.get("statistics", {})
        content_details = item.get("contentDetails", {})
        vid_id = item["id"]
        thumbnails = snippet.get("thumbnails", {})
        thumb = (
            thumbnails.get("maxres")
            or thumbnails.get("high")
            or thumbnails.get("medium")
            or thumbnails.get("default")
            or {}
        )
        raw_dt = snippet.get("publishedAt", "")
        try:
            published_at = datetime.fromisoformat(raw_dt.replace("Z", "+00:00"))
        except ValueError:
            published_at = datetime.now(timezone.utc)

        return Video(
            video_id=vid_id,
            youtube_url=f"https://www.youtube.com/watch?v={vid_id}",
            title=snippet.get("title", ""),
            description=snippet.get("description", ""),
            thumbnail_url=thumb.get("url", ""),
            channel_name=snippet.get("channelTitle", ""),
            channel_id=snippet.get("channelId", ""),
            published_at=published_at,
            view_count=int(stats.get("viewCount", 0)),
            duration=_parse_iso8601_duration(content_details.get("duration", "")),
            tags=snippet.get("tags", []),
        )

    def _enrich_videos(self, video_ids: list[str]) -> list[Video]:
        """Fetch full details (statistics + snippet + contentDetails) for a list of video IDs."""
        if not video_ids:
            return []
        try:
            response = (
                self._client()
                .videos()
                .list(part="snippet,statistics,contentDetails", id=",".join(video_ids))
                .execute()
            )
        except Exception as exc:
            logger.error("YouTube videos.list error: %s", exc)
            return []
        return [self._build_video(item) for item in response.get("items", [])]

    def get_popular_videos(self, channel_id: str, count: int) -> list[Video]:
        """Return the most viewed videos for a channel."""
        logger.info("Fetching %d popular videos for channel %s", count, channel_id)
        try:
            search_response = (
                self._client()
                .search()
                .list(
                    part="id",
                    channelId=channel_id,
                    order="viewCount",
                    type="video",
                    maxResults=count,
                )
                .execute()
            )
        except Exception as exc:
            logger.error("YouTube search.list (popular) error: %s", exc)
            return []

        video_ids = [
            item["id"]["videoId"]
            for item in search_response.get("items", [])
            if item.get("id", {}).get("kind") == "youtube#video"
        ]
        return _exclude_shorts(self._enrich_videos(video_ids))

    def get_recent_videos(self, channel_id: str, count: int) -> list[Video]:
        """Return the most recently published videos for a channel."""
        logger.info("Fetching %d recent videos for channel %s", count, channel_id)
        try:
            search_response = (
                self._client()
                .search()
                .list(
                    part="id",
                    channelId=channel_id,
                    order="date",
                    type="video",
                    maxResults=count,
                )
                .execute()
            )
        except Exception as exc:
            logger.error("YouTube search.list (recent) error: %s", exc)
            return []

        video_ids = [
            item["id"]["videoId"]
            for item in search_response.get("items", [])
            if item.get("id", {}).get("kind") == "youtube#video"
        ]
        return _exclude_shorts(self._enrich_videos(video_ids))

    def get_rss_videos(self, channel_id: str, since: datetime) -> list[Video]:
        """Return videos published after `since` via the YouTube RSS feed."""
        import feedparser  # lazy import — not needed for YouTube API usage
        url = RSS_URL.format(channel_id=channel_id)
        logger.info("Fetching RSS feed for channel %s (since %s)", channel_id, since)
        try:
            feed = feedparser.parse(url)
        except Exception as exc:
            logger.warning("RSS parse error for channel %s: %s", channel_id, exc)
            return []

        if feed.bozo and feed.bozo_exception:
            logger.warning("RSS feed warning for %s: %s", channel_id, feed.bozo_exception)

        videos: list[Video] = []
        for entry in feed.entries:
            published_struct = entry.get("published_parsed")
            if published_struct is None:
                continue
            published_at = datetime(*published_struct[:6], tzinfo=timezone.utc)
            # Make `since` timezone-aware if naive
            since_aware = since if since.tzinfo else since.replace(tzinfo=timezone.utc)
            if published_at <= since_aware:
                continue

            vid_id = entry.get("yt_videoid") or entry.get("id", "").split(":")[-1]
            if not vid_id:
                continue

            thumbnails = entry.get("media_thumbnail", [{}])
            thumb_url = thumbnails[0].get("url", "") if thumbnails else ""

            videos.append(
                Video(
                    video_id=vid_id,
                    youtube_url=f"https://www.youtube.com/watch?v={vid_id}",
                    title=entry.get("title", ""),
                    description=entry.get("summary", ""),
                    thumbnail_url=thumb_url,
                    channel_name=feed.feed.get("title", ""),
                    channel_id=channel_id,
                    published_at=published_at,
                    view_count=0,
                    tags=[],
                )
            )

        logger.info("RSS: found %d new videos for channel %s", len(videos), channel_id)
        if not videos:
            return []
        video_ids = [v.video_id for v in videos]
        enriched = self._enrich_videos(video_ids)
        return _exclude_shorts(enriched)
