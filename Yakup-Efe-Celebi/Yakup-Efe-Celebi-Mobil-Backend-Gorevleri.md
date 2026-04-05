# Yakup Efe Çelebi'nin Mobil Backend Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. Piyasa Verilerini Listeleme**
* **API Endpoint:** `GET /market/assets`
* **Görev:** Tüm varlıkların anlık fiyatlarını ve değişim oranlarını PriceEngine'den çekip arayüze basma.
* **İşlevler:**
  * Ana sayfada "Piyasa" ekranını sürekli güncel tutma.
  * Fiyat değiştiğinde yeşil/kırmızı yanıp sönme animasyonu için arayüzü uyarma.
* **Teknik Detaylar:**
  * WebSocket (wss://bose-platform.onrender.com/ws/market) ile gerçek zamanlı bağlantı yönetimi (2 saniye tick aralığı).
  * JSON parser optimizasyonu.

**2. Liderlik Tablosu**
* **API Endpoint:** `GET /leaderboard/rankings`
* **Görev:** Global sıralama verilerini çekip listeleme.
* **İşlevler:**
  * Sıralama listesini çekme ve gösterme.
  * Pull-to-refresh ile güncelleme.
* **Teknik Detaylar:**
  * JWT Token ile authorization sağlanması.

**3. Kullanıcı Sıralaması**
* **API Endpoint:** `GET /leaderboard/user/:userId`
* **Görev:** Kullanıcının kendi sıralama bilgisini alma.
* **İşlevler:**
  * Profil ekranında sıralama bilgisini gösterme.

**4. Başarımlar**
* **API Endpoint:** `GET /leaderboard/achievements`
* **Görev:** Başarım listesini çekme ve grid'e yerleştirme.
* **İşlevler:**
  * Rozet verilerini parse ederek kartlara yerleştirme.

**5. Admin Asset Listesi**
* **API Endpoint:** `GET /admin/market/assets`
* **Görev:** Admin ekranında tüm asset'leri listeleme.
* **İşlevler:**
  * Asset listesini çekme ve admin arayüzünde gösterme.
* **Teknik Detaylar:**
  * 403 Forbidden hata yönetimi (admin değilse erişim engeli).

**6. Admin Asset Ekleme**
* **API Endpoint:** `POST /admin/market/assets`
* **Görev:** Yönetici panelinden sisteme yeni asset tanımlama.
* **İşlevler:**
  * Sembol, fiyat, drift ve volatility form verilerini toplayıp API'ye iletme.
  * Form validasyonu (sembol büyük harfe zorlanır).
* **Teknik Detaylar:**
  * Admin rolü kontrolü.

**7. Admin Asset Silme**
* **API Endpoint:** `DELETE /admin/market/assets/:symbol`
* **Görev:** Bir asset'i PriceEngine'den ve sistemden kaldırma.
* **İşlevler:**
  * Onay dialog'u gösterme ve silme isteğini gönderme.
