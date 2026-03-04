"""Flegm Bot — CLI entrypoint.

Usage:
  python main.py run      Launch the continuous scheduler (daemon)
  python main.py sync     Trigger an immediate RSS sync for all channels
  python main.py init     Force re-initialisation of all channels
  python main.py status   Print statistics from the SQLite database
"""

import logging
import os
import re
import sys

import click
import yaml
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Logging configuration
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s — %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    stream=sys.stdout,
)
logger = logging.getLogger("flegm-bot")

# ---------------------------------------------------------------------------
# Config loading
# ---------------------------------------------------------------------------

_ENV_VAR_RE = re.compile(r"\$\{([^}]+)\}")


def _expand_env(value: str) -> str:
    """Replace ${VAR} placeholders with environment variable values."""
    return _ENV_VAR_RE.sub(lambda m: os.environ.get(m.group(1), ""), value)


def _expand_config(obj):
    if isinstance(obj, dict):
        return {k: _expand_config(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_expand_config(v) for v in obj]
    if isinstance(obj, str):
        return _expand_env(obj)
    return obj


def load_config(path: str = "config.yaml") -> dict:
    with open(path) as f:
        raw = yaml.safe_load(f)
    return _expand_config(raw)


# ---------------------------------------------------------------------------
# Dependency wiring
# ---------------------------------------------------------------------------

def _build_dependencies(config: dict):
    from bot import state
    from bot.commenter import FlegmCommenter
    from bot.publisher import FlegmPublisher
    from bot.scraper import YouTubeScraper

    state.init_db()

    scraper = YouTubeScraper(api_key=config["youtube_api_key"])

    publisher = FlegmPublisher(
        supabase_url=config["supabase_url"],
        supabase_anon_key=config["supabase_anon_key"],
        email=config.get("flegm_bot_email"),
        password=config.get("flegm_bot_password"),
        user_id=config.get("flegm_bot_user_id"),
        publish_delay_seconds=int(config.get("publish_delay_seconds", 3)),
    )
    publisher.authenticate()

    commenter = FlegmCommenter(
        supabase_client=publisher._client,
        user_id=publisher._user_id,
        llm_provider=config.get("llm_provider", "anthropic"),
        llm_api_key=config["llm_api_key"],
        llm_model=config.get("llm_model", "claude-3-haiku-20240307"),
    )

    return scraper, publisher, commenter


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

@click.group()
@click.option("--config", default="config.yaml", show_default=True, help="Path to config.yaml")
@click.pass_context
def cli(ctx, config):
    """Flegm Bot — automated YouTube content curator."""
    ctx.ensure_object(dict)
    ctx.obj["config_path"] = config


@cli.command()
@click.pass_context
def run(ctx):
    """Launch the continuous scheduler (RSS polling every N minutes)."""
    config = load_config(ctx.obj["config_path"])
    scraper, publisher, commenter = _build_dependencies(config)

    from bot.scheduler import BotScheduler
    sched = BotScheduler(config, scraper, publisher, commenter)
    logger.info("Starting Flegm Bot scheduler…")
    sched.start()  # blocks until Ctrl-C


@cli.command()
@click.pass_context
def sync(ctx):
    """Trigger an immediate RSS sync for all channels."""
    config = load_config(ctx.obj["config_path"])
    scraper, publisher, commenter = _build_dependencies(config)

    from bot.scheduler import run_rss_sync
    logger.info("Manual RSS sync triggered")
    run_rss_sync(config, scraper, publisher, commenter)
    logger.info("Manual RSS sync complete")


@cli.command()
@click.pass_context
def init(ctx):
    """Force initialisation of all channels (fetch popular + recent videos)."""
    config = load_config(ctx.obj["config_path"])
    scraper, publisher, commenter = _build_dependencies(config)

    # Reset initialized flags so all channels are re-processed
    from bot import state
    for channel in config.get("channels", []):
        channel_id = channel["channel_id"]
        with state._get_conn() as conn:
            conn.execute(
                "UPDATE channels SET initialized = 0 WHERE channel_id = ?",
                (channel_id,),
            )

    from bot.scheduler import run_initialization
    logger.info("Forced initialisation of all channels")
    run_initialization(config, scraper, publisher, commenter)
    logger.info("Initialisation complete")


@cli.command()
@click.pass_context
def status(ctx):
    """Display statistics from the SQLite database."""
    from bot import state
    state.init_db()
    stats = state.get_stats()

    click.echo("\n=== Flegm Bot Status ===")
    click.echo(f"  Total videos tracked : {stats['total_videos']}")
    for s, count in sorted(stats["by_status"].items()):
        click.echo(f"    {s:<12} : {count}")
    click.echo(f"  Channels initialized : {stats['initialized_channels']}")
    click.echo()


if __name__ == "__main__":
    cli()
