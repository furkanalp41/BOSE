**API Test Videosu:** [https://www.youtube.com/watch?v=UwrBQ9VU9Uw](#)

### 31. Market Varlıklarını Listeleme
* **Endpoint:** `GET /market/assets`
Authentication: Gerekmiyor
Response: 200 OK - Piyasa verileri ve anlık fiyatları başarıyla döndürüldü.

### 32. Admin Market Varlıklarını Listeleme
* **Endpoint:** `GET /admin/market/assets`
Authentication: Bearer Token gerekli (Admin)
Response: 200 OK - Admin görünümlü detaylı varlık listesi döndürüldü.

### 33. Yeni Market Varlığı Ekleme
* **Endpoint:** `POST /admin/market/assets`
Request Body:
```json
{
  "symbol": "BTC",
  "name": "Bitcoin",
  "price": 60000.0
}
```
Authentication: Bearer Token gerekli (Admin)
Response: 201 Created - Yeni varlık eklendi.

### 34. Varlık Bilgilerini Güncelleme
* **Endpoint:** `PUT /admin/market/assets/{symbol}`
Path Parameters:
symbol (string, required)
Authentication: Bearer Token gerekli (Admin)
Response: 200 OK - Varlık güncellendi.

### 35. Market Varlığı Silme
* **Endpoint:** `DELETE /admin/market/assets/{symbol}`
Path Parameters:
symbol (string, required)
Authentication: Bearer Token gerekli (Admin)
Response: 204 No Content - Varlık başarıyla silindi.

### 36. Liderlik Tablosu Görüntüleme
* **Endpoint:** `GET /leaderboard/rankings` ve `GET /leaderboard/user/{userId}`
Authentication: Bearer Token gerekli
Response: 200 OK - Sıralama tablosu ve kullanıcı sırası başarıyla getirildi.

### 37. Başarımları Görüntüleme
* **Endpoint:** `GET /leaderboard/achievements`
Authentication: Bearer Token gerekli
Response: 200 OK - Başarımlar getirildi.
