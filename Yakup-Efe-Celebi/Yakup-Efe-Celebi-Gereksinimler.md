Piyasa Verilerini Listeleme
API Metodu: GET /market/assets
Açıklama: PriceEngine'den tüm varlıkların anlık fiyat bilgilerini, 24 saatlik değişim oranlarını ve volatilite verilerini listeler. Platformun ana veri akışını besler. Bu özellik genel piyasa takibi için halka açık olarak çalışabilir, token gerektirmez.

Liderlik Tablosu
API Metodu: GET /leaderboard/rankings
Açıklama: Tüm kullanıcıların toplam portföy değerine g��re global sıralamasını getirir. Güvenlik için giriş yapmış olmak gerekir.

Kullanıcı Sıralaması
API Metodu: GET /leaderboard/user/:userId
Açıklama: Belirli bir kullanıcının sıralama bilgilerini (rank, toplam değer, işlem sayısı) getirir. Güvenlik için giriş yapmış olmak gerekir.

Başarımlar
API Metodu: GET /leaderboard/achievements
Açıklama: Sistemde tanımlı başarım rozetlerini listeler. Başarımlar seed data olarak otomatik oluşturulur. Güvenlik için giriş yapmış olmak gerekir.

Admin Asset Listesi
API Metodu: GET /admin/market/assets
Açıklama: Yönetici yetkisine sahip kullanıcıların tüm market asset'lerini detaylı olarak listelemesini sağlar. Sadece admin rolü gerektirir.

Admin Asset Ekleme
API Metodu: POST /admin/market/assets
Açıklama: Sistem yöneticilerinin platformda alınıp satılabilmesi için yeni bir hisse veya kripto para çiftini sisteme tanımlamasını sağlar. Sembol, fiyat, drift ve volatility parametreleri alınır. Sadece admin rolü gerektirir.

Admin Asset Silme
API Metodu: DELETE /admin/market/assets/:symbol
Açıklama: Belirli bir asset'i PriceEngine'den ve sistemden kalıcı olarak kaldırır. Sadece admin rolü gerektirir.
