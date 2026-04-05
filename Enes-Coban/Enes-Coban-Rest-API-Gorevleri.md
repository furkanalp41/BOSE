# API Dokümantasyonu

**API Test Videosu:** [https://youtu.be/0jEJTugLoNg](#)
**Backend API Swagger UI Paneli:** [https://bose-platform.onrender.com/docs] (#)

---

## 26. AI Yatırım Tavsiyesi Alma

Belirtilen varlık için yapay zeka tabanlı AL/SAT/TUT tavsiyesi ve analizi oluşturur.

*   **Endpoint:** `POST /ai/advice`
*   **Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "symbol": "BTC"
}
```

**Response:**
*   `200 OK` - AI tavsiyesi ve analiz metni başarıyla döndürüldü.
*   `401 Unauthorized` - Token geçersiz veya yok.

---

## 27. AI Portföy Raporu Alma

Mevcut portföy üzerinden risk analizi ve strateji raporlaması yapar.

*   **Endpoint:** `POST /ai/reports/portfolio`
*   **Authentication:** Bearer Token gerekli

**Response:**
*   `200 OK` - AI raporu başarıyla getirildi.
*   `401 Unauthorized` - Token geçersiz veya yok.

---

## 28. AI Watchlist Raporu Alma

Kullanıcının izleme listesindeki varlıkların AI analiz raporunu getirir.

*   **Endpoint:** `POST /ai/reports/watchlist`
*   **Authentication:** Bearer Token gerekli

**Response:**
*   `200 OK` - AI raporu başarıyla getirildi.

---

## 29. AI İşlem Geçmişi Raporu Alma

Aktiviteler üzerinden işlem başarı performansı ölçümü yapan AI raporu.

*   **Endpoint:** `POST /ai/reports/transactions`
*   **Authentication:** Bearer Token gerekli

**Response:**
*   `200 OK` - Performans raporu başarıyla döndürüldü.

---

## 30. AI Chatbot ile Sohbet

Yapay zeka asistanına serbest finansal / teknik analiz soruları sormak için kullanılır.

*   **Endpoint:** `POST /ai/chat`
*   **Authentication:** Bearer Token gerekli

**Request Body:**
```json
{
  "message": "BTC hakkında ne düşünüyorsun?"
}
```

**Response:**
*   `200 OK` - Chat yanıtı alındı.