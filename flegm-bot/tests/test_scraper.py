"""Tests for bot/scraper.py."""

import unittest
from datetime import datetime, timezone
from unittest.mock import MagicMock, patch

from bot.scraper import Video, YouTubeScraper, _parse_iso8601_duration

try:
    import feedparser as _fp  # noqa: F401
    HAS_FEEDPARSER = True
except (ImportError, ModuleNotFoundError, Exception):
    HAS_FEEDPARSER = False


class TestParseDuration(unittest.TestCase):
    def test_full_duration(self):
        self.assertEqual(_parse_iso8601_duration("PT1H2M3S"), 3723)

    def test_minutes_seconds(self):
        self.assertEqual(_parse_iso8601_duration("PT3M45S"), 225)

    def test_seconds_only(self):
        self.assertEqual(_parse_iso8601_duration("PT30S"), 30)

    def test_hours_only(self):
        self.assertEqual(_parse_iso8601_duration("PT2H"), 7200)

    def test_empty_string(self):
        self.assertEqual(_parse_iso8601_duration(""), 0)

    def test_none_like(self):
        self.assertEqual(_parse_iso8601_duration(None), 0)  # type: ignore


class TestYouTubeScraper(unittest.TestCase):
    def _make_scraper(self):
        scraper = YouTubeScraper(api_key="fake_key")
        scraper._youtube = MagicMock()
        return scraper

    def _fake_item(self, vid_id="abc123", title="Test", view_count="1000", duration="PT3M"):
        return {
            "id": vid_id,
            "snippet": {
                "title": title,
                "description": "A test video",
                "channelTitle": "Test Channel",
                "channelId": "UCtest",
                "publishedAt": "2024-01-01T00:00:00Z",
                "thumbnails": {"high": {"url": "https://img.yt/thumb.jpg"}},
                "tags": ["python", "test"],
            },
            "statistics": {"viewCount": view_count, "likeCount": "100"},
            "contentDetails": {"duration": duration},
        }

    def test_get_popular_videos_returns_videos(self):
        scraper = self._make_scraper()
        search_mock = scraper._youtube.search.return_value.list.return_value.execute
        search_mock.return_value = {
            "items": [{"id": {"kind": "youtube#video", "videoId": "vid1"}}]
        }
        videos_mock = scraper._youtube.videos.return_value.list.return_value.execute
        videos_mock.return_value = {"items": [self._fake_item("vid1")]}

        results = scraper.get_popular_videos("UCtest", 1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].video_id, "vid1")
        self.assertEqual(results[0].title, "Test")
        self.assertEqual(results[0].view_count, 1000)
        self.assertEqual(results[0].like_count, 100)

    def test_get_recent_videos_returns_videos(self):
        scraper = self._make_scraper()
        search_mock = scraper._youtube.search.return_value.list.return_value.execute
        search_mock.return_value = {
            "items": [{"id": {"kind": "youtube#video", "videoId": "vid2"}}]
        }
        videos_mock = scraper._youtube.videos.return_value.list.return_value.execute
        videos_mock.return_value = {"items": [self._fake_item("vid2", "Recent", "500")]}

        results = scraper.get_recent_videos("UCtest", 1)
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].video_id, "vid2")

    def test_get_popular_videos_empty_on_api_error(self):
        from googleapiclient.errors import HttpError
        scraper = self._make_scraper()
        scraper._youtube.search.return_value.list.return_value.execute.side_effect = (
            HttpError(MagicMock(status=403), b"quota exceeded")
        )
        results = scraper.get_popular_videos("UCtest", 5)
        self.assertEqual(results, [])

    @unittest.skipUnless(HAS_FEEDPARSER, "feedparser not available in this environment")
    def test_rss_videos_filters_by_since(self):
        scraper = YouTubeScraper(api_key="fake")
        fake_feed = MagicMock()
        fake_feed.bozo = False
        fake_feed.feed.title = "Test Channel"

        old_entry = MagicMock()
        old_entry.published_parsed = (2024, 1, 1, 0, 0, 0, 0, 0, 0)
        old_entry.get.side_effect = lambda k, d=None: {
            "yt_videoid": "old_vid",
            "title": "Old video",
            "summary": "old",
            "media_thumbnail": [{"url": ""}],
        }.get(k, d)

        new_entry = MagicMock()
        new_entry.published_parsed = (2024, 6, 1, 12, 0, 0, 0, 0, 0)
        new_entry.get.side_effect = lambda k, d=None: {
            "yt_videoid": "new_vid",
            "title": "New video",
            "summary": "new",
            "media_thumbnail": [{"url": ""}],
        }.get(k, d)

        fake_feed.entries = [old_entry, new_entry]

        since = datetime(2024, 3, 1, tzinfo=timezone.utc)

        with patch("bot.scraper.feedparser.parse", return_value=fake_feed):
            results = scraper.get_rss_videos("UCtest", since)

        video_ids = [v.video_id for v in results]
        self.assertIn("new_vid", video_ids)
        self.assertNotIn("old_vid", video_ids)

    def test_duration_parsed_in_video(self):
        scraper = self._make_scraper()
        scraper._youtube.search.return_value.list.return_value.execute.return_value = {
            "items": [{"id": {"kind": "youtube#video", "videoId": "dur_vid"}}]
        }
        scraper._youtube.videos.return_value.list.return_value.execute.return_value = {
            "items": [self._fake_item("dur_vid", duration="PT10M30S")]
        }
        results = scraper.get_popular_videos("UCtest", 1)
        self.assertEqual(results[0].duration, 630)


if __name__ == "__main__":
    unittest.main()
