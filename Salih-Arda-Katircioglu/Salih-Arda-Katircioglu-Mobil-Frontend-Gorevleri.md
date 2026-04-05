# Salih Arda Katırcıoğlu'nun Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** `Link buraya eklenecek`

**1. Watchlist Ana Ekranı**
* **API Endpoint:** `GET /watchlist/`
* **Görev:** İzleme listelerinin canlı fiyatlarla gösterildiği ana ekran.
* **UI Bileşenleri:** Üstte liste isimlerini içeren kaydırılabilir TabBar, altta sembol, anlık fiyat ve günlük % değişim kartları.
* **Kullanıcı Deneyimi:** Yükselen yeşil, düşen kırmızı gösterim. Fiyat değiştiğinde flash efekti. Pull-to-refresh.
* **Teknik Detaylar:** LazyColumn ile performanslı render.

**2. Sembol Ekleme Arama Ekranı**
* **API Endpoint:** `POST /watchlist/:id/items`
* **Görev:** Piyasadan sembol aratıp listeye ekleme tasarımı.
* **UI Bileşenleri:** Üstte Search Bar, altında arama sonuçlarını listeleyen RecyclerView/List, her satırda "+" (Ekle) ikonu.
* **Kullanıcı Deneyimi:** Yazı yazarken anında filtreleme (debounce), eklendiğinde "+" ikonunun tik ikonuna dönüşmesi.

**3. Liste Oluşturma / Silme**
* **API Endpoint:** `POST /watchlist/`, `DELETE /watchlist/:id`
* **Görev:** Yeni liste oluşturma ve mevcut listeyi silme akışları.
* **UI Bileşenleri:** Liste adı için Text Input barındıran Modal, "Oluştur" butonu. Silme onay dialog'u.
* **Kullanıcı Deneyimi:** Klavye açıldığında Modal'ın yukarı kayması (Keyboard Avoiding View). Silme uyarısı: "Tüm sembol takipleri silinecek, emin misiniz?"

**4. Alert Oluşturma Ekranı**
* **API Endpoint:** `POST /watchlist/alerts`
* **Görev:** Fiyat alarmı kurma form arayüzü.
* **UI Bileşenleri:** Sembol dropdown seçimi, hedef fiyat inputu (sayısal klavye), ABOVE/BELOW segmented control, güncel fiyat gösterimi.
* **Kullanıcı Deneyimi:** Sembol seçildiğinde anlık fiyatın otomatik gösterilmesi. Hedefe mesafe bilgisi.

**5. Alert Listesi Ekranı**
* **API Endpoint:** `GET /watchlist/alerts`, `DELETE /watchlist/alerts/:alertId`
* **Görev:** Aktif alarmlar listesi ve yönetimi.
* **UI Bileşenleri:** Her alarm için progress bar (hedefe yakınlık), sembol, hedef fiyat ve koşul bilgisi.
* **Kullanıcı Deneyimi:** Swipe-to-delete ile alarm silme. Progress bar animasyonu.

**6. Tetiklenen Alarmlar Ekranı**
* **API Endpoint:** `GET /watchlist/alerts/triggered`
* **Görev:** Tetiklenen alarm bildirimlerinin gösterildiği ekran.
* **UI Bileşenleri:** Tetiklenen alarm kartları (sembol, hedef fiyat, tetiklenme fiyatı, tarih).
* **Kullanıcı Deneyimi:** Deep linking ile alarm detayına gitme.
