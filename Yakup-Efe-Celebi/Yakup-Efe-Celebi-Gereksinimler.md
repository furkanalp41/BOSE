Market Varlıklarını Listeleme
API Metodu: GET /market/assets
Açıklama: Sistemde mevcut tüm varlıkları ve anlık fiyat bilgilerini listeler. Herkese açıktır.

Admin Market Varlıklarını Listeleme
API Metodu: GET /admin/market/assets
Açıklama: Adminlerin tüm market varlıklarını düzenlemek üzere görebileceği daha detaylı liste görünümü. Güvenlik için admin yetkisi gerektirir.

Yeni Market Varlığı Ekleme
API Metodu: POST /admin/market/assets
Açıklama: Sistem yöneticilerinin platformda alınıp satılabilmesi için yeni bir varlığı (Hisse/Kripto vb.) sisteme tanımlamasını sağlar.

Varlık Bilgilerini Güncelleme
API Metodu: PUT /admin/market/assets/{symbol}
Açıklama: Sistemdeki bir varlığın adını veya genel bilgilerini günceller. Güvenlik için admin yetkisi gerektirir.

Market Varlığı Silme
API Metodu: DELETE /admin/market/assets/{symbol}
Açıklama: Belirli bir varlığın sistemden kalıcı olarak çıkarılmasını sağlar. Güvenlik için admin yetkisi gerektirir.

Liderlik Tablosu Görüntüleme
API Metodu: GET /leaderboard/rankings
Açıklama: Tüm kullanıcıları toplam portföy değerine göre sıralayarak listeler. Böylece turnuva formatında yarışma desteklenir. Güvenlik için giriş yapmış olmak gerekir.

Başarımları Görüntüleme
API Metodu: GET /leaderboard/achievements
Açıklama: Kullanıcının kazandığı başarım rozetlerini listeler (Örn: "İlk İşlem", "Balina" vb.). Güvenlik için giriş yapmış olmak gerekir.
