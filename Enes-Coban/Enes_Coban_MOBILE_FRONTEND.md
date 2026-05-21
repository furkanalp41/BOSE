# 5. Mobile Front-End — Enes Çoban

Üye: **Enes Çoban**
Mobil yapı: Flutter (mobile/lib/features/enes)

## Gereksinimler

| # | Ekran | Endpoint | Servis |
|---|---|---|---|
| 1 | Yeni İzleme Listesi | POST /api/v1/watchlists | :8083 |
| 2 | Listeye Varlık Ekle | POST /api/v1/watchlists/{listId}/assets | :8083 |
| 3 | İzleme Listelerini Gör | GET /api/v1/watchlists | :8083 |
| 4 | Liste Adı Güncelle | PUT /api/v1/watchlists/{listId} | :8083 |
| 5 | İzleme Listesi Sil (swipe) | DELETE /api/v1/watchlists/{listId} | :8083 |
| 6 | AI Durum Raporu | GET /api/v1/ai/report/status/{assetSymbol} | :8083 |

Asgari kanıt: `WatchlistsScreen` (mobile/lib/features/enes/watchlists_screen.dart).

## Kanıt Videosu

- **Video linki:** ____

## Konuşma metni özeti

1. "Enes Çoban, mobil front-end ekranlarımı sunuyorum."
2. Yeni liste oluştur → bir liste eklenir → swipe ile silinir.
3. Backend log'u `POST /api/v1/watchlists 201` ve `DELETE /api/v1/watchlists/<id> 204`.
