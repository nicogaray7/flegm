"""SQLite persistence for deduplication and status tracking."""

import sqlite3
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

DB_PATH = Path("data/flegm_bot.db")


def _get_conn() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create tables if they don't exist."""
    with _get_conn() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS videos (
                video_id        TEXT PRIMARY KEY,
                channel_id      TEXT NOT NULL,
                status          TEXT NOT NULL DEFAULT 'pending',
                flegm_post_id   TEXT,
                error_message   TEXT,
                created_at      TEXT NOT NULL,
                posted_at       TEXT,
                commented_at    TEXT
            );

            CREATE TABLE IF NOT EXISTS channels (
                channel_id          TEXT PRIMARY KEY,
                last_rss_check      TEXT,
                initialized         INTEGER DEFAULT 0
            );
        """)
    logger.info("Database initialized at %s", DB_PATH)


def is_already_posted(video_id: str) -> bool:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT status FROM videos WHERE video_id = ?", (video_id,)
        ).fetchone()
    return row is not None and row["status"] in ("posted", "commented")


def mark_as_posted(video_id: str, flegm_post_id: str, channel_id: str = "") -> None:
    now = datetime.utcnow().isoformat()
    with _get_conn() as conn:
        conn.execute(
            """
            INSERT INTO videos (video_id, channel_id, status, flegm_post_id, created_at, posted_at)
            VALUES (?, ?, 'posted', ?, ?, ?)
            ON CONFLICT(video_id) DO UPDATE SET
                status = 'posted',
                flegm_post_id = excluded.flegm_post_id,
                posted_at = excluded.posted_at
            """,
            (video_id, channel_id, flegm_post_id, now, now),
        )
    logger.debug("Marked %s as posted (flegm_post_id=%s)", video_id, flegm_post_id)


def mark_as_commented(video_id: str) -> None:
    now = datetime.utcnow().isoformat()
    with _get_conn() as conn:
        conn.execute(
            "UPDATE videos SET status = 'commented', commented_at = ? WHERE video_id = ?",
            (now, video_id),
        )
    logger.debug("Marked %s as commented", video_id)


def mark_as_failed(video_id: str, error: str) -> None:
    now = datetime.utcnow().isoformat()
    with _get_conn() as conn:
        conn.execute(
            """
            INSERT INTO videos (video_id, channel_id, status, error_message, created_at)
            VALUES (?, '', 'failed', ?, ?)
            ON CONFLICT(video_id) DO UPDATE SET
                status = 'failed',
                error_message = excluded.error_message
            """,
            (video_id, error, now),
        )
    logger.warning("Marked %s as failed: %s", video_id, error)


def get_posted_without_comment() -> list[str]:
    with _get_conn() as conn:
        rows = conn.execute(
            "SELECT video_id FROM videos WHERE status = 'posted'"
        ).fetchall()
    return [row["video_id"] for row in rows]


def is_channel_initialized(channel_id: str) -> bool:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT initialized FROM channels WHERE channel_id = ?", (channel_id,)
        ).fetchone()
    return row is not None and bool(row["initialized"])


def mark_channel_initialized(channel_id: str) -> None:
    with _get_conn() as conn:
        conn.execute(
            """
            INSERT INTO channels (channel_id, initialized)
            VALUES (?, 1)
            ON CONFLICT(channel_id) DO UPDATE SET initialized = 1
            """,
            (channel_id,),
        )
    logger.info("Channel %s marked as initialized", channel_id)


def update_last_rss_check(channel_id: str, dt: datetime) -> None:
    iso = dt.isoformat()
    with _get_conn() as conn:
        conn.execute(
            """
            INSERT INTO channels (channel_id, last_rss_check)
            VALUES (?, ?)
            ON CONFLICT(channel_id) DO UPDATE SET last_rss_check = excluded.last_rss_check
            """,
            (channel_id, iso),
        )
    logger.debug("Updated last RSS check for %s: %s", channel_id, iso)


def get_last_rss_check(channel_id: str) -> datetime | None:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT last_rss_check FROM channels WHERE channel_id = ?", (channel_id,)
        ).fetchone()
    if row and row["last_rss_check"]:
        return datetime.fromisoformat(row["last_rss_check"])
    return None


def get_stats() -> dict:
    with _get_conn() as conn:
        total = conn.execute("SELECT COUNT(*) FROM videos").fetchone()[0]
        by_status = conn.execute(
            "SELECT status, COUNT(*) as cnt FROM videos GROUP BY status"
        ).fetchall()
        channels = conn.execute("SELECT COUNT(*) FROM channels WHERE initialized = 1").fetchone()[0]
    return {
        "total_videos": total,
        "by_status": {row["status"]: row["cnt"] for row in by_status},
        "initialized_channels": channels,
    }
