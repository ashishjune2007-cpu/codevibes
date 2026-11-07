#!/usr/bin/env bash
# Start backend + frontend together for local development.
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Starting Code Vibes (backend :8000 + frontend :5173)"
echo "    Demo admin : admin@thecodevibe.io / admin123"
echo "    Demo member: builder@thecodevibe.io / builder123"
echo ""

# Backend
(
  cd "$ROOT/backend"
  if command -v python3 >/dev/null 2>&1; then
    PY=python3
  else
    PY=python
  fi
  echo "[backend] $PY main.py"
  $PY main.py
) &
BACKEND_PID=$!

# Frontend
(
  cd "$ROOT/frontend"
  if [ ! -d node_modules ]; then
    echo "[frontend] npm install..."
    npm install
  fi
  echo "[frontend] npm run dev"
  npm run dev
) &
FRONTEND_PID=$!

trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true' EXIT INT TERM
wait
