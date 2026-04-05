Yakup Efe Çelebi'nin Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Asset Card (AssetCard.jsx)

API Endpoint: GET /market/assets
Görev: Tek asset kartı tasarımı (fiyat, değişim, sparkline grafik)
UI Bileşenleri:
Sembol adı ve fiyat gösterimi
24 saatlik değişim yüzdesi
Sparkline mini grafik
Karta tıklandığında DetailPanel açılır
Kullanıcı Deneyimi:
Yükselen yeşil, düşen kırmızı renk kodlaması
Fiyat güncellendiğinde flash efekti
Teknik Detaylar:
WebSocket (useMarketSocket hook) ile 2 saniyede bir canlı fiyat güncellemesi

Detail Panel (DetailPanel.jsx)

API Endpoint: GET /market/assets
Görev: Seçili asset detay paneli tasarımı
UI Bileşenleri:
Detaylı fiyat grafigi
24h high/low bilgileri
Drift ve volatility değerleri
Slide-over panel tasarımı
Kullanıcı Deneyimi:
Kart tıklandığında sağdan açılan panel

Ticker Tape (TickerTape.jsx)

Görev: Üst kayan fiyat bandı (marquee efekti)
UI Bileşenleri:
Tüm asset'lerin fiyatlarının kayan bant halinde gösterimi
Yükselen/düşen renk kodları
Teknik Detaylar:
WebSocket ile canlı veri akışı

Status Bar (StatusBar.jsx)

Görev: WebSocket bağlantı durumu göstergesi
UI Bileşenleri:
Connected (yeşil), Disconnected (kırmızı), Reconnecting (sarı) durumları
Bağlantı durumu ikonu

Rank Table (RankTable.jsx)

API Endpoint: GET /leaderboard/rankings
Görev: Liderlik tablosu sıralama tablosu tasarımı
UI Bileşenleri:
Sıra, kullanıcı adı, toplam değer ve işlem sayısı sütunları
Aktif kullanıcının satırının vurgulanması
Kullanıcı Deneyimi:
Tablo yüklenirken skeleton gösterimi

Badge Display (BadgeDisplay.jsx)

API Endpoint: GET /leaderboard/achievements
Görev: Başarım rozetleri grid gösterimi
UI Bileşenleri:
Her rozet için ikon ve açıklama kartı
Grid layout gösterimi
