# Cem Karaca'nın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](#)

### 1. Alım/Satım Emri Oluşturma

* **Endpoint:** `POST /trading/order`
* **Request Body:**

  ```json
  {
    "symbol": "BTC",
    "side": "BUY",
    "quantity": 0.01
  }
  ```

Authentication: Bearer Token gerekli

Response: 201 Created - Emir gerçekleşti, trade bilgileri (id, symbol, side, quantity, price, total) döndürüldü.

2. Açık Pozisyonları Listeleme
Endpoint: GET /trading/positions

Authentication: Bearer Token gerekli

Response: 200 OK - Açık pozisyonlar listelendi (symbol, entry_price, current_price, pnl, is_open).

3. Pozisyon Kapatma
Endpoint: POST /trading/positions/:positionId/close

Path Parameters:
positionId (integer, required) - Pozisyon ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - Pozisyon kapatıldı, kâr/zarar bakiyeye yansıtıldı.

4. İşlem Geçmişi
Endpoint: GET /trading/history

Authentication: Bearer Token gerekli

Response: 200 OK - Tüm trade'ler kronolojik olarak listelendi.

5. Portföy Özeti
Endpoint: GET /trading/portfolio

Authentication: Bearer Token gerekli

Response: 200 OK - Portföy özeti (balance, total_value, total_pnl, position_count) döndürüldü.

6. Admin Duyuru Oluşturma
Endpoint: POST /admin/announcements

Request Body:
```json
{
  "message": "Sistem bakımda!"
}
```

Authentication: Bearer Token gerekli (Admin rolü)

Response: 201 Created - Sistem duyurusu oluşturuldu.
