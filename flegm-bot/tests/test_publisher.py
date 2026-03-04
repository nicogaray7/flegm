"""Tests for bot/publisher.py."""

import unittest
from datetime import datetime, timezone
from unittest.mock import MagicMock, patch, call

from bot.publisher import FlegmPublisher, PublishError
from bot.scraper import Video

try:
    import supabase as _sb  # noqa: F401
    HAS_SUPABASE = True
except BaseException:
    HAS_SUPABASE = False


def _make_video(vid_id="dQw4w9WgXcQ"):
    return Video(
        video_id=vid_id,
        youtube_url=f"https://www.youtube.com/watch?v={vid_id}",
        title="Never Gonna Give You Up",
        description="Official music video",
        thumbnail_url="https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        channel_name="Rick Astley",
        channel_id="UCuAXFkgsw1L7xaCfnd5JJOw",
        published_at=datetime(1987, 11, 16, tzinfo=timezone.utc),
        view_count=1_400_000_000,
        duration=213,
        tags=["rick roll", "80s"],
    )


class TestFlegmPublisher(unittest.TestCase):
    def _make_publisher(self):
        pub = FlegmPublisher(
            supabase_url="https://test.supabase.co",
            supabase_anon_key="anon-key",
            email="bot@flegm.fr",
            password="secret",
            publish_delay_seconds=0,
        )
        # Mock the supabase client
        mock_client = MagicMock()
        mock_user = MagicMock()
        mock_user.id = "user-uuid-123"
        mock_user.user_metadata = {"full_name": "Flegm Bot", "avatar_url": ""}
        mock_auth_response = MagicMock()
        mock_auth_response.user = mock_user
        mock_client.auth.sign_in_with_password.return_value = mock_auth_response
        mock_client.table.return_value.upsert.return_value.execute.return_value = MagicMock()
        pub._client = mock_client
        pub._user_id = "user-uuid-123"
        return pub, mock_client

    def test_post_video_returns_uuid(self):
        pub, mock_client = self._make_publisher()
        mock_insert_response = MagicMock()
        mock_insert_response.data = [{"id": "some-uuid"}]
        mock_client.table.return_value.insert.return_value.execute.return_value = mock_insert_response

        video = _make_video()
        result = pub.post_video(video)

        self.assertIsNotNone(result)
        self.assertIsInstance(result, str)
        # Should have called insert on the videos table
        mock_client.table.assert_any_call("videos")

    def test_post_video_raises_on_empty_response(self):
        pub, mock_client = self._make_publisher()
        mock_insert_response = MagicMock()
        mock_insert_response.data = []
        mock_client.table.return_value.insert.return_value.execute.return_value = mock_insert_response

        video = _make_video()
        with self.assertRaises(PublishError):
            pub.post_video(video)

    def test_post_video_payload_fields(self):
        pub, mock_client = self._make_publisher()
        mock_insert_response = MagicMock()
        mock_insert_response.data = [{"id": "uuid-x"}]
        mock_client.table.return_value.insert.return_value.execute.return_value = mock_insert_response

        video = _make_video("testVidId1")
        pub.post_video(video)

        insert_call = mock_client.table.return_value.insert.call_args
        payload = insert_call[0][0]
        self.assertEqual(payload["youtube_id"], "testVidId1")
        self.assertEqual(payload["title"], "Never Gonna Give You Up")
        self.assertEqual(payload["channel_name"], "Rick Astley")
        self.assertEqual(payload["duration"], 213)
        self.assertEqual(payload["upvotes_count"], 0)
        self.assertEqual(payload["clippeur_id"], "user-uuid-123")

    @unittest.skipUnless(HAS_SUPABASE, "supabase not available in this environment")
    def test_authenticate_sets_user_id(self):
        pub = FlegmPublisher(
            supabase_url="https://test.supabase.co",
            supabase_anon_key="anon-key",
            email="bot@flegm.fr",
            password="secret",
        )
        mock_client = MagicMock()
        mock_user = MagicMock()
        mock_user.id = "new-user-uuid"
        mock_user.user_metadata = {}
        mock_auth = MagicMock()
        mock_auth.user = mock_user
        mock_client.auth.sign_in_with_password.return_value = mock_auth
        mock_client.table.return_value.upsert.return_value.execute.return_value = MagicMock()

        with patch("supabase.create_client", return_value=mock_client):
            pub.authenticate()

        self.assertEqual(pub._user_id, "new-user-uuid")

    @unittest.skipUnless(HAS_SUPABASE, "supabase not available in this environment")
    def test_authenticate_raises_on_no_user(self):
        pub = FlegmPublisher(
            supabase_url="https://test.supabase.co",
            supabase_anon_key="anon-key",
            email="bad@flegm.fr",
            password="wrong",
        )
        mock_client = MagicMock()
        mock_auth = MagicMock()
        mock_auth.user = None
        mock_client.auth.sign_in_with_password.return_value = mock_auth

        with patch("supabase.create_client", return_value=mock_client):
            with self.assertRaises(PublishError):
                pub.authenticate()


if __name__ == "__main__":
    unittest.main()
