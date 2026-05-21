# 5. Mobile Front-End — Yakup Efe Çelebi

Üye: **Yakup Efe Çelebi**
Mobil yapı: Flutter (mobile/lib/features/efe)

## Gereksinimler

| # | Ekran | Endpoint | Servis |
|---|---|---|---|
| 1 | Admin: Market Varlığı Ekle | POST /api/v1/market/assets | :8084 |
| 2 | Canlı Piyasa Fiyatları (WS) | GET /api/v1/market/stream (WebSocket) | :8084 |
| 3 | Admin: Varlık Güncelle | PUT /api/v1/market/assets/{id} | :8084 |
| 4 | Sistem Sağlık Paneli | GET /api/v1/admin/health | :8084 |
| 5 | Giriş Hareketleri | GET /api/v1/users/{id}/logs | :8084 |
| 6 | AI Geçmişi Temizle | DELETE /api/v1/ai/history | :8084 |

Asgari kanıt: `MarketPricesScreen` (mobile/lib/features/efe/market_prices_screen.dart) — canlı WebSocket akışı yeşil/kırmızı fiyat flash'ları ile gösterilir.

## Kanıt Videosu

- **Video linki:** ____

## Konuşma metni özeti

1. "Yakup Efe Çelebi, mobil front-end ekranlarımı sunuyorum."
2. Canlı Fiyatlar tab'ı açılır → her saniye yeni tick gelir, sayılar yanıp söner.
3. Backend log'da WebSocket bağlantı satırı + price tick yayını görünür.
