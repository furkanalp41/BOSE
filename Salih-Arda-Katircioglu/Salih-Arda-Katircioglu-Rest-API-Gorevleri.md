**API Test Videosu:** [Link buraya eklenecek](#)

### 17. Yeni İzleme Listesi Oluşturma
* **Endpoint:** `POST /watchlist`
Authentication: Bearer Token gerekli
Response: 201 Created - Yeni izleme listesi başarıyla oluşturuldu.

### 18. İzleme Listelerini Görüntüleme
* **Endpoint:** `GET /watchlist`
Authentication: Bearer Token gerekli
Response: 200 OK - İzleme listeleri başarıyla getirildi.

### 19. İzleme Listesini Silme
* **Endpoint:** `DELETE /watchlist/{id}`
Path Parameters:
id (integer, required) - İzleme listesi ID'si
Authentication: Bearer Token gerekli
Response: 204 No Content - İzleme listesi silindi.

### 20. İzleme Listesine Varlık Ekleme
* **Endpoint:** `POST /watchlist/{id}/items`
Path Parameters:
id (integer, required) - İzleme listesi ID'si
Request Body:
```json
{
  "symbol": "BTC"
}
```
Authentication: Bearer Token gerekli
Response: 201 Created - Varlık başarıyla listeye eklendi.

### 21. Listeden Varlık Çıkarma
* **Endpoint:** `DELETE /watchlist/{id}/items/{itemId}`
Path Parameters:
id (integer, required) - İzleme listesi ID'si
itemId (integer, required) - Çıkarılacak item ID'si
Authentication: Bearer Token gerekli
Response: 204 No Content - Varlık listeden çıkarıldı.

### 22. Fiyat Alarmı Ekleme
* **Endpoint:** `POST /watchlist/alerts`
Request Body:
```json
{
  "symbol": "BTC",
  "target_price": 60000.0,
  "condition": "BELOW",
  "watchlist_id": 1
}
```
Authentication: Bearer Token gerekli
Response: 201 Created - Fiyat alarmı sisteme başarıyla kaydedildi.

### 23. Fiyat Alarmlarını Listeleme
* **Endpoint:** `GET /watchlist/alerts`
Authentication: Bearer Token gerekli
Response: 200 OK - Fiyat alarmları başarıyla getirildi.

### 24. Fiyat Alarmını Silme
* **Endpoint:** `DELETE /watchlist/alerts/{alertId}`
Path Parameters:
alertId (integer, required) - Alarm ID'si
Authentication: Bearer Token gerekli
Response: 204 No Content - Alarm başarıyla silindi.

### 25. Tetiklenmiş Alarmları Görüntüleme
* **Endpoint:** `GET /watchlist/alerts/triggered`
Authentication: Bearer Token gerekli
Response: 200 OK - Tetiklenmiş alarmlar getirildi.
