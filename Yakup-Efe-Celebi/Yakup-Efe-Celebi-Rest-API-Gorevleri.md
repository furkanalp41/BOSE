  Yeni Market Varlığı Ekleme
Endpoint: POST /market/assets Request Body:{ "symbol": "ASELS", "name": "Aselsan Elektronik", "type": "BIST" }  ```

Authentication: Bearer Token gerekli (Sadece Admin yetkisi) Response: 201 Created - Yeni varlık piyasa sistemine başarıyla eklendi 2. Market Verilerini Listeleme

Endpoint: GET /market/prices Query Parameters: type (string, optional) - Varlık türü (BIST, CRYPTO) Response: 200 OK - Varlıkların anlık verileri Redis'ten getirildi 3. Varlık Bilgilerini Güncelleme

Endpoint: PUT /market/assets/{assetId} Path Parameters: assetId (string, required) - Varlık ID'si Request Body:```json{ "isActive": false, "description": "Tahta geçici olarak kapatılmıştır." }  ```

Authentication: Bearer Token gerekli (Sadece Admin yetkisi) Response: 200 OK - Varlık bilgileri güncellendi 4. Sistem Sağlık Durumu Görüntüleme

Endpoint: GET /admin/health Authentication: Bearer Token gerekli (Sadece Admin yetkisi) Response: 200 OK - Docker, Kafka ve Redis servislerinin güncel durum raporu döndürüldü 5. Giriş Hareketlerini Listeleme

Endpoint: GET /users/{userId}/logs Path Parameters: userId (string, required) - Kullanıcı ID'si Authentication: Bearer Token gerekli Response: 200 OK - Son giriş yapılan IP ve cihaz bilgileri listelendi 6. AI Tahmin Geçmişini Temizleme

Endpoint: DELETE /ai/history Authentication: Bearer Token gerekli Response: 204 No Content - Kullanıcının AI sohbet geçmişi kalıcı olarak silindi 

