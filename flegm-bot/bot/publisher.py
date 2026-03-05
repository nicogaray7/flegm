"""Authentication and video publication on Flegm.fr via Supabase.

Architecture note:
  Flegm.fr is a Next.js / Supabase application. There are no traditional REST
  API endpoints — mutations are implemented as Next.js Server Actions that
  call Drizzle ORM directly on the PostgreSQL / Supabase backend.

  The bot therefore authenticates through the Supabase Auth API
  (email + password) and writes records directly via the Supabase PostgREST
  REST API, replicating the exact insert logic of `web/actions/submit.ts`.

Database schema (from web/db/schema.ts):
  videos(id uuid, youtube_id varchar, title text, channel_name text,
         channel_id text, channel_thumbnail text, duration int,
         upvotes_count int, clippeur_id uuid, created_at timestamptz)
  profiles(id uuid, username text, avatar_url text)
"""

import logging
import random
import time
import uuid
from datetime import timezone
from typing import Optional  # used for Optional[str]

from bot.scraper import Video

logger = logging.getLogger(__name__)


class PublishError(Exception):
    pass


class FlegmPublisher:
    def __init__(
        self,
        supabase_url: str,
        supabase_anon_key: str,
        email: str | None = None,
        password: str | None = None,
        user_id: str | None = None,
        publish_delay_seconds: int = 3,
    ):
        self._supabase_url = supabase_url
        self._supabase_anon_key = supabase_anon_key
        self._email = (email or "").strip()
        self._password = (password or "").strip()
        self._publish_delay_seconds = publish_delay_seconds
        self._client = None  # supabase.Client, lazy import
        self._user_id: Optional[str] = (user_id or None)

    # ------------------------------------------------------------------
    # Authentication
    # ------------------------------------------------------------------

    def authenticate(self) -> None:
        """Initialise Supabase client and set user_id.

        Deux modes :
        - email+password configurés → login via Supabase Auth, user_id depuis le user.
        - sinon → utilisation directe de la clé (service/anon) + user_id fourni.
        """
        from supabase import create_client  # lazy import

        logger.info(
            "Initialising Supabase client (email auth=%s)",
            bool(self._email and self._password),
        )
        # Python Supabase client gère déjà correctement les tokens côté serveur ;
        # on utilise la configuration par défaut.
        self._client = create_client(self._supabase_url, self._supabase_anon_key)
        # Mode Auth email+password
        if self._email and self._password:
            response = self._client.auth.sign_in_with_password(
                {"email": self._email, "password": self._password}
            )
            if not response.user:
                raise PublishError("Authentication failed — no user returned from Supabase")
            self._user_id = response.user.id
            logger.info("Authenticated as user_id=%s", self._user_id)
            self._ensure_profile(response.user)
        else:
            # Mode service key + user_id fourni
            if not self._user_id:
                raise PublishError(
                    "FLEGM_BOT_USER_ID is required when not using email/password auth"
                )
            logger.info("Using configured user_id=%s (service key mode)", self._user_id)
            self._ensure_profile_for_user_id()

    def _ensure_auth(self):
        """Return authenticated client, re-authenticating if needed."""
        if self._client is None or self._user_id is None:
            self.authenticate()
        return self._client  # type: ignore[return-value]

    def _ensure_profile(self, user) -> None:
        """Create or update the bot's profile row."""
        client = self._client
        username = (
            user.user_metadata.get("full_name")
            or user.user_metadata.get("name")
            or self._email.split("@")[0]
        )
        avatar_url = user.user_metadata.get("avatar_url", "")
        client.table("profiles").upsert(  # type: ignore[union-attr]
            {
                "id": self._user_id,
                "username": username,
                "avatar_url": avatar_url,
            }
        ).execute()
        logger.debug("Profile upserted for user_id=%s", self._user_id)

    def _ensure_profile_for_user_id(self) -> None:
        """Create a minimal profile row when running with a fixed user_id."""
        if not self._user_id:
            return
        client = self._client
        username = "flegm-bot"
        avatar_url = ""
        client.table("profiles").upsert(  # type: ignore[union-attr]
            {
                "id": self._user_id,
                "username": username,
                "avatar_url": avatar_url,
            }
        ).execute()
        logger.debug("Profile upserted (service mode) for user_id=%s", self._user_id)

    # ------------------------------------------------------------------
    # Video publication
    # ------------------------------------------------------------------

    def post_video(self, video: Video) -> str:
        """Insert a video row in the Supabase `videos` table.

        Returns the newly created row's UUID (flegm_post_id).
        Raises PublishError on failure.
        """
        client = self._ensure_auth()
        flegm_post_id = str(uuid.uuid4())

        dt = video.published_at
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        published_at_iso = dt.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
        # Bot-simulated upvotes (stored in bot_upvotes_count; real upvotes stay in upvotes table)
        initial_bot_upvotes = random.randint(2, 8)
        payload = {
            "id": flegm_post_id,
            "youtube_id": video.video_id,
            "title": video.title,
            "channel_name": video.channel_name,
            "channel_id": video.channel_id,
            "channel_thumbnail": video.thumbnail_url,
            "duration": video.duration,
            "upvotes_count": 0,
            "bot_upvotes_count": initial_bot_upvotes,
            "clippeur_id": self._user_id,
            "youtube_published_at": published_at_iso,
            "shuffle_key": random.random(),
        }

        self._insert_with_retry(client, "videos", payload, video.video_id)
        logger.info(
            "Posted video youtube_id=%s → flegm_post_id=%s",
            video.video_id,
            flegm_post_id,
        )
        time.sleep(self._publish_delay_seconds)
        return flegm_post_id

    def get_flegm_post_id(self, youtube_id: str) -> Optional[str]:
        """Lookup an existing video's UUID by youtube_id (for dedup recovery)."""
        client = self._ensure_auth()
        result = (
            client.table("videos")
            .select("id")
            .eq("youtube_id", youtube_id)
            .maybe_single()
            .execute()
        )
        if result.data:
            return result.data["id"]
        return None

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _insert_with_retry(self, client, table: str, payload: dict, ref: str) -> None:
        """Insert a row with exponential-backoff retries on network errors."""
        delays = [1, 2, 4]
        last_exc: Exception = Exception("unknown")

        for attempt, delay in enumerate([0] + delays, start=1):
            if delay:
                time.sleep(delay)
            try:
                response = client.table(table).insert(payload).execute()
                if response.data:
                    return
                # PostgREST returns empty data on RLS violation or duplicate
                raise PublishError(
                    f"Insert into {table} returned no data for {ref} — "
                    "check RLS policies or duplicate key"
                )
            except PublishError:
                raise
            except Exception as exc:
                last_exc = exc
                logger.warning(
                    "Attempt %d/%d failed for %s (%s): %s",
                    attempt,
                    len(delays) + 1,
                    ref,
                    table,
                    exc,
                )
                # Re-authenticate on auth errors
                if "401" in str(exc) or "403" in str(exc) or "JWT" in str(exc):
                    logger.info("Session expired, re-authenticating…")
                    self.authenticate()
                    client = self._client  # type: ignore[assignment]

        raise PublishError(
            f"All {len(delays)+1} attempts failed for {ref}: {last_exc}"
        )
