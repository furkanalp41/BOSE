# 7. Video Sunum — Furkan Alp Günay

PDF: "RabbitMQ/Kafka, Redis/Memcached, Docker+CI/CD kanıt videoları... Bu kısımlar bireyseldir. Dolayısıyla video sunum kısmında grup üyesi sayısı × 3 adet video olmalı."

Aşağıdaki 3 video Furkan tarafından kaydedilir. Kullanılmayan teknoloji için "kullanmadım" denir.

## Video 1 — Redis (kullanıldı)

- **Kullanım yeri:** JWT oturum cache'i (`middlewares/security.go`). Her `RequireAuth` çağrısında token hash anahtarıyla Redis'e bakılır; cache hit'te JWT parsing atlanır.
- **Demo komutu:** Terminal 1 — `redis-cli MONITOR`. Terminal 2 — `curl -H "Authorization: Bearer …" http://localhost:8080/api/v1/users/1` art arda çağrı.
- **Video linki:** ____

## Video 2 — RabbitMQ (kullanıldı)

- **Kullanım yeri:**
  - **Yayıncı:** `controllers/auth_controller.go` — yeni kayıtta `bose.events` topic exchange'ine `user.registered` routing key'iyle yayın yapar (Enes'in consumer'ı dinler).
  - **Tüketici:** `messaging/consumer.go` — `order.filled` mesajlarını tüketip her dolan emri `order_logs` denetim tablosuna yazar (idempotent; `order_id` unique index).
- **Demo akışı:**
  1. RabbitMQ management UI (`http://localhost:15672`, guest/guest) → `bose.events` exchange + `bose.furkan.order-filled` kuyruğu görünür.
  2. Cem'de bir piyasa emri verilir → `order.filled` tüketilir → denetim satırı düşer:
     `docker exec bose-postgres-1 psql -U bose -d bose -c "select * from order_logs;"`
- **Video linki:** ____

## Video 3 — Docker + CI/CD (kullanıldı)

- **Kullanım yeri:** Repo kökündeki `docker-compose.yml` + `Furkan-Alp-Gunay/Dockerfile` + `.github/workflows/ci.yml` matrix job `Furkan-Alp-Gunay`.
- **Demo akışı:**
  1. `docker compose up -d` ile postgres + redis + rabbitmq + furkan servisi ayağa kalkar.
  2. `docker compose ps` ile sağlık durumu gösterilir.
  3. Branch'a trivial commit pushlanır; GitHub Actions çalışırken `go test ./controllers/...` adımı yeşil sonuçlanır.
- **Video linki:** ____

## Grup Sunum Videosu (Ortak)

- **Link:** ____
