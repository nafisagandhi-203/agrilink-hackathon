#!/usr/bin/env bash
# AgriLink one-command dev launcher.
# Starts: Backend (:5018 via launchSettings), AI FastAPI (:8000), Frontend vite (:5173).
# Ctrl+C stops all three.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

for port in 5018 8000 5173; do
  if ss -ltn 2>/dev/null | grep -q ":$port "; then
    echo "Warning: port $port is already in use — stopping the launcher instance may conflict."
  fi
done

cleanup() {
  echo
  echo "Stopping AgriLink services..."
  jobs -pr | xargs -r kill
  wait 2>/dev/null || true
}
trap cleanup INT TERM

echo "==> Starting Backend (http://localhost:5018)"
dotnet run --project Backend &

echo "==> Starting FastAPI AI engine (http://localhost:8000)"
./AI/.venv/bin/python -m uvicorn AI.api.main:app --host 0.0.0.0 --port 8000 &

echo "==> Starting Frontend (http://localhost:5173)"
(cd Frontend && npm run dev) &

echo "All services launching. Press Ctrl+C to stop."
wait