**API Test Videosu:** [Link buraya eklenecek](#)

### 1. Fiyat Alarmı Ekleme

* **Endpoint:** `POST /alerts`
* **Request Body:**

  ```json
  {
    "symbol": "ETHUSDT",
    "targetPrice": 3000.00,
    "condition": "GREATER_THAN"
  }
  ```

Authentication: Bearer Token gerekli
Response: 201 Created - Fiyat alarmı sisteme başarıyla kaydedildi.
2. Fiyat Alarmı Güncelleme
Endpoint: PUT /alerts/{alertId}
Path Parameters:
alertId (string, required) - Alarm ID'si
Request Body:
JSON
{
  "targetPrice": 3100.00,
  "isActive": false
}


Authentication: Bearer Token gerekli
Response: 200 OK - Alarm başarıyla güncellendi.
3. Fiyat Alarmını Silme
Endpoint: DELETE /alerts/{alertId}
Path Parameters:
alertId (string, required) - Alarm ID'si
Authentication: Bearer Token gerekli
Response: 204 No Content - Alarm başarıyla silindi.
4. İşlem Geçmişini Görüntüleme
Endpoint: GET /orders/history
Authentication: Bearer Token gerekli
Response: 200 OK - Başarılı ve iptal edilen emirler kronolojik olarak getirildi.
5. Listeden Varlık Çıkarma
Endpoint: DELETE /watchlists/{listId}/assets/{assetSymbol}
Path Parameters:
listId (string, required) - İzleme listesi ID'si
assetSymbol (string, required) - Çıkarılacak varlık (Örn: BTCUSDT)
Authentication: Bearer Token gerekli
Response: 204 No Content - Varlık başarıyla izleme listesinden çıkarıldı.
6. AI Chatbot ile Sohbet
Endpoint: POST /ai/chat
Request Body:
JSON
{
  "message": "Borsa İstanbul bugün neden düştü?"
}


Authentication: Bearer Token gerekli
Response: 200 OK - AI asistanın cevabı döndürüldü.
