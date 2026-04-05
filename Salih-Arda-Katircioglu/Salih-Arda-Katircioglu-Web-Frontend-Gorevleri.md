Salih Arda Katırcıoğlu'nun Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Watchlist Manager (WatchlistManager.jsx)

API Endpoint: POST /watchlist/, GET /watchlist/, DELETE /watchlist/:id, POST /watchlist/:id/items, DELETE /watchlist/:id/items/:itemId
Görev: İzleme listesi CRUD işlemleri ve canlı fiyat gösterimli arayüz tasarımı
UI Bileşenleri:
Yeni liste oluşturma butonu ve isim girişi
Sembol ekleme dropdown'ı (PriceEngine'deki asset'lerden öneriler)
Her sembol için canlı fiyat ve 24h değişim gösterimi (grid layout)
Listeden sembol çıkarma ikonu
Liste silme butonu (onay dialog'u ile)
Ortalama değişim istatistikleri (watchlist bazında)
Kullanıcı Deneyimi:
Canlı fiyatlar marketApi ile 10 saniyede bir yenilenir
Yükselen yeşil, düşen kırmızı renk kodlaması
Sembol eklerken arama ve filtreleme
Teknik Detaylar:
marketApi entegrasyonu (fiyat çekme)
WebSocket ile canlı fiyat güncellemesi
Framer Motion animasyonları

Alerts Manager (AlertsManager.jsx)

API Endpoint: POST /watchlist/alerts, GET /watchlist/alerts, DELETE /watchlist/alerts/:alertId, GET /watchlist/alerts/triggered
Görev: Fiyat alarmı oluşturma ve yönetim arayüzü tasarımı
UI Bileşenleri:
Sembol seçimi dropdown (PriceEngine asset'leri)
Hedef fiyat input alanı
ABOVE/BELOW koşul seçimi
Güncel fiyat vs hedef fiyat karşılaştırması
Progress bar: hedefe yakınlık göstergesi (animasyonlu, Framer Motion)
Mesafe etiketi ("5.3% uzakta", "Hedefe ulaşıldı!")
Fiyat bağlam ipucu ("BTC güncel fiyattan %5.3 yükseldiğinde alarm")
Alarm silme butonu
Tetiklenen alarmlar bölümü
Kullanıcı Deneyimi:
Alarm oluşturmada anlık fiyatın otomatik gösterimi
Başarılı kayıtta toast mesajı
Tetiklenen alarmlar polling ile güncellenir
Teknik Detaylar:
marketApi ile güncel fiyat çekme
Progress bar hesaplama: abs(currentPrice - targetPrice) / targetPrice
