Alım/Satım Emri Oluşturma
API Metodu: POST /trading/order
Açıklama: Kullanıcının bir varlığı PriceEngine'den alınan anlık piyasa fiyatından almasını veya satmasını sağlar. İşlem anında gerçekleşir ve kullanıcının sanal bakiyesi güncellenir. Yeterli bakiyenin bulunması ve sisteme giriş yapılmış olması gerekir.

Açık Pozisyonları Listeleme
API Metodu: GET /trading/positions
Açıklama: Kullanıcının açık olan tüm pozisyonlarını, giriş fiyatı, güncel fiyat ve P&L (kâr/zarar) bilgileriyle listeler. Güvenlik için giriş yapmış olmak gerekir.

Pozisyon Kapatma
API Metodu: POST /trading/positions/:positionId/close
Açıklama: Açık bir pozisyonu güncel piyasa fiyatından kapatır. Kâr veya zarar kullanıcının bakiyesine yansıtılır. Güvenlik için giriş yapmış olmak gerekir.

İşlem Geçmişi
API Metodu: GET /trading/history
Açıklama: Kullanıcının geçmişte gerçekleştirdiği tüm alım-satım işlemlerinin detaylı dökümünü kronolojik olarak sunar. Hangi fiyattan, ne zaman işlem yapıldığı gösterilir. Güvenlik için giriş yapmış olmak gerekir.

Portföy Özeti
API Metodu: GET /trading/portfolio
Açıklama: Kullanıcının toplam portföy değeri, P&L (kâr/zarar), bakiye ve açık pozisyon sayısını özetler. Güvenlik için giriş yapmış olmak gerekir.

Admin Duyuru Oluşturma
API Metodu: POST /admin/announcements
Açıklama: Yönetici yetkisine sahip kullanıcıların sistem duyurusu oluşturmasını sağlar. Sadece admin rolü gerektirir.
