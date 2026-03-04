#!/bin/bash
# Lance le déploiement du bot sur le VPS depuis ta machine locale.
# Usage: depuis Flegm/flegm-bot : ./deploy/launch-vps.sh
#        ou depuis Flegm :       ./flegm-bot/deploy/launch-vps.sh

set -e
VPS="${VPS:-root@217.196.49.11}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REMOTE_DIR="/opt/flegm-bot"

echo "==> Envoi du code vers $VPS:$REMOTE_DIR ..."
ssh "$VPS" "mkdir -p $REMOTE_DIR && chown root:root $REMOTE_DIR"
rsync -az --delete \
  --exclude '.git' \
  --exclude 'venv' \
  --exclude '__pycache__' \
  --exclude '*.pyc' \
  --exclude 'bot_state.db' \
  "$BOT_DIR/" "$VPS:$REMOTE_DIR/"

if [ -f "$BOT_DIR/.env" ]; then
  echo "==> Envoi du .env ..."
  scp "$BOT_DIR/.env" "$VPS:$REMOTE_DIR/.env"
else
  echo "!! Pas de .env trouvé dans $BOT_DIR — le bot ne démarrera pas tant que .env n'est pas sur le VPS."
fi

echo "==> Sur le VPS : création utilisateur, venv, systemd, démarrage..."
ssh "$VPS" "bash -s" -- "$REMOTE_DIR" << 'REMOTE'
set -e
BOT_DIR="$1"
id flegm 2>/dev/null || useradd -r -s /bin/bash -d "$BOT_DIR" flegm
chown -R flegm:flegm "$BOT_DIR"
apt-get update -qq
apt-get install -y -qq python3 python3-venv python3-pip
sudo -u flegm python3 -m venv "$BOT_DIR/venv"
sudo -u flegm "$BOT_DIR/venv/bin/pip" install -q -r "$BOT_DIR/requirements.txt"
cp "$BOT_DIR/deploy/flegm-bot.service" /etc/systemd/system/
systemctl daemon-reload
systemctl enable flegm-bot.service
systemctl restart flegm-bot.service
echo "==> Bot démarré. Statut :"
systemctl status flegm-bot.service --no-pager
REMOTE

echo ""
echo "Déploiement terminé. Logs en direct : ssh $VPS 'journalctl -u flegm-bot -f'"
