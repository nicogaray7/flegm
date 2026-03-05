#!/bin/bash
# Mise à jour rapide du bot sur le VPS (rsync + redémarrage). Pas d'install complète.
# Usage: ./flegm-bot/deploy/update-vps.sh
# Prérequis: accès SSH root@217.196.49.11 (clé ou agent).

set -e
VPS="${VPS:-root@217.196.49.11}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REMOTE_DIR="/opt/flegm-bot"

echo "==> Envoi du code vers $VPS:$REMOTE_DIR ..."
rsync -az --delete \
  --exclude '.git' \
  --exclude 'venv' \
  --exclude '__pycache__' \
  --exclude '*.pyc' \
  --exclude 'bot_state.db' \
  --exclude '.env' \
  "$BOT_DIR/" "$VPS:$REMOTE_DIR/"

echo "==> Sur le VPS : pip install, redémarrage..."
ssh "$VPS" "bash -s" -- "$REMOTE_DIR" << 'REMOTE'
set -e
BOT_DIR="$1"
chown -R flegm:flegm "$BOT_DIR"
sudo -u flegm "$BOT_DIR/venv/bin/pip" install -q -r "$BOT_DIR/requirements.txt"
systemctl restart flegm-bot.service
echo "==> Bot redémarré. Statut :"
systemctl status flegm-bot.service --no-pager
REMOTE

echo ""
echo "Mise à jour terminée. Logs : ssh $VPS 'journalctl -u flegm-bot -f'"
