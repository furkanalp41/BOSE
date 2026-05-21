# 7. Video Sunum — Enes Çoban

## Video 1 — Redis (kullanıldı)

- **Kullanım yeri:** `GET /api/v1/watchlists` cevabının kullanıcı başına 60 saniyelik cache'lenmesi (`watchlists:user:<id>`). CRUD mutasyonlarında invalidate.
- **Demo:**
  1. `redis-cli MONITOR` açık.
  2. `GET /api/v1/watchlists` iki kez çağrılır — ilkinde DB sorgusu, ikincide cache hit.
  3. `POST /api/v1/watchlists` sonrası MONITOR'da `DEL watchlists:user:1` satırı görünür.
- **Video linki:** ____

## Video 2 — RabbitMQ / Kafka

- **Durum:** kullanmadım. (Watchlist domain'i okuma ağırlıklı; kuyruk değer katmıyor.)
- **Video linki:** —

## Video 3 — Docker + CI/CD (kullanıldı)

- **Kullanım yeri:** `Enes-Coban/Dockerfile` + compose servisi `enes` + GitHub Actions matrix.
- **Video linki:** ____

## Grup Sunum Videosu

- **Link:** ____
