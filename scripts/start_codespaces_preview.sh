#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Start the lightweight content API used only by the visual preview.
python3 scripts/preview_api.py >/tmp/wedding-preview-api.log 2>&1 &
API_PID=$!

cleanup() {
  kill "$API_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

cd frontend

# Codespaces can occasionally finish creating before devDependencies are fully
# installed. Make the preview launcher repair that state instead of failing with
# "craco: not found".
if [ ! -x node_modules/.bin/craco ]; then
  echo "Frontend dependencies are missing. Installing them now..."
  corepack enable
  yarn install --production=false --non-interactive
fi

export HOST=0.0.0.0
export BROWSER=none
export WDS_SOCKET_PORT=0
export CI=false

# REACT_APP_BACKEND_URL is intentionally unset here. api.js falls back to
# same-origin /api, which the CRA dev server proxies to 127.0.0.1:8001.
unset REACT_APP_BACKEND_URL || true

echo "Starting Sophie + Ken visual preview on port 3000..."
yarn start
