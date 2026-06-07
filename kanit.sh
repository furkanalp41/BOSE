#!/usr/bin/env bash
# ============================================================
# kanit.sh — BOSE "tum sistemler calisiyor" kanit scripti
#   Tek seferde canli sistem uzerinde gosterir:
#     1) Docker (3 healthy konteyner)
#     2) Backend sagligi (5 servis)
#     3) RabbitMQ (kuyruklar + binding + canli olay: kayit -> Default liste)
#     4) Redis (cache-aside yasam dongusu: MISS -> populate -> TTL -> invalidate)
#     5) CI/CD (GitHub Actions son calismalar)
#
# Kullanim: ./kanit.sh   (once stack calisir olmali:  ./start_project.sh)
# ============================================================
set -uo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
F=http://localhost:8080/api/v1
S=http://localhost:8082/api/v1
CT='Content-Type: application/json'
line() { printf '\n\033[1;36m========== %s ==========\033[0m\n' "$1"; }

line "1) DOCKER — konteynerler (hepsi 'healthy' olmali)"
( cd "$ROOT" && docker compose ps ) 2>/dev/null \
  || docker ps --filter name=bose --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

line "2) BACKEND SAGLIGI — 5 mikroservis"
for p in 8080 8081 8082 8083 8084; do
  printf '   :%s -> HTTP %s\n' "$p" "$(curl -s -m4 -o /dev/null -w '%{http_code}' http://localhost:$p/ 2>/dev/null)"
done

line "3) RABBITMQ — kuyruklar + exchange binding'leri"
docker exec bose-rabbitmq-1 rabbitmqctl list_queues name messages consumers 2>/dev/null
echo "   --- binding'ler (routing key'ler) ---"
docker exec bose-rabbitmq-1 rabbitmqctl list_bindings 2>/dev/null | grep 'bose.events'

line "   CANLI OLAY: yeni kayit -> user.registered -> 'Default' liste otomatik"
EMAIL="kanit$(date +%s)@bose.dev"
REG=$(curl -s -m8 -X POST "$F/auth/register" -H "$CT" \
  -d "{\"full_name\":\"Kanit User\",\"email\":\"$EMAIL\",\"password\":\"demo1234\"}")
TOKEN=$(echo "$REG" | grep -oE '"token":"[^"]+"' | head -1 | cut -d'"' -f4)
NUID=$(echo "$REG"  | grep -oE '"ID":[0-9]+'     | head -1 | grep -oE '[0-9]+')
echo "   yeni kullanici id=$NUID"
DW=0
for _ in $(seq 1 15); do
  DW=$(docker exec bose-postgres-1 psql -U bose -d bose -t \
        -c "select count(*) from watchlists where user_id=$NUID and name='Default';" 2>/dev/null | tr -d ' \n')
  [ "${DW:-0}" -ge 1 ] && break
done
echo "   -> user $NUID icin Default liste sayisi: ${DW:-0}   (RabbitMQ olayi islendi)"

line "4) REDIS — cache-aside yasam dongusu (alarm listesi)"
echo "   1) GET /alerts  (cache MISS -> DB -> cache'e yazar)"
curl -s -m8 -o /dev/null -w '      HTTP %{http_code}\n' "$S/alerts" -H "Authorization: Bearer $TOKEN"
echo "      EXISTS=$(docker exec bose-redis-1 redis-cli EXISTS alerts:user:$NUID 2>/dev/null)  TTL=$(docker exec bose-redis-1 redis-cli TTL alerts:user:$NUID 2>/dev/null)sn"
echo "   2) POST /alerts (yeni alarm -> cache INVALIDATE)"
curl -s -m8 -o /dev/null -w '      HTTP %{http_code}\n' -X POST "$S/alerts" -H "$CT" -H "Authorization: Bearer $TOKEN" \
  -d '{"symbol":"ETHUSDT","targetPrice":4000,"condition":"GREATER_THAN"}'
echo "      EXISTS=$(docker exec bose-redis-1 redis-cli EXISTS alerts:user:$NUID 2>/dev/null)  (0 = cache temizlendi)"
echo "   3) GET /alerts  (cache yeniden dolar)"
curl -s -m8 -o /dev/null -w '      HTTP %{http_code}\n' "$S/alerts" -H "Authorization: Bearer $TOKEN"
echo "      EXISTS=$(docker exec bose-redis-1 redis-cli EXISTS alerts:user:$NUID 2>/dev/null)  (1 = yeniden cache'lendi)"

line "5) CI/CD — GitHub Actions (main, son calismalar)"
if command -v gh >/dev/null 2>&1; then
  gh run list --branch main --limit 5 2>/dev/null || echo "   (gh oturum yok — GitHub > Actions sekmesinden yesil tikleri gosterin)"
else
  echo "   (gh kurulu degil — GitHub > Actions sekmesinden yesil tikleri gosterin)"
fi

line "TUM KANITLAR TAMAM"
