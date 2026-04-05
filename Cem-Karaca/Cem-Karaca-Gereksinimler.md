# Cem Karaca - REST API Gereksinimleri

> **REST API Domain:** `https://YOUR-DOMAIN.railway.app/v1`  
> **Postman Collection:** [Cem-Karaca-Postman-Collection.json](./Cem-Karaca-Postman-Collection.json)  
> **YouTube Test Videosu:** *(deploy sonrası eklenecek)*

---

## Gereksinim 13 - Piyasa Emri Oluşturma

**Yöntem:** `POST /v1/orders/market`  
**Açıklama:** Kullanıcı, anlık piyasa fiyatından hisse veya kripto alım/satım emri verir. Emir anında gerçekleşir ve `COMPLETED` statüsüne geçer. Alım emirlerinde kullanıcının bakiyesi yeterli olmalıdır.

**Request Body:**
```json
{
  "symbol": "BTCUSDT",
  "side": "BUY",
  "quantity": 0.01
}
```

**Başarılı Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "symbol": "BTCUSDT",
  "side": "BUY",
  "type": "MARKET",
  "quantity": 0.01,
  "filled_price": 65032.50,
  "status": "COMPLETED",
  "created_at": "2026-03-28T10:00:00Z"
}
```

---

## Gereksinim 14 - Limit Emir Oluşturma

**Yöntem:** `POST /v1/orders/limit`  
**Açıklama:** Kullanıcı, belirli bir hedef fiyattan gerçekleşmek üzere bekleyen emir oluşturur. Emir `PENDING` statüsünde kalır. Alım emirlerinde hedef fiyat × miktar kadar bakiye bloke edilir.

**Request Body:**
```json
{
  "symbol": "THYAO",
  "side": "BUY",
  "quantity": 10,
  "target_price": 270.00
}
```

**Başarılı Response (201):**
```json
{
  "id": "uuid",
  "symbol": "THYAO",
  "side": "BUY",
  "type": "LIMIT",
  "quantity": 10,
  "target_price": 270.00,
  "status": "PENDING",
  "created_at": "2026-03-28T10:05:00Z"
}
```

---

## Gereksinim 15 - Açık Emirleri Listeleme

**Yöntem:** `GET /v1/orders/open`  
**Açıklama:** Kullanıcının henüz gerçekleşmemiş (`PENDING`) tüm limit emirlerini listeler.

**Başarılı Response (200):**
```json
[
  {
    "id": "uuid",
    "symbol": "THYAO",
    "side": "BUY",
    "type": "LIMIT",
    "quantity": 10,
    "target_price": 270.00,
    "status": "PENDING",
    "created_at": "2026-03-28T10:05:00Z"
  }
]
```

---

## Gereksinim 16 - Limit Emir Güncelleme

**Yöntem:** `PUT /v1/orders/:orderId`  
**Açıklama:** `PENDING` durumundaki bir limit emrinin miktar ve/veya hedef fiyatını günceller. Sadece kendi emrini güncelleyebilir.

**Request Body:**
```json
{
  "quantity": 15,
  "target_price": 265.00
}
```

**Başarılı Response (200):** Güncellenmiş Order objesi döner.

**Hata Durumları:**
- `404` → Emir bulunamadı veya zaten tamamlanmış/iptal edilmiş
- `403` → Başka kullanıcının emrini güncellemeye çalışma

---

## Gereksinim 17 - Bekleyen Emri İptal Etme

**Yöntem:** `DELETE /v1/orders/:orderId`  
**Açıklama:** `PENDING` durumundaki bir emri iptal eder, statüsü `CANCELLED` olur. Bloke edilen bakiye iade edilir.

**Başarılı Response:** `204 No Content`

**Hata Durumları:**
- `404` → Emir bulunamadı, zaten tamamlanmış veya yetkisiz

---

## Gereksinim 18 - AI Portföy Raporu Almak

**Yöntem:** `GET /v1/ai/report/portfolio/:userId`  
**Açıklama:** Kullanıcının mevcut portföyünü analiz ederek yapay zeka destekli bir rapor döner. Raporda risk skoru, çeşitlendirme tavsiyesi, beklenen getiri ve varlık ağırlıkları yer alır.

**Başarılı Response (200):**
```json
{
  "user_id": "uuid",
  "risk_score": 62,
  "risk_level": "MEDIUM",
  "diversification_advice": "Portföyünüz kripto ağırlıklı (%65.3). BİST hisseleri ekleyerek riski dengeleyebilirsiniz.",
  "expected_return": 18.5,
  "holdings": [
    {
      "symbol": "BTCUSDT",
      "quantity": 0.05,
      "avg_cost": 64500.00,
      "weight_percent": 65.3
    },
    {
      "symbol": "THYAO",
      "quantity": 100,
      "avg_cost": 275.00,
      "weight_percent": 34.7
    }
  ],
  "generated_at": "2026-03-28T11:00:00Z"
}
```

---

## Tüm Endpoint'ler Özeti

| # | Gereksinim | Method | Path |
|---|-----------|--------|------|
| 13 | Piyasa Emri Oluşturma | `POST` | `/v1/orders/market` |
| 14 | Limit Emir Oluşturma | `POST` | `/v1/orders/limit` |
| 15 | Açık Emirleri Listeleme | `GET` | `/v1/orders/open` |
| 16 | Limit Emir Güncelleme | `PUT` | `/v1/orders/:orderId` |
| 17 | Bekleyen Emri İptal Etme | `DELETE` | `/v1/orders/:orderId` |
| 18 | AI Portföy Raporu | `GET` | `/v1/ai/report/portfolio/:userId` |

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
