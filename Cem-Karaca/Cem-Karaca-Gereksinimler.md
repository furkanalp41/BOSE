# Cem Karaca - REST API Gereksinimleri

> **REST API Domain:** `https://bose-platform.onrender.com/api/v1`  
> **Postman Collection:** [Cem-Karaca-Postman-Collection.json](./Cem-Karaca-Postman-Collection.json)  
> **YouTube Test Videosu:** *(deploy sonrası eklenecek)*

---

## Gereksinim 11 - Emir Oluşturma

**Yöntem:** `POST /api/v1/trading/order`  
**Açıklama:** Anlık piyasa fiyatından alım veya satım emri oluşturur. Alımda bakiyeden düşer, satışta pozisyon kapatılır.

**Request Body:**
```json
{
  "symbol": "BTC",
  "side": "BUY",
  "quantity": 0.5
}
```

**Başarılı Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "symbol": "BTC",
  "side": "BUY",
  "quantity": 0.5,
  "price": 65000.00,
  "total": 32500.00,
  "createdAt": "2026-03-28T10:00:00Z"
}
```

---

## Gereksinim 12 - Açık Pozisyonları Listeleme

**Yöntem:** `GET /api/v1/trading/positions`  
**Açıklama:** Kullanıcının tüm açık pozisyonlarını güncel piyasa fiyatları ve PnL ile getirir.

**Başarılı Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "symbol": "BTC",
    "quantity": 0.5,
    "avgEntryPrice": 64000.00,
    "createdAt": "2026-03-27T14:00:00Z",
    "currentPrice": 65000.00,
    "marketValue": 32500.00,
    "pnl": 500.00,
    "pnlPercent": 1.56
  }
]
```

---

## Gereksinim 13 - Pozisyon Kapatma

**Yöntem:** `POST /api/v1/trading/positions/:positionId/close`  
**Açıklama:** Belirtilen pozisyonu güncel piyasa fiyatından kapatır ve bakiyeyi günceller.

**Başarılı Response:** `200 OK`

**Hata Durumları:**
- `400` → Kötü istek
- `401` → Kimlik doğrulama başarısız

---

## Gereksinim 14 - İşlem Geçmişini Görüntüleme

**Yöntem:** `GET /api/v1/trading/history`  
**Açıklama:** Kullanıcının gerçekleşmiş tüm alım-satım işlemlerini kronolojik listeler.

**Başarılı Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "symbol": "BTC",
    "side": "BUY",
    "quantity": 0.5,
    "price": 65000.00,
    "total": 32500.00,
    "createdAt": "2026-03-28T10:00:00Z"
  }
]
```

---

## Gereksinim 15 - Portföy Özeti Görüntüleme

**Yöntem:** `GET /api/v1/trading/portfolio`  
**Açıklama:** Kullanıcının toplam bakiye, pozisyon değeri, PnL ve detaylı pozisyon bilgilerini döner.

**Başarılı Response (200):**
```json
{
  "balance": 15000.00,
  "inPositions": 32500.00,
  "totalValue": 47500.00,
  "pnl": 500.00,
  "pnlPercent": 1.56,
  "positions": [
    {
      "id": 1,
      "userId": 1,
      "symbol": "BTC",
      "quantity": 0.5,
      "avgEntryPrice": 64000.00,
      "createdAt": "2026-03-27T14:00:00Z",
      "currentPrice": 65000.00,
      "marketValue": 32500.00,
      "pnl": 500.00,
      "pnlPercent": 1.56
    }
  ]
}
```

---

## Gereksinim 16 - Duyuru Oluşturma

**Yöntem:** `POST /api/v1/admin/announcements`  
**Açıklama:** Sistem genelinde duyuru yayınlar. Sadece Admin yetkisine sahip kullanıcılar erişebilir.

**Request Body:**
```json
{
  "title": "Sistem Bakımı",
  "content": "Sistemimiz bu gece kısa bir süreliğine bakıma alınacaktır."
}
```

**Başarılı Response:** `201 Created`

**Hata Durumları:**
- `403` → Admin yetkisi yok

---

## Tüm Endpoint'ler Özeti

| # | Gereksinim | Method | Path |
|---|-----------|--------|------|
| 11 | Emir Oluşturma | `POST` | `/api/v1/trading/order` |
| 12 | Açık Pozisyonları Listeleme | `GET` | `/api/v1/trading/positions` |
| 13 | Pozisyon Kapatma | `POST` | `/api/v1/trading/positions/:positionId/close` |
| 14 | İşlem Geçmişini Görüntüleme | `GET` | `/api/v1/trading/history` |
| 15 | Portföy Özeti Görüntüleme | `GET` | `/api/v1/trading/portfolio` |
| 16 | Duyuru Oluşturma | `POST` | `/api/v1/admin/announcements` |

Tüm endpoint'ler JWT Bearer Token ile kimlik doğrulama gerektirir.

---

## Kurulum

```bash
# Bağımlılıkları indir
go mod tidy

# Ortam değişkenlerini ayarla
cp .env.example .env
# .env içindeki DATABASE_URL ve JWT_SECRET değerlerini doldur

# Veritabanını oluştur
psql -U postgres -d bose_db -f db/migrations/001_init.sql

# Çalıştır
go run ./cmd/api
```
