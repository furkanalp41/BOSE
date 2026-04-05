# Yakup Efe Çelebi'nin Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** `Link buraya eklenecek`

**1. Market Ana Ekranı**
* **API Endpoint:** `GET /market/assets`
* **Görev:** Uygulamanın ana ekranında tüm varlıkların listelenmesi.
* **UI Bileşenleri:** Arama çubuğu, fiyat ve 24 saatlik değişimi gösteren dinamik asset kartları, sparkline mini grafikler.
* **Kullanıcı Deneyimi:** Anlık veri akışı geldiğinde fiyatı artanların yeşil, düşenlerin kırmızı flash efektiyle parlayıp sönmesi.
* **Teknik Detaylar:** WebSocket (useMarketSocket hook) ile 2 saniyede bir canlı güncelleme. Yüksek performanslı render.

**2. Asset Detay Ekranı**
* **API Endpoint:** `GET /market/assets`
* **Görev:** Seçili asset'in detaylı fiyat bilgilerini gösteren ekran.
* **UI Bileşenleri:** Detaylı fiyat grafiği, 24h high/low bilgileri, drift ve volatility değerleri.

**3. Ticker Tape (Üst Kayan Bant)**
* **Görev:** Tüm asset'lerin fiyatlarının kayan bant halinde gösterimi.
* **UI Bileşenleri:** Marquee efektli fiyat bandı, yükselen/düşen renk kodları.

**4. WebSocket Durum Göstergesi**
* **Görev:** WebSocket bağlantı durumunun gösterimi.
* **UI Bileşenleri:** Connected (yeşil nokta), Disconnected (kırmızı nokta), Reconnecting (sarı nokta) durumları.

**5. Liderlik Tablosu Ekranı**
* **API Endpoint:** `GET /leaderboard/rankings`
* **Görev:** Global sıralama listesinin mobil arayüz tasarımı.
* **UI Bileşenleri:** Sıra, kullanıcı adı, toplam değer ve işlem sayısını içeren liste. Aktif kullanıcının satırının vurgulanması.
* **Kullanıcı Deneyimi:** Pull-to-refresh ile güncelleme.

**6. Başarım Rozetleri Ekranı**
* **API Endpoint:** `GET /leaderboard/achievements`
* **Görev:** Başarım rozetlerinin grid görünümle gösterimi.
* **UI Bileşenleri:** Her rozet için ikon, isim ve açıklama kartı. Grid layout.

**7. Admin Asset Yönetimi Ekranı**
* **API Endpoint:** `GET /admin/market/assets`, `POST /admin/market/assets`, `DELETE /admin/market/assets/:symbol`
* **Görev:** Admin panelinden asset ekleme ve silme arayüzü.
* **UI Bileşenleri:** Asset listesi, yeni asset formu (sembol, fiyat, drift, volatility inputları), "Piyasaya Ekle" butonu, swipe-to-delete ile asset silme.
* **Kullanıcı Deneyimi:** Sadece admin rolündeki hesaplarda görünür. Sembol büyük harfe zorlanır (auto-capitalize).
