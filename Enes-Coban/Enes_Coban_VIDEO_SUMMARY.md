# 7. Video Sunum — Enes Çoban

## Video 1 — Redis (kullanıldı)

- **Kullanım yeri:** `GET /api/v1/watchlists` cevabının kullanıcı başına 60 saniyelik cache'lenmesi (`watchlists:user:<id>`). CRUD mutasyonlarında invalidate.
- **Demo:**
  1. `redis-cli MONITOR` açık.
  2. `GET /api/v1/watchlists` iki kez çağrılır — ilkinde DB sorgusu, ikincide cache hit.
  3. `POST /api/v1/watchlists` sonrası MONITOR'da `DEL watchlists:user:1` satırı görünür.
- **Video linki:** ____

## Video 2 — RabbitMQ (kullanıldı)

- **Kullanım yeri:** `messaging/consumer.go` — `bose.events` exchange'inden `user.registered` mesajlarını tüketir; her yeni kullanıcıya otomatik bir **"Default" izleme listesi** oluşturur (dashboard ilk girişte boş kalmasın).
- **Demo akışı:**
  1. RabbitMQ management UI'da `bose.enes.user-registered` kuyruğu görünür.
  2. Yeni kullanıcı kaydı yapılır (Furkan `user.registered` yayınlar) → Enes tüketir → Default liste oluşur:
     `docker exec bose-postgres-1 psql -U bose -d bose -c "select user_id,name from watchlists;"`
- **Video linki:** ____

## Video 3 — Docker + CI/CD (kullanıldı)

- **Kullanım yeri:** `Enes-Coban/Dockerfile` + compose servisi `enes` + GitHub Actions matrix.
- **Video linki:** ____

## Grup Sunum Videosu

- **Link:** ____
