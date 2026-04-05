# Yakup Efe Çelebi'nin REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](#)

### 1. Piyasa Verilerini Listeleme

* **Endpoint:** `GET /market/assets`

Authentication: Gerekmiyor (public endpoint)

Response: 200 OK - Tüm varlıkların anlık fiyat, 24h değişim, drift ve volatility verileri döndürüldü. Default assets: BTC, ETH, SOL, THYAO, ASELS, AAPL, NVDA, GOOGL.

2. Liderlik Tablosu
Endpoint: GET /leaderboard/rankings

Authentication: Bearer Token gerekli

Response: 200 OK - Global sıralama (user_id, full_name, total_value, rank, trade_count) listelendi.

3. Kullanıcı Sıralaması
Endpoint: GET /leaderboard/user/:userId

Path Parameters:
userId (integer, required) - Kullanıcı ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - Kullanıcının sıralama bilgileri döndürüldü.

4. Başarımlar
Endpoint: GET /leaderboard/achievements

Authentication: Bearer Token gerekli

Response: 200 OK - Başarım listesi (id, name, description, icon) döndürüldü.

5. Admin Asset Listesi
Endpoint: GET /admin/market/assets

Authentication: Bearer Token gerekli (Admin rolü)

Response: 200 OK - Tüm asset'ler detaylı olarak listelendi.

6. Admin Asset Ekleme
Endpoint: POST /admin/market/assets

Request Body:
```json
{
  "symbol": "TSLA",
  "price": 245.50,
  "drift": 0.0001,
  "volatility": 0.0015
}
```

Authentication: Bearer Token gerekli (Admin rolü)

Response: 201 Created - Yeni asset piyasa sistemine başarıyla eklendi.

7. Admin Asset Silme
Endpoint: DELETE /admin/market/assets/:symbol

Path Parameters:
symbol (string, required) - Asset sembolü (örn: TSLA)

Authentication: Bearer Token gerekli (Admin rolü)

Response: 200 OK - Asset sistemden kaldırıldı.
