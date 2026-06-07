#!/usr/bin/env bash
# ============================================================
# BOSE Project — Full Ecosystem Bootstrapper
# Starts shared infra (Postgres + Redis + RabbitMQ via Docker),
# all 5 Go backends, and all 5 Vite frontends.
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
  echo ""
  echo "Infra containers still running. To stop them: docker compose down"
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

# ---- Shared Infra ----
if command -v docker >/dev/null 2>&1; then
  echo "Starting shared infra (Postgres + Redis + RabbitMQ)..."
  (cd "$ROOT_DIR" && docker compose up -d postgres redis rabbitmq) || \
    echo "  [WARN] docker compose failed — assuming infra is already running or env is using remote services."
  # Wait for infra to be READY before launching backends. Otherwise the one-shot
  # RabbitMQ publishers (Furkan user.registered, Cem order.filled) try to connect
  # before RabbitMQ is accepting connections, fail, and silently no-op — so events
  # are never published and the consumers (order_logs, Default watchlist) get nothing.
  echo "  Waiting for RabbitMQ + Postgres to be ready..."
  for _ in $(seq 1 40); do
    docker exec bose-rabbitmq-1 rabbitmq-diagnostics -q ping >/dev/null 2>&1 && { echo "  RabbitMQ ready."; break; }
    sleep 1
  done
  for _ in $(seq 1 40); do
    docker exec bose-postgres-1 pg_isready -q -U bose >/dev/null 2>&1 && { echo "  Postgres ready."; break; }
    sleep 1
  done
  echo ""
else
  echo "  [WARN] docker not found — relying on remote DB/Redis/RabbitMQ from .env."
  echo ""
fi

# ---- Backends ----
echo "Starting Go backends..."
start_backend "Furkan"  "$ROOT_DIR/Furkan-Alp-Gunay"         8080
start_backend "Cem"     "$ROOT_DIR/Cem-Karaca"               8081
start_backend "Arda"    "$ROOT_DIR/Salih-Arda-Katircioglu"   8082
start_backend "Enes"    "$ROOT_DIR/Enes-Coban"               8083
start_backend "Efe"     "$ROOT_DIR/Yakup-Efe-Celebi"         8084
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
echo "    Furkan  → http://localhost:8080/api/v1"
echo "    Cem     → http://localhost:8081/api/v1"
echo "    Arda    → http://localhost:8082/api/v1"
echo "    Enes    → http://localhost:8083/api/v1"
echo "    Efe     → http://localhost:8084/api/v1"
echo ""
echo "  Frontends:"
echo "    Furkan  → http://localhost:5173"
echo "    Cem     → http://localhost:5174"
echo "    Arda    → http://localhost:5175"
echo "    Enes    → http://localhost:5176"
echo "    Efe     → http://localhost:5177"
echo ""
echo "  Infra:"
echo "    Postgres   → localhost:5432  (user=bose, pass=bose, db=bose)"
echo "    Redis      → localhost:6379"
echo "    RabbitMQ   → localhost:5672  (mgmt UI: http://localhost:15672, guest/guest)"
echo ""
echo "  Press Ctrl+C to stop all servers."
echo "============================================"

wait
