# 7. Video Sunum — Salih Arda Katırcıoğlu

## Video 1 — Redis (kullanıldı)

- **Kullanım yeri:** Aktif alarmların sembol-bazlı invalidation cache'i. `alerts:active:<symbol>` anahtarı her CRUD'da silinir.
- **Demo:**
  1. `redis-cli MONITOR` açılır.
  2. `POST /api/v1/alerts` çağrısı yapılır.
  3. MONITOR çıktısında `DEL alerts:active:BTCUSDT` satırı görünür.
- **Video linki:** ____

## Video 2 — RabbitMQ (kullanıldı)

- **Kullanım yeri:** `messaging/consumer.go` — `bose.events` exchange'inden `price.tick` mesajlarını tüketir, eşleşen alarmları tetikler.
- **Demo:**
  1. Yakup'un servisi ayakta (price.tick yayını).
  2. RabbitMQ management UI'da `bose.salih.price-tick` kuyruğu görünür ve mesaj sayacının her saniye arttığı gözlemlenir.
  3. Alarm tetiklenince DB satırında `triggered_at` set'leniyor (logdan veya pgAdmin'den).
- **Video linki:** ____

## Video 3 — Docker + CI/CD (kullanıldı)

- **Kullanım yeri:** `Salih-Arda-Katircioglu/Dockerfile` + compose servisi `salih` + GitHub Actions matrix.
- **Video linki:** ____

## Grup Sunum Videosu

- **Link:** ____
