# 6. Mobile Back-End — Enes Çoban

Üye: **Enes Çoban**
Backend servis: `bose-enes` → `:8083/api/v1`
Modül: `Enes-Coban/` (Go + Fiber + GORM + Redis cache)

## Sahip Olunan Endpoint'ler (6/6)

| Metod | Yol | Controller |
|---|---|---|
| POST | /api/v1/watchlists | `controllers/watchlists_controller.go:CreateWatchlist` |
| GET | /api/v1/watchlists | `controllers/watchlists_controller.go:GetWatchlists` |
| PUT | /api/v1/watchlists/{id} | `controllers/watchlists_controller.go:UpdateWatchlist` |
| DELETE | /api/v1/watchlists/{id} | `controllers/watchlists_controller.go:DeleteWatchlist` |
| POST | /api/v1/watchlists/{listId}/assets | `controllers/watchlists_controller.go:AddAsset` |
| GET | /api/v1/ai/report/status/{assetSymbol} | `controllers/ai_controller.go:GetStatusReport` |

## Kanıt Videosu

1. Mobil ekran: İzleme Listeleri tab'ı.
2. FAB ile yeni liste oluşturulur — backend log `POST /api/v1/watchlists 201`.
3. Tekrar GET çağrısı yapıldığında Redis cache hit (ikinci istekte aynı response).
4. Swipe ile silme — `DELETE /api/v1/watchlists/<id> 204`.

- **Video linki:** ____

## Yapılan / Yapılamayan

- [x] 6 endpoint, testler geçiyor
- [x] Redis `watchlists:user:<id>` cache (60s TTL, CRUD'da invalidate)
- [ ] Video kaydı: ____
