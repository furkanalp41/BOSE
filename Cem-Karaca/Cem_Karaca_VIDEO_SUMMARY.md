# 7. Video Sunum — Cem Karaca

## Video 1 — Redis

- **Durum:** kullanmadım. (Doğrudan kullanılmıyor; piyasa fiyatları Yakup'un servisinden okunuyor.)
- **Alternatif:** Cem'in `lookupLatestPrice` fonksiyonu Yakup'un Redis hash'inden okuduğunu göstermek isterse demo'ya eklenebilir.
- **Video linki:** ____ (veya "kullanmadım")

## Video 2 — RabbitMQ (kullanıldı)

- **Kullanım yeri:** `messaging/publisher.go` — başarılı piyasa emrinden sonra `bose.events` topic exchange'ine `order.filled` routing key'iyle yayın.
- **Demo akışı:**
  1. `docker compose up -d rabbitmq` ile broker ayağa kalkar.
  2. RabbitMQ management UI (`http://localhost:15672`) açılır.
  3. `curl -X POST http://localhost:8081/api/v1/orders/market -H "Authorization: Bearer …" -d '{"symbol":"THYAO","side":"BUY","quantity":10}'`
  4. UI'da `bose.events` exchange'inde mesaj sayısı 1 artar; tüketici olarak Salih'in `bose.salih.price-tick` kuyruğu yerine `bose.events` exchange'inin "in" göstergesi.
- **Video linki:** ____

## Video 3 — Docker + CI/CD (kullanıldı)

- **Kullanım yeri:** `Cem-Karaca/Dockerfile` + repo kök `docker-compose.yml` (servis adı `cem`) + GitHub Actions matrix.
- **Demo:**
  1. `docker compose build cem` başarılı çıktı.
  2. `docker compose up -d` ile servis :8081'de çalışır.
  3. PR açıldığında GitHub Actions `go-services / Cem-Karaca` jobu geçer.
- **Video linki:** ____

## Grup Sunum Videosu

- **Link:** ____
