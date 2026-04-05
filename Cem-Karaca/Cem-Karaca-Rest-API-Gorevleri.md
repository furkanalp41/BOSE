# Cem Karaca'nın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](#)

### 11. Emir Oluşturma

* **Endpoint:** `POST /api/v1/trading/order`
* **Request Body:**

  ```json
  {
    "symbol": "BTC",
    "side": "BUY",
    "quantity": 0.5
  }
  ```

Authentication: Bearer Token gerekli
Response: 201 Created - Anlık piyasa emri gerçekleşti.
12. Açık Pozisyonları Listeleme
Endpoint: GET /api/v1/trading/positions
Authentication: Bearer Token gerekli
Response: 200 OK - Tüm açık pozisyonlar ve detayları listelendi.
13. Pozisyon Kapatma
Endpoint: POST /api/v1/trading/positions/{positionId}/close
Path Parameters:
positionId (integer, required) - Pozisyon ID'si
Authentication: Bearer Token gerekli
Response: 200 OK - Pozisyon kapatıldı.
14. İşlem Geçmişini Görüntüleme
Endpoint: GET /api/v1/trading/history
Authentication: Bearer Token gerekli
Response: 200 OK - İşlem geçmişi listelendi.
15. Portföy Özeti Görüntüleme
Endpoint: GET /api/v1/trading/portfolio
Authentication: Bearer Token gerekli
Response: 200 OK - Portföy bakiye ve pozisyon özeti döndürüldü.
16. Duyuru Oluşturma
Endpoint: POST /api/v1/admin/announcements
Request Body:

```json
{
  "title": "Sistem Bakımı",
  "content": "Sistemimiz bu gece bakıma alınacaktır."
}
```

Authentication: Bearer Token gerekli (Admin)
Response: 201 Created - Duyuru başarıyla oluşturuldu.
