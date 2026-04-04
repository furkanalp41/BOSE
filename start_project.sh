#!/usr/bin/env bash
# ============================================================
# BOSE Project — Full Ecosystem Bootstrapper
# Starts all available Go backends and Vite frontends
# Usage: ./start_project.sh
# Stop:  Ctrl+C (gracefully kills all child processes)
# ============================================================

set -e

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PIDS=()

cleanup() {
  echo ""
  echo "Shutting down all servers..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null
  echo "All servers stopped."
}

trap cleanup EXIT INT TERM

start_backend() {
  local name="$1"
  local dir="$2"
  local port="$3"

  if [ ! -f "$dir/main.go" ]; then
    echo "  [SKIP] $name backend — no main.go found"
    return
  fi

  echo "  [GO]   $name backend → port $port"
  (cd "$dir" && PORT="$port" go run main.go) &
  PIDS+=($!)
}

start_frontend() {
  local name="$1"
  local dir="$2"
  local port="$3"

  if [ ! -f "$dir/package.json" ]; then
    echo "  [SKIP] $name frontend — no package.json found"
    return
  fi

  echo "  [VITE] $name frontend → port $port"
  (cd "$dir" && npx vite --port "$port" --host) &
  PIDS+=($!)
}

echo "============================================"
echo "  BOSE — Full Ecosystem Bootstrapper"
echo "============================================"
echo ""

# ---- Backends ----
echo "Starting Go backends..."
start_backend "Furkan"  "$ROOT_DIR/Furkan-Alp-Gunay"         8080
start_backend "Cem"     "$ROOT_DIR/Cem-Karaca"               3000
start_backend "Arda"    "$ROOT_DIR/Salih-Arda-Katircioglu"   8081
start_backend "Enes"    "$ROOT_DIR/Enes-Coban"               8082
start_backend "Efe"     "$ROOT_DIR/Yakup-Efe-Celebi"         8083
echo ""

# ---- Frontends ----
echo "Starting Vite frontends..."
start_frontend "Furkan"  "$ROOT_DIR/Furkan-Alp-Gunay/frontend"         5173
start_frontend "Cem"     "$ROOT_DIR/Cem-Karaca/frontend"               5174
start_frontend "Arda"    "$ROOT_DIR/Salih-Arda-Katircioglu/frontend"   5175
start_frontend "Enes"    "$ROOT_DIR/Enes-Coban/frontend"               5176
start_frontend "Efe"     "$ROOT_DIR/Yakup-Efe-Celebi/frontend"         5177
echo ""

echo "============================================"
echo "  All available servers are running!"
echo ""
echo "  Backends:"
echo "    Furkan  → http://localhost:8080"
echo "    Cem     → http://localhost:3000"
echo "    Arda    → http://localhost:8081"
echo "    Enes    → http://localhost:8082"
echo "    Efe     → http://localhost:8083"
echo ""
echo "  Frontends:"
echo "    Furkan  → http://localhost:5173"
echo "    Cem     → http://localhost:5174"
echo "    Arda    → http://localhost:5175"
echo "    Enes    → http://localhost:5176"
echo "    Efe     → http://localhost:5177"
echo ""
echo "  Press Ctrl+C to stop all servers."
echo "============================================"

wait
