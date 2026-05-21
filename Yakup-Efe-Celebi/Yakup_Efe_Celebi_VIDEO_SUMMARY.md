# 7. Video Sunum — Yakup Efe Çelebi

## Video 1 — Redis (kullanıldı)

- **Kullanım yeri:** Canlı fiyatlar `prices:latest` hash'inde tutuluyor. `GET /api/v1/market/prices` doğrudan bu hash'ten okuyor.
- **Demo:**
  1. Servis ayakta — `streamer/ticker.go` her saniye HSET yapıyor.
  2. `redis-cli HGETALL prices:latest` çıktısı gösterilir — JSON'lar görünür.
  3. Aynı anda `curl http://localhost:8084/api/v1/market/prices?type=CRYPTO` çağrısı aynı veriyi döndürür.
- **Video linki:** ____

## Video 2 — RabbitMQ (kullanıldı)

- **Kullanım yeri:** `messaging/publisher.go` — ticker her tick'i `bose.events / price.tick` routing key'i ile yayınlar. Salih'in consumer'ı bu yayını dinler.
- **Demo:**
  1. RabbitMQ management UI'da `bose.events` exchange'inin yayın oranı (msg/s) > 0.
  2. Salih'in queue'sunun "Get message" ile içerik gösterimi.
- **Video linki:** ____

## Video 3 — Docker + CI/CD (kullanıldı)

- **Kullanım yeri:** `Yakup-Efe-Celebi/Dockerfile` + compose servisi `efe` + GitHub Actions matrix.
- **Demo:**
  1. `docker compose up -d efe` → servis 8084'te çalışır, ticker logu akar.
  2. GitHub Actions matrix `Yakup-Efe-Celebi` yeşil.
- **Video linki:** ____

## Grup Sunum Videosu

- **Link:** ____
