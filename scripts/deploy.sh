#!/usr/bin/env bash
set -euo pipefail

APP_DIR=${APP_DIR:-/var/www/eventize}
BRANCH=${BRANCH:-main}

cd "$APP_DIR"
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"
npm install
npx prisma migrate deploy
npm run build
sudo systemctl restart eventize
