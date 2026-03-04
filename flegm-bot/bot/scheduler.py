"""Orchestration: initialisation + RSS polling loop via APScheduler."""

import logging
import random
import time
from datetime import datetime, timezone
from typing import Any

from apscheduler.schedulers.background import BackgroundScheduler

from bot import state
from bot.commenter import CommentError, FlegmCommenter
from bot.publisher import FlegmPublisher, PublishError
from bot.scraper import Video, YouTubeScraper

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _deduplicate(videos: list[Video]) -> list[Video]:
    """Remove duplicate video_ids from a list (keep first occurrence)."""
    seen: set[str] = set()
    result: list[Video] = []
    for v in videos:
        if v.video_id not in seen:
            seen.add(v.video_id)
            result.append(v)
    return result


def _publish_and_comment(
    video: Video,
    publisher: FlegmPublisher,
    commenter: FlegmCommenter,
    delay: int,
) -> None:
    """Publish a single video and post an LLM comment. Updates state."""
    if state.is_already_posted(video.video_id):
        logger.debug("Skipping already-posted video %s", video.video_id)
        return

    # --- Publish ---
    try:
        flegm_post_id = publisher.post_video(video)
        state.mark_as_posted(video.video_id, flegm_post_id, video.channel_id)
    except PublishError as exc:
        logger.error("Failed to publish video %s: %s", video.video_id, exc)
        state.mark_as_failed(video.video_id, str(exc))
        return

    # --- Comment ---
    try:
        comment_text = commenter.generate_comment(video)
        commenter.post_comment(flegm_post_id, comment_text)
        state.mark_as_commented(video.video_id)
    except CommentError as exc:
        logger.warning(
            "Comment failed for video %s (flegm_post_id=%s): %s",
            video.video_id,
            flegm_post_id,
            exc,
        )
        # Don't mark as failed — video was published successfully

    time.sleep(delay)


# ---------------------------------------------------------------------------
# Initialisation (first run per channel)
# ---------------------------------------------------------------------------


def run_initialization(
    config: dict[str, Any],
    scraper: YouTubeScraper,
    publisher: FlegmPublisher,
    commenter: FlegmCommenter,
) -> None:
    """Fetch popular + recent videos for uninitialised channels, shuffle, then publish."""
    popular_count: int = config.get("initial_popular_count", 5)
    recent_count: int = config.get("initial_recent_count", 5)
    delay: int = config.get("publish_delay_seconds", 3)
    channels: list[dict] = config.get("channels", [])

    # Collect (channel_id, video) for all uninitialised channels
    to_publish: list[tuple[str, Video]] = []
    channels_to_mark: list[str] = []

    for channel in channels:
        channel_id: str = channel["channel_id"]
        if state.is_channel_initialized(channel_id):
            logger.info("Channel %s already initialised — skipping", channel_id)
            continue

        logger.info("Initialising channel %s (%s)", channel_id, channel.get("name", ""))

        try:
            popular = scraper.get_popular_videos(channel_id, popular_count)
            recent = scraper.get_recent_videos(channel_id, recent_count)
        except Exception as exc:
            logger.error("Scraper error during init for %s: %s", channel_id, exc)
            continue

        videos = _deduplicate(popular + recent)
        logger.info(
            "Channel %s: %d unique videos (%d popular, %d recent)",
            channel_id,
            len(videos),
            len(popular),
            len(recent),
        )
        for video in videos:
            to_publish.append((channel_id, video))
        channels_to_mark.append(channel_id)

    if not to_publish:
        return

    random.shuffle(to_publish)
    logger.info("Publishing %d videos in randomised order (across %d channels)", len(to_publish), len(channels_to_mark))

    for channel_id, video in to_publish:
        _publish_and_comment(video, publisher, commenter, delay)

    for channel_id in channels_to_mark:
        state.mark_channel_initialized(channel_id)
        logger.info("Channel %s initialised", channel_id)


# ---------------------------------------------------------------------------
# RSS sync (periodic)
# ---------------------------------------------------------------------------


def run_rss_sync(
    config: dict[str, Any],
    scraper: YouTubeScraper,
    publisher: FlegmPublisher,
    commenter: FlegmCommenter,
) -> None:
    """Check RSS feeds for all channels, collect new videos, shuffle, then publish."""
    delay: int = config.get("publish_delay_seconds", 3)
    channels: list[dict] = config.get("channels", [])
    now = datetime.now(timezone.utc)

    # Collect (channel_id, video) from all channels
    to_publish: list[tuple[str, Video]] = []
    channels_checked: list[str] = []

    for channel in channels:
        channel_id: str = channel["channel_id"]
        since = state.get_last_rss_check(channel_id)
        if since is None:
            from datetime import timedelta
            since = now - timedelta(hours=1)

        logger.info(
            "RSS sync for channel %s (since %s)", channel_id, since.isoformat()
        )

        try:
            videos = scraper.get_rss_videos(channel_id, since)
        except Exception as exc:
            logger.warning("RSS error for channel %s: %s", channel_id, exc)
            channels_checked.append(channel_id)
            continue

        for video in videos:
            to_publish.append((channel_id, video))
        channels_checked.append(channel_id)

    if not to_publish:
        for channel_id in channels_checked:
            state.update_last_rss_check(channel_id, now)
        return

    random.shuffle(to_publish)
    logger.info("Publishing %d new RSS videos in randomised order", len(to_publish))

    for channel_id, video in to_publish:
        _publish_and_comment(video, publisher, commenter, delay)

    for channel_id in channels_checked:
        state.update_last_rss_check(channel_id, now)


# ---------------------------------------------------------------------------
# Scheduler daemon
# ---------------------------------------------------------------------------


class BotScheduler:
    def __init__(
        self,
        config: dict[str, Any],
        scraper: YouTubeScraper,
        publisher: FlegmPublisher,
        commenter: FlegmCommenter,
    ):
        self._config = config
        self._scraper = scraper
        self._publisher = publisher
        self._commenter = commenter
        self._scheduler = BackgroundScheduler(timezone="UTC")

    def start(self) -> None:
        """Initialise all channels, then start the hourly RSS polling loop."""
        state.init_db()
        self._publisher.authenticate()

        # Initial population of uninitialised channels
        run_initialization(
            self._config, self._scraper, self._publisher, self._commenter
        )

        # Schedule RSS sync
        interval_minutes: int = self._config.get("rss_interval_minutes", 60)
        self._scheduler.add_job(
            self._rss_job,
            "interval",
            minutes=interval_minutes,
            id="rss_sync",
        )
        self._scheduler.start()
        logger.info(
            "Scheduler started — RSS polling every %d min", interval_minutes
        )

        # Keep the main thread alive
        try:
            while True:
                time.sleep(60)
        except (KeyboardInterrupt, SystemExit):
            logger.info("Shutting down scheduler…")
            self._scheduler.shutdown()

    def _rss_job(self) -> None:
        try:
            run_rss_sync(
                self._config, self._scraper, self._publisher, self._commenter
            )
        except Exception as exc:
            logger.error("Unhandled error in RSS job: %s", exc, exc_info=True)
