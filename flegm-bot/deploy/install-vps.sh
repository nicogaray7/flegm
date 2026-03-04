#!/bin/bash
# Install Flegm Bot on a VPS (Debian/Ubuntu). Run as root.
# Usage: ./install-vps.sh

set -e
BOT_USER="${BOT_USER:-flegm}"
BOT_DIR="${BOT_DIR:-/opt/flegm-bot}"
REPO_URL="${REPO_URL:-https://github.com/YOUR_ORG/Flegm.git}"

echo "==> Creating user $BOT_USER (if missing)..."
id "$BOT_USER" 2>/dev/null || useradd -r -s /bin/bash -d "$BOT_DIR" -m "$BOT_USER"

echo "==> Installing system dependencies..."
apt-get update -qq
apt-get install -y -qq python3 python3-venv python3-pip git

echo "==> Cloning or updating repo in $BOT_DIR..."
if [ -d "$BOT_DIR/.git" ]; then
  sudo -u "$BOT_USER" git -C "$BOT_DIR" pull --ff-only
else
  sudo -u "$BOT_USER" git clone --depth 1 "$REPO_URL" /tmp/flegm-repo
  sudo -u "$BOT_USER" cp -a /tmp/flegm-repo/flegm-bot "$BOT_DIR"
  rm -rf /tmp/flegm-repo
fi

echo "==> Creating Python venv and installing deps..."
sudo -u "$BOT_USER" python3 -m venv "$BOT_DIR/venv"
sudo -u "$BOT_USER" "$BOT_DIR/venv/bin/pip" install -q -r "$BOT_DIR/requirements.txt"

echo "==> Ensuring .env exists..."
if [ ! -f "$BOT_DIR/.env" ]; then
  echo "Copy .env to $BOT_DIR/.env and fill YOUTUBE_API_KEY, SUPABASE_*, FLEGM_BOT_USER_ID, etc."
  cp "$BOT_DIR/.env.example" "$BOT_DIR/.env" 2>/dev/null || true
  chown "$BOT_USER:$BOT_USER" "$BOT_DIR/.env"
fi

echo "==> Installing systemd service..."
cp "$BOT_DIR/deploy/flegm-bot.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable flegm-bot.service

echo "==> Done. Next steps:"
echo "  1. Edit $BOT_DIR/.env with your keys (YOUTUBE_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, FLEGM_BOT_USER_ID)."
echo "  2. Start: systemctl start flegm-bot"
echo "  3. Logs:  journalctl -u flegm-bot -f"
