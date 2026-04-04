**1. Yeni Market Varlığı Ekleme (Admin)**
* **API Endpoint:** `POST /market/assets`
* **Görev:** Yönetici paneli (Admin) üzerinden sisteme yeni hisse veya coin tanımlama.
* **İşlevler:**
  * Yönetici arayüzünden form verilerini (Sembol, Ad, Kategori) toplayıp API'ye iletme.
  * Form validasyonu.
* **Teknik Detaylar:**
  * Yetkisiz bir kullanıcı bu uç noktaya ulaştığında dönen `403 Forbidden` hatasını yönetme.

**2. Market Verilerini Listeleme**
* **API Endpoint:** `GET /market/prices`
* **Görev:** Tüm varlıkların anlık fiyatlarını ve % değişimlerini Redis üzerinden çekip arayüze basma.
* **İşlevler:**
  * Ana sayfada "Piyasa" ekranını sürekli güncel tutma.
  * Fiyat değiştiğinde yeşil/kırmızı yanıp sönme animasyonu için arayüzü uyarma.
* **Teknik Detaylar:**
  * REST API ile Polling (her 3-5 saniyede bir istek atma) veya WebSocket (gerçek zamanlı bağlantı) yönetimi.
  * JSON parser optimizasyonu (Çok sayıda varlık verisi geleceği için cihazı yormama).

**3. Varlık Bilgilerini Güncelleme (Admin)**
* **API Endpoint:** `PUT /market/assets/{assetId}`
* **Görev:** Bir varlığın açıklamasını veya işlem (tahta) durumunu yönetici olarak güncelleme.
* **İşlevler:**
  * Varlık detay düzenleme ekranından değişen verileri API'ye gönderme.
* **Teknik Detaylar:**
  * `Authorization: Bearer {token}` yönetimi ve Admin Rolü kontrolü.

**4. Sistem Sağlık Durumu Görüntüleme**
* **API Endpoint:** `GET /admin/health`
* **Görev:** Mobil uygulamanın gizli veya admin ekranında sistem durumunu gösterme.
* **İşlevler:**
  * Docker, Kafka ve Redis servislerinin "UP" veya "DOWN" durumlarını ekrana basma.
* **Teknik Detaylar:**
  * JSON'daki servis durumlarını okuyup yeşil/kırmızı ikonlarla eşleştirme.

**5. Giriş Hareketlerini Listeleme**
* **API Endpoint:** `GET /users/{userId}/logs`
* **Görev:** Kullanıcının hesaba giriş loglarını siber güvenlik menüsünde listeleme.
* **İşlevler:**
  * Profil -> Güvenlik sekmesinden API'ye istek atarak IP ve Tarih verilerini listeleme.
* **Teknik Detaylar:**
  * Tarih formatlarını (ISO 8601) mobil cihazın yerel saat dilimine (Local Timezone) çevirme.

**6. AI Tahmin Geçmişini Temizleme**
* **API Endpoint:** `DELETE /ai/history`
* **Görev:** Yapay zeka asistanıyla yapılan sohbet ve analiz geçmişini silme işlemi.
* **İşlevler:**
  * Profil -> Ayarlar sekmesinde "Sohbet Geçmişini Temizle" butonuna tıklandığında işlemi iletme.
  * İşlem sonrası yerel arayüzdeki mesaj listesini (cache) sıfırlama.
* **Teknik Detaylar:**
  * Destructive action için (Yıkıcı işlem) onay penceresi entegrasyonu.
