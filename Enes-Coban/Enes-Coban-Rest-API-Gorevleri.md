# API Dokümantasyonu

**API Test Videosu:** [Link buraya eklenecek](#)

---

## 1. Yeni İzleme Listesi Oluşturma

Yeni bir izleme listesi (watchlist) oluşturur.

*   **Endpoint:** `POST /watchlists`
*   **Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "name": "Uzun Vadeli Kriptolarım"
}
```

**Response:**
*   `201 Created` - İzleme listesi başarıyla oluşturuldu.

---

## 2. İzleme Listesine Varlık Ekleme

Mevcut bir listeye yeni bir varlık (sembol) ekler.

*   **Endpoint:** `POST /watchlists/{listId}/assets`
*   **Authentication:** Bearer Token gerekli

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
| :--- | :--- | :---: | :--- |
| `listId` | string | Evet | İzleme listesi ID'si |

**Request Body:**
```json
{
  "symbol": "BTCUSDT"
}
```

**Response:**
*   `201 Created` - Varlık listeye eklendi.

---

## 3. İzleme Listelerini Görüntüleme

Kullanıcıya ait tüm listeleri ve içindeki varlıkların anlık fiyatlarını getirir.

*   **Endpoint:** `GET /watchlists`
*   **Authentication:** Bearer Token gerekli

**Response:**
*   `200 OK` - Tüm listeler ve anlık fiyatlar başarıyla getirildi.

---

## 4. Liste Adı Güncelleme

Mevcut bir izleme listesinin adını değiştirir.

*   **Endpoint:** `PUT /watchlists/{listId}`
*   **Authentication:** Bearer Token gerekli

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
| :--- | :--- | :---: | :--- |
| `listId` | string | Evet | İzleme listesi ID'si |

**Request Body:**
```json
{
  "name": "Favori Hisselerim"
}
```

**Response:**
*   `200 OK` - Liste adı başarıyla güncellendi.

---

## 5. İzleme Listesini Silme

Belirtilen izleme listesini siler (Sadece kendi listesini silme yetkisi vardır).

*   **Endpoint:** `DELETE /watchlists/{listId}`
*   **Authentication:** Bearer Token gerekli

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
| :--- | :--- | :---: | :--- |
| `listId` | string | Evet | İzleme listesi ID'si |

**Response:**
*   `204 No Content` - İzleme listesi başarıyla silindi.

---

## 6. AI Durum Raporu Almak

Kişinin yatırım alışkanlıkları için rapor oluşturur.

*   **Endpoint:** `GET /ai/report/status/{assetSymbol}`
*   **Authentication:** Bearer Token gerekli

**Path Parameters:**

| Parametre | Tip | Zorunlu | Açıklama |
| :--- | :--- | :---: | :--- |
| `assetSymbol` | string | Evet | - |

**Response:**
*   `200 OK` - AI teknik analiz ve durum özeti döndürüldü.