"""LLM comment generation and posting on Flegm.fr via Supabase.

Comments are inserted directly into the Supabase `comments` table,
replicating the logic from `web/actions/comments.ts`.

Database schema (from web/db/schema.ts):
  comments(id uuid, video_id uuid, user_id uuid, parent_id uuid|null,
           content text, status varchar, risk_score int, created_at timestamptz)
"""

import logging
import uuid

from bot.scraper import Video

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = (
    "Tu es Flegm Team, le compte curateur officiel de flegm.fr, "
    "une plateforme de partage de vidéos YouTube. Tu rédiges des commentaires "
    "courts (1 à 3 phrases) pour accompagner les vidéos référencées. "
    "Ton ton est enthousiaste, naturel et authentique. "
    "Tu évites les formules génériques comme \"super vidéo\" ou \"incroyable contenu\". "
    "Tu écris en français sauf si la vidéo est clairement dans une autre langue."
)

USER_TEMPLATE = (
    'Vidéo : "{title}"\n'
    'Description : "{description}"\n\n'
    "Rédige un commentaire court qui résume l'intérêt de cette vidéo "
    "ou pose une question ouverte en lien avec le sujet."
)


class CommentError(Exception):
    pass


class FlegmCommenter:
    def __init__(
        self,
        supabase_client,  # supabase.Client
        user_id: str,
        llm_provider: str,
        llm_api_key: str,
        llm_model: str,
    ):
        self._supabase = supabase_client
        self._user_id = user_id
        self._provider = llm_provider.lower()
        self._api_key = llm_api_key
        self._model = llm_model
        self._anthropic_client = None
        self._openai_client = None

    # ------------------------------------------------------------------
    # LLM generation
    # ------------------------------------------------------------------

    def generate_comment(self, video: Video) -> str:
        """Call the configured LLM and return a short comment text.

        If no LLM provider or API key is configured (e.g. provider='none'),
        returns an empty string so the bot can run without a paid LLM.
        """
        if not self._api_key or self._provider in ("none", "disabled"):
            logger.info(
                "LLM disabled (provider=%s) — skipping comment generation for %s",
                self._provider,
                video.video_id,
            )
            return ""
        user_content = USER_TEMPLATE.format(
            title=video.title,
            description=video.description[:500],
        )
        for attempt in range(3):
            try:
                if self._provider == "anthropic":
                    return self._call_anthropic(user_content)
                elif self._provider == "openai":
                    return self._call_openai(user_content)
                else:
                    raise CommentError(f"Unknown LLM provider: {self._provider}")
            except CommentError:
                raise
            except Exception as exc:
                logger.warning(
                    "LLM attempt %d/3 failed for %s: %s",
                    attempt + 1,
                    video.video_id,
                    exc,
                )
        logger.warning(
            "All LLM attempts failed for %s — using empty comment", video.video_id
        )
        return ""

    def _call_anthropic(self, user_content: str) -> str:
        import anthropic

        if self._anthropic_client is None:
            self._anthropic_client = anthropic.Anthropic(api_key=self._api_key)
        message = self._anthropic_client.messages.create(
            model=self._model,
            max_tokens=150,
            temperature=0.8,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_content}],
        )
        return message.content[0].text.strip()

    def _call_openai(self, user_content: str) -> str:
        import openai

        if self._openai_client is None:
            self._openai_client = openai.OpenAI(api_key=self._api_key)
        response = self._openai_client.chat.completions.create(
            model=self._model,
            max_tokens=150,
            temperature=0.8,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_content},
            ],
        )
        return response.choices[0].message.content.strip()

    # ------------------------------------------------------------------
    # Posting
    # ------------------------------------------------------------------

    def post_comment(self, flegm_post_id: str, comment_text: str) -> None:
        """Insert a comment row in the Supabase `comments` table.

        Args:
            flegm_post_id: The UUID of the video row in the `videos` table.
            comment_text:  The comment body (may be empty string on LLM failure).
        """
        if not comment_text:
            logger.warning(
                "Skipping empty comment for flegm_post_id=%s", flegm_post_id
            )
            return

        comment_id = str(uuid.uuid4())
        payload = {
            "id": comment_id,
            "video_id": flegm_post_id,
            "user_id": self._user_id,
            "parent_id": None,
            "content": comment_text[:2000],
            "status": "approved",
            "risk_score": 0,
        }
        try:
            self._supabase.table("comments").insert(payload).execute()
            logger.info(
                "Posted comment comment_id=%s on flegm_post_id=%s",
                comment_id,
                flegm_post_id,
            )
        except Exception as exc:
            raise CommentError(
                f"Failed to post comment on flegm_post_id={flegm_post_id}: {exc}"
            ) from exc
