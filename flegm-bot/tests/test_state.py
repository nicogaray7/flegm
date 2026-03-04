"""Tests for bot/state.py (SQLite persistence)."""

import os
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch


class TestState(unittest.TestCase):
    def setUp(self):
        # Use a temporary file so tests are isolated
        self._tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
        self._tmp.close()
        # Patch DB_PATH before importing state functions
        import bot.state as state_module
        state_module.DB_PATH = Path(self._tmp.name)
        state_module.init_db()
        self.state = state_module

    def tearDown(self):
        os.unlink(self._tmp.name)

    def test_is_already_posted_false_for_unknown(self):
        self.assertFalse(self.state.is_already_posted("unknown_id"))

    def test_mark_as_posted_and_check(self):
        self.state.mark_as_posted("vid1", "flegm-uuid-1", "chan1")
        self.assertTrue(self.state.is_already_posted("vid1"))

    def test_mark_as_commented(self):
        self.state.mark_as_posted("vid2", "flegm-uuid-2", "chan1")
        self.state.mark_as_commented("vid2")
        # Should still be considered "already posted"
        self.assertTrue(self.state.is_already_posted("vid2"))

    def test_mark_as_failed(self):
        self.state.mark_as_failed("vid3", "network error")
        # Failed videos should NOT be considered already posted
        self.assertFalse(self.state.is_already_posted("vid3"))

    def test_get_posted_without_comment(self):
        self.state.mark_as_posted("vid4", "flegm-uuid-4", "chan1")
        pending = self.state.get_posted_without_comment()
        self.assertIn("vid4", pending)

        self.state.mark_as_commented("vid4")
        pending = self.state.get_posted_without_comment()
        self.assertNotIn("vid4", pending)

    def test_channel_initialized(self):
        self.assertFalse(self.state.is_channel_initialized("chan1"))
        self.state.mark_channel_initialized("chan1")
        self.assertTrue(self.state.is_channel_initialized("chan1"))

    def test_rss_check_timestamps(self):
        self.assertIsNone(self.state.get_last_rss_check("chan2"))
        dt = datetime(2024, 6, 1, 12, 0, 0, tzinfo=timezone.utc)
        self.state.update_last_rss_check("chan2", dt)
        result = self.state.get_last_rss_check("chan2")
        self.assertIsNotNone(result)
        self.assertEqual(result.year, 2024)
        self.assertEqual(result.month, 6)

    def test_get_stats(self):
        self.state.mark_as_posted("vid5", "flegm-uuid-5", "chan1")
        self.state.mark_channel_initialized("chan1")
        stats = self.state.get_stats()
        self.assertGreaterEqual(stats["total_videos"], 1)
        self.assertGreaterEqual(stats["initialized_channels"], 1)
        self.assertIn("posted", stats["by_status"])

    def test_idempotent_mark_posted(self):
        self.state.mark_as_posted("vid6", "flegm-uuid-6", "chan1")
        # Calling again should not raise
        self.state.mark_as_posted("vid6", "flegm-uuid-6b", "chan1")
        self.assertTrue(self.state.is_already_posted("vid6"))


if __name__ == "__main__":
    unittest.main()
