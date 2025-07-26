#!/bin/bash

# === CONFIGURATION ===
REPO_DIR="$HOME/Téléchargements/backend-projetSoutenance-main"  # Dossier du dépôt local Git
UPLOADS_DIR="$REPO_DIR/uploads/videos"                          # Emplacement réel des vidéos
BRANCH="main"

# Aller dans le repo
cd "$REPO_DIR" || exit

# Créer le dossier target videos/ s’il n’existe pas
mkdir -p videos

# Copier les fichiers vidéo dans le dépôt Git
cp "$UPLOADS_DIR"/*.mp4 "$REPO_DIR/videos/" 2>/dev/null

# Vérifier s’il y a des modifications
if [ -n "$(git status --porcelain)" ]; then
    git pull origin $BRANCH
    git add videos/
    git commit -m "🚀 Ajout automatique de vidéos depuis uploads/videos/"
    git push origin $BRANCH
    echo "✅ Vidéos poussées sur GitHub."
else
    echo "ℹ️ Aucune nouvelle vidéo à pousser."
fi
