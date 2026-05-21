# 5. Mobile Front-End — Salih Arda Katırcıoğlu

Üye: **Salih Arda Katırcıoğlu**
Mobil yapı: Flutter (mobile/lib/features/salih)

## Gereksinimler

| # | Ekran | Endpoint | Servis |
|---|---|---|---|
| 1 | Fiyat Alarmı Ekle | POST /api/v1/alerts | :8082 |
| 2 | Fiyat Alarmı Güncelle | PUT /api/v1/alerts/{id} | :8082 |
| 3 | Fiyat Alarmı Sil | DELETE /api/v1/alerts/{id} | :8082 |
| 4 | İşlem Geçmişi | GET /api/v1/orders/history | :8082 |
| 5 | İzleme listesinden varlık çıkar | DELETE /api/v1/watchlists/{listId}/assets/{assetSymbol} | :8082 |
| 6 | AI Chatbot | POST /api/v1/ai/chat | :8082 |

Asgari kanıt: `AlertsScreen` (mobile/lib/features/salih/alerts_screen.dart).

## Kanıt Videosu

- **Video linki:** ____

## Konuşma metni özeti

1. "Salih Arda Katırcıoğlu, mobil front-end ekranlarımı sunuyorum."
2. Alarm Ekle → bir sembol için fiyat eşiği belirlenir, oluşturulur.
3. Backend log'u `POST /api/v1/alerts 201` satırını gösterir.
