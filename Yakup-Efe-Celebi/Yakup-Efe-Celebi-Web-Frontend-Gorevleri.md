Yakup Efe Çelebi'nin Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Market Varlıklarını Listeleme Sayfası (Piyasalar)
API Endpoint: GET /market/assets
Görev: Canlı fiyatların listelendiği Piyasalar arayüzünün tasarımı
UI Bileşenleri: Hisseler / Kriptolar gibi kırılımlar, Arama filtresi
Teknik Detaylar: WebSocket ile sürekli güncellenen satırlar

Admin Market Varlıklarını Listeleme
API Endpoint: GET /admin/market/assets
Görev: Adminlerin varlıkları listeleyip üzerilerinde işlem yapacağı dashboard arayüzü
UI Bileşenleri: Data-Table (Datagrid) yapısı ile tüm verilerin toplu gösterimi

Yeni Market Varlığı Ekleme Ekranı
API Endpoint: POST /admin/market/assets
Görev: Admin kullanıcıların yeni asset eklemesi için form tasarımı

Varlık Bilgilerini Güncelleme Sayfası
API Endpoint: PUT /admin/market/assets/{symbol}
Görev: Adminlerin varlık bilgilerini değiştirebileceği edit form yüzü

Market Varlığı Silme Akışı
API Endpoint: DELETE /admin/market/assets/{symbol}
Görev: Tehlikeli işlemi uyarmak üzere tasarlanmış modal ekranı tasarımı

Liderlik Tablosu (Leaderboard) Ekranı
API Endpoint: GET /leaderboard/rankings
Görev: Kullanıcıların rekabet ettiği turnuva panosunun, birincileri görsel olarak ödüllendiren (özel çerçeve vb.) tasarımı

Başarımları Görüntüleme Göstergesi
API Endpoint: GET /leaderboard/achievements
Görev: Kullanıcı profilinde "kazanılmış rozetlerin" sergilendiği, gamification arayüz tasarımı
