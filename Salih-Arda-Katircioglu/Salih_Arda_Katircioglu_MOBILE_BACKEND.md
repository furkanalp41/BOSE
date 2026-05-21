# 6. Mobile Back-End — Salih Arda Katırcıoğlu

Üye: **Salih Arda Katırcıoğlu**
Backend servis: `bose-salih` → `:8082/api/v1`
Modül: `Salih-Arda-Katircioglu/` (Go + Fiber + GORM + RabbitMQ consumer)

## Sahip Olunan Endpoint'ler (6/6)

| Metod | Yol | Controller |
|---|---|---|
| POST | /api/v1/alerts | `controllers/alerts_controller.go:CreateAlert` |
| PUT | /api/v1/alerts/{id} | `controllers/alerts_controller.go:UpdateAlert` |
| DELETE | /api/v1/alerts/{id} | `controllers/alerts_controller.go:DeleteAlert` |
| GET | /api/v1/orders/history | `controllers/history_controller.go:GetOrderHistory` |
| DELETE | /api/v1/watchlists/{listId}/assets/{assetSymbol} | `controllers/watchlist_asset_controller.go:RemoveAssetFromWatchlist` |
| POST | /api/v1/ai/chat | `controllers/chat_controller.go:SendChatMessage` |

## Kanıt Videosu (Mobil → REST → DB + Alert Trigger)

1. Mobil emülatörde Alarmlar ekranı açılır.
2. Mevcut canlı fiyatın %1 üzerinde bir alarm oluşturulur (Yakup'un canlı fiyat akışı çalışıyor olmalı).
3. Backend log'u: `POST /api/v1/alerts 201`.
4. Birkaç saniye sonra (price.tick'ler geldikçe) consumer alarmı tetikler — DB'de `triggered_at` set olur, mobil ekran refresh edilince badge "Tetiklendi" olur.

- **Video linki:** ____

## Yapılan / Yapılamayan

- [x] 6 endpoint, testler geçiyor
- [x] RabbitMQ consumer (`messaging/consumer.go`) `bose.events / price.tick` aboneliği
- [ ] Video kaydı: ____
