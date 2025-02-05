#!/bin/bash

# Charger les variables d'environnement
if [ -f .env.local ]; then
  export $(cat .env.local | xargs)
fi

# Vérifier les variables requises
if [ -z "$RENDER_API_KEY" ] || [ -z "$RENDER_SERVICE_ID" ]; then
  echo "Erreur: RENDER_API_KEY et RENDER_SERVICE_ID sont requis"
  exit 1
fi

# Fonction pour déclencher un déploiement
deploy() {
  curl -X POST \
    "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
    -H "accept: application/json" \
    -H "authorization: Bearer $RENDER_API_KEY"
}

# Fonction pour vérifier le statut du service
status() {
  curl -X GET \
    "https://api.render.com/v1/services/$RENDER_SERVICE_ID" \
    -H "accept: application/json" \
    -H "authorization: Bearer $RENDER_API_KEY"
}

# Traiter les commandes
case "$1" in
  "deploy")
    deploy
    ;;
  "status")
    status
    ;;
  *)
    echo "Usage: $0 {deploy|status}"
    exit 1
    ;;
esac 