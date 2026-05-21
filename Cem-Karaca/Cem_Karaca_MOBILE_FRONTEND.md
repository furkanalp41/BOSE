# 5. Mobile Front-End — Cem Karaca

Üye: **Cem Karaca**
Mobil yapı: Flutter (mobile/lib/features/cem)

## Gereksinimler

| # | Ekran | Endpoint | Servis |
|---|---|---|---|
| 1 | Piyasa Emri (AL/SAT) | POST /api/v1/orders/market | :8081 |
| 2 | Limit Emir Formu | POST /api/v1/orders/limit | :8081 |
| 3 | Açık Emirler | GET /api/v1/orders/open | :8081 |
| 4 | Limit Emir Güncelle | PUT /api/v1/orders/{id} | :8081 |
| 5 | Emir İptal (swipe) | DELETE /api/v1/orders/{id} | :8081 |
| 6 | AI Portföy Raporu | GET /api/v1/ai/report/portfolio/{userId} | :8081 |

Asgari kanıt: `MarketOrderScreen` (mobile/lib/features/cem/market_order_screen.dart) — POST /orders/market gerçekleştirilir.

## Kanıt Videosu

- **Tarih:** ____
- **Cihaz:** Android emulator / gerçek cihaz
- **Video linki:** ____

## Konuşma metni özeti

1. "Cem Karaca, mobil front-end ekranlarımı sunuyorum."
2. Ekran açılır → sembol, miktar, taraf seçilir → emir gönderilir.
3. Backend log'unda `POST /api/v1/orders/market 201` satırı görünür.
