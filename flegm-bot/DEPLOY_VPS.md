# Déploiement du bot Flegm sur un VPS

Ce guide permet d’héberger le bot sur un serveur (ex. `root@217.196.49.11`) avec systemd.

## Mise à jour rapide (déjà installé)

Depuis la machine locale (avec accès SSH au VPS) :

```bash
./flegm-bot/deploy/update-vps.sh
```

Envoie le code par rsync, réinstalle les deps Python et redémarre `flegm-bot.service`. Pour un déploiement complet (première install ou réinstall), utiliser `./flegm-bot/deploy/launch-vps.sh`.

## Prérequis

- Accès SSH au VPS (Debian ou Ubuntu)
- Clé API YouTube, URL et clé Supabase, `FLEGM_BOT_USER_ID` (voir `.env.example`)

## Option A : Installation manuelle

### 1. Connexion au VPS

```bash
ssh root@217.196.49.11
```

### 2. Créer l’utilisateur et le répertoire

```bash
useradd -r -s /bin/bash -d /opt/flegm-bot -m flegm
```

### 3. Installer Python et Git

```bash
apt-get update && apt-get install -y python3 python3-venv python3-pip git
```

### 4. Cloner le dépôt (ou copier le dossier `flegm-bot`)

**Si le code est sur GitHub :**

```bash
sudo -u flegm git clone --depth 1 https://github.com/VOTRE_ORG/Flegm.git /tmp/Flegm
sudo -u flegm cp -a /tmp/Flegm/flegm-bot /opt/flegm-bot
rm -rf /tmp/Flegm
```

**Si vous uploadez le code à la main (scp/rsync) :**

```bash
# Depuis votre machine locale (dossier Flegm à la racine)
scp -r Flegm/flegm-bot root@217.196.49.11:/opt/flegm-bot
ssh root@217.196.49.11 "chown -R flegm:flegm /opt/flegm-bot"
```

### 5. Environnement virtuel et dépendances

```bash
sudo -u flegm python3 -m venv /opt/flegm-bot/venv
sudo -u flegm /opt/flegm-bot/venv/bin/pip install -r /opt/flegm-bot/requirements.txt
```

### 6. Fichier `.env`

Créer `/opt/flegm-bot/.env` avec au minimum :

- `YOUTUBE_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `FLEGM_BOT_USER_ID`
- `LLM_PROVIDER=none` (ou configurer un LLM si besoin)

Puis :

```bash
chown flegm:flegm /opt/flegm-bot/.env
chmod 600 /opt/flegm-bot/.env
```

### 7. Service systemd

```bash
cp /opt/flegm-bot/deploy/flegm-bot.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable flegm-bot
systemctl start flegm-bot
```

### 8. Vérification

```bash
systemctl status flegm-bot
journalctl -u flegm-bot -f
```

## Option B : Script d’installation

1. Sur le VPS, cloner ou copier le repo pour avoir `flegm-bot/deploy/install-vps.sh`.
2. Éditer le script si besoin (utilisateur, chemin, URL du repo).
3. Exécuter en root :

```bash
chmod +x /opt/flegm-bot/deploy/install-vps.sh
/opt/flegm-bot/deploy/install-vps.sh
```

4. Compléter `/opt/flegm-bot/.env` puis :

```bash
systemctl start flegm-bot
```

## Commandes utiles

| Action              | Commande                          |
|---------------------|-----------------------------------|
| Démarrer            | `systemctl start flegm-bot`      |
| Arrêter             | `systemctl stop flegm-bot`       |
| Redémarrer         | `systemctl restart flegm-bot`   |
| Statut             | `systemctl status flegm-bot`    |
| Logs en direct     | `journalctl -u flegm-bot -f`    |
| Sync manuel (CLI)  | `sudo -u flegm /opt/flegm-bot/venv/bin/python main.py sync` |

## Mise à jour du bot

```bash
cd /opt/flegm-bot
sudo -u flegm git pull --ff-only   # si installé via git
# ou recopier les fichiers modifiés par scp/rsync
sudo -u flegm /opt/flegm-bot/venv/bin/pip install -r requirements.txt
systemctl restart flegm-bot
```
