# 6. Mobile Back-End — Cem Karaca

Üye: **Cem Karaca**
Backend servis: `bose-cem` → `:8081/api/v1`
Modül: `Cem-Karaca/` (Go + Fiber + GORM + RabbitMQ publisher)

## Sahip Olunan Endpoint'ler (6/6)

| Metod | Yol | Controller |
|---|---|---|
| POST | /api/v1/orders/market | `controllers/orders_controller.go:CreateMarketOrder` |
| POST | /api/v1/orders/limit | `controllers/orders_controller.go:CreateLimitOrder` |
| GET | /api/v1/orders/open | `controllers/orders_controller.go:GetOpenOrders` |
| PUT | /api/v1/orders/{id} | `controllers/orders_controller.go:UpdateLimitOrder` |
| DELETE | /api/v1/orders/{id} | `controllers/orders_controller.go:CancelOrder` |
| GET | /api/v1/ai/report/portfolio/{userId} | `controllers/ai_controller.go:GetPortfolioReport` |

## Kanıt Videosu (Mobil → REST → DB → RabbitMQ)

1. Mobil emülatörde Piyasa Emri ekranı açılır.
2. `BUY 10 THYAO` gönderilir.
3. Backend logu: `POST /api/v1/orders/market 201`.
4. RabbitMQ management UI'da (`http://localhost:15672` guest/guest) `bose.events → order.filled` mesajı sayacının arttığı gösterilir.
5. Mobil ekranda dolum fiyatı snackbar olarak görünür.

- **Video linki:** ____

## Yapılan / Yapılamayan

- [x] 6 endpoint, testler geçiyor (`go test ./controllers/...`)
- [x] RabbitMQ producer (`messaging/publisher.go`) `order.filled` yayını yapıyor
- [ ] Video kaydı: ____
