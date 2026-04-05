#!/usr/bin/env bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PIDS=()

cleanup() {
  echo ""
  echo "Shutting down..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null
  echo "All servers stopped."
}

trap cleanup EXIT INT TERM

echo "============================================"
echo "  BOSE — Unified Application"
echo "============================================"
echo ""

# Start Go backend
echo "  [GO]   Backend → port 8080"
(cd "$ROOT_DIR/backend" && go run main.go) &
PIDS+=($!)

# Wait for backend to be ready
sleep 3

# Start Vite frontend
echo "  [VITE] Frontend → port 5173"
(cd "$ROOT_DIR/frontend" && npx vite --port 5173 --host) &
PIDS+=($!)

echo ""
echo "============================================"
echo "  Backend  → http://localhost:8080"
echo "  Frontend → http://localhost:5173"
echo ""
echo "  Press Ctrl+C to stop."
echo "============================================"

wait
