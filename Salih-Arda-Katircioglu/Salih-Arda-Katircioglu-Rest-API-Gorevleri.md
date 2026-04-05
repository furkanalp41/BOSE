# Salih Arda Katırcıoğlu'nun REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](#)

### 1. İzleme Listesi Oluşturma

* **Endpoint:** `POST /watchlist/`
* **Request Body:**

  ```json
  {
    "name": "Kripto Favori"
  }
  ```

Authentication: Bearer Token gerekli

Response: 201 Created - İzleme listesi başarıyla oluşturuldu.

2. İzleme Listelerini Görüntüleme
Endpoint: GET /watchlist/

Authentication: Bearer Token gerekli

Response: 200 OK - Tüm listeler ve içerisindeki semboller başarıyla getirildi.

3. İzleme Listesini Silme
Endpoint: DELETE /watchlist/:id

Path Parameters:
id (integer, required) - İzleme listesi ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - İzleme listesi ve tüm sembol kayıtları silindi (cascade).

4. Listeye Sembol Ekleme
Endpoint: POST /watchlist/:id/items

Path Parameters:
id (integer, required) - İzleme listesi ID'si

Request Body:
```json
{
  "symbol": "BTC"
}
```

Authentication: Bearer Token gerekli

Response: 201 Created - Sembol listeye eklendi. PriceEngine'den sembol validasyonu yapılır.

5. Listeden Sembol Çıkarma
Endpoint: DELETE /watchlist/:id/items/:itemId

Path Parameters:
id (integer, required) - İzleme listesi ID'si
itemId (integer, required) - Sembol kayıt ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - Sembol başarıyla listeden çıkarıldı.

6. Fiyat Alarmı Oluşturma
Endpoint: POST /watchlist/alerts

Request Body:
```json
{
  "symbol": "BTC",
  "target_price": 70000,
  "condition": "ABOVE"
}
```

Authentication: Bearer Token gerekli

Response: 201 Created - Fiyat alarmı sisteme kaydedildi.

7. Alarmları Listeleme
Endpoint: GET /watchlist/alerts

Authentication: Bearer Token gerekli

Response: 200 OK - Tüm alarmlar (id, symbol, target_price, condition, is_active) listelendi.

8. Alarm Silme
Endpoint: DELETE /watchlist/alerts/:alertId

Path Parameters:
alertId (integer, required) - Alarm ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - Alarm başarıyla silindi.

9. Tetiklenen Alarmları Görüntüleme
Endpoint: GET /watchlist/alerts/triggered

Authentication: Bearer Token gerekli

Response: 200 OK - Tetiklenen alarmlar (alert_id, symbol, triggered_price, triggered_at) listelendi.
