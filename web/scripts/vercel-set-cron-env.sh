#!/usr/bin/env bash
# Set FLEGM_BOT_USER_ID and CRON_SECRET on Vercel project via API.
# Requires: VERCEL_TOKEN or VERCEL_ACCESS_TOKEN in env.
# Usage: ./scripts/vercel-set-cron-env.sh [project_name_or_id]

set -e
TOKEN="${VERCEL_TOKEN:-$VERCEL_ACCESS_TOKEN}"
if [ -z "$TOKEN" ]; then
  echo "Set VERCEL_TOKEN or VERCEL_ACCESS_TOKEN" >&2
  exit 1
fi

FLEGM_BOT_USER_ID="${FLEGM_BOT_USER_ID:-8a6facfe-f26c-4c8f-99a5-1b6252dd9c83}"
# Generate a random CRON_SECRET if not set
CRON_SECRET="${CRON_SECRET:-$(openssl rand -base64 32)}"

PROJECT="${1:-flegm-platform}"
API="https://api.vercel.com"

echo "Using project: $PROJECT"
echo "FLEGM_BOT_USER_ID=$FLEGM_BOT_USER_ID"
echo "CRON_SECRET (new): ${CRON_SECRET:0:8}..."

# Create or update env vars (upsert=true)
for key in FLEGM_BOT_USER_ID CRON_SECRET; do
  if [ "$key" = "FLEGM_BOT_USER_ID" ]; then
    val="$FLEGM_BOT_USER_ID"
  else
    val="$CRON_SECRET"
  fi
  curl -s -X POST "$API/v10/projects/$PROJECT/env?upsert=true" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"$key\",\"value\":\"$val\",\"type\":\"encrypted\",\"target\":[\"production\",\"preview\"]}" \
    | head -c 200
  echo ""
done

echo "Done. Save this CRON_SECRET for external cron: $CRON_SECRET"
