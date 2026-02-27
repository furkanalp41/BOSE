```markdown
# Cem Karaca'nın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](#)

### 1. Piyasa Emri Oluşturma

* **Endpoint:** `POST /orders/market`
* **Request Body:**

  ```json
  {
    "symbol": "BTCUSDT",
    "side": "BUY",
    "quantity": 0.5
  }

 ```

Authentication: Bearer Token gerekli
Response: 201 Created - Anlık piyasa emri gerçekleşti, bakiye güncellendi.
2. Limit Emir Oluşturma
Endpoint: POST /orders/limit
Request Body:
```json
{
  "symbol": "AAPL",
  "side": "SELL",
  "quantity": 10,
  "targetPrice": 185.50
}
 ```


Authentication: Bearer Token gerekli
Response: 201 Created - Limit emir kaydedildi, bakiye bloke edildi.
3. Açık Emirleri Listeleme
Endpoint: GET /orders/open
Authentication: Bearer Token gerekli
Response: 200 OK - Bekleyen durumdaki emirler listelendi.
4. Limit Emir Güncelleme
Endpoint: PUT /orders/{orderId}
Path Parameters:
orderId (string, required) - Emir ID'si
Request Body:
```json
{
  "targetPrice": 190.00,
  "quantity": 10
}
```


Authentication: Bearer Token gerekli
Response: 200 OK - Bekleyen emir başarıyla güncellendi.
5. Bekleyen Emri İptal Etme
Endpoint: DELETE /orders/{orderId}
Path Parameters:
orderId (string, required) - Emir ID'si
Authentication: Bearer Token gerekli
Response: 204 No Content - Emir iptal edildi, bloke bakiye iade edildi.
6. AI Portföy Raporu Almak
Endpoint: GET /ai/report/portfolio/{userId}
Path Parameters:
userId (string, required) - Kullanıcı ID'si
Authentication: Bearer Token gerekli
Response: 200 OK - AI portföy dağılımı ve risk analizi raporu döndürüldü.
