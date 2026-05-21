# 6. Mobile Back-End — Yakup Efe Çelebi

Üye: **Yakup Efe Çelebi**
Backend servis: `bose-efe` → `:8084/api/v1`
Modül: `Yakup-Efe-Celebi/` (Go + Fiber + GORM + Redis cache + RabbitMQ publisher + WebSocket stream + price ticker goroutine)

## Sahip Olunan Endpoint'ler (6/6)

| Metod | Yol | Controller |
|---|---|---|
| POST | /api/v1/market/assets | `controllers/market_controller.go:CreateMarketAsset` |
| PUT | /api/v1/market/assets/{id} | `controllers/market_controller.go:UpdateMarketAsset` |
| GET | /api/v1/market/prices | `controllers/market_controller.go:GetMarketPrices` |
| WS | /api/v1/market/stream | `controllers/market_ws.go:HandleMarketStream` |
| GET | /api/v1/admin/health | `controllers/admin_controller.go:GetSystemHealth` |
| GET | /api/v1/users/{id}/logs | `controllers/user_logs_controller.go:GetUserLogs` |
| DELETE | /api/v1/ai/history | `controllers/ai_controller.go:ClearAIHistory` |

## Kanıt Videosu

1. Mobil "Canlı Fiyatlar" ekranı açılır → liste anında doluyor.
2. Terminal'de bose-efe logu: 1 saniyede bir `price.tick` mesajları yayınlanıyor.
3. `redis-cli HGETALL prices:latest` — Redis hash içeriği gösterilir.
4. RabbitMQ UI'da `bose.events / price.tick` mesaj akışı.

- **Video linki:** ____

## Yapılan / Yapılamayan

- [x] 6 endpoint + WebSocket stream + price ticker goroutine
- [x] Testler geçiyor (`go test ./controllers/...`)
- [ ] Video kaydı: ____
