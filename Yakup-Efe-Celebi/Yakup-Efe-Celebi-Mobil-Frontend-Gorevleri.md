**1. Yeni Market Varlığı Ekleme Ekranı (Admin)**
* **API Endpoint:** `POST /market/assets`
* **Görev:** Admin paneli için yeni hisse/coin ekleme formu.
* **UI Bileşenleri:** Sembol inputu (Örn: AAPL), İsim inputu, Kategori (BİST/Kripto) seçici, "Piyasaya Ekle" butonu.
* **Form Validasyonu:** Sembollerin tamamı büyük harf olmaya zorlanmalı (Auto-capitalize).
* **Kullanıcı Deneyimi:** Sadece Yönetici rolündeki hesaplarda ayarlar menüsünde "Admin Paneli" sekmesinin görünür olması.

**2. Market Verilerini Listeleme (Ana Ekran)**
* **API Endpoint:** `GET /market/prices`
* **Görev:** Uygulamanın ana ekranında (Piyasalar) tüm varlıkların listelenmesi.
* **UI Bileşenleri:** Arama çubuğu, BİST ve Kripto arası geçiş (Tab/Segmented Control), Fiyatı ve 24s değişimi gösteren dinamik satırlar.
* **Kullanıcı Deneyimi:** Anlık veri akışı geldiğinde fiyatı artanların yeşil, düşenlerin kırmızı bir arka plan flaşıyla (Flash effect) saniyelik parlayıp sönmesi.
* **Teknik Detaylar:** Yüksek performanslı render (Recomposition optimizasyonu).

**3. Varlık Bilgilerini Güncelleme (Admin)**
* **API Endpoint:** `PUT /market/assets/{assetId}`
* **Görev:** Hisselerin işlem durumunu değiştirme arayüzü.
* **UI Bileşenleri:** Admin listesindeki hisseye tıklandığında açılan özellikler sayfası, "İşleme Açık/Kapalı" Switch butonu.

**4. Sistem Sağlık Durumu Görüntüleme (Admin)**
* **API Endpoint:** `GET /admin/health`
* **Görev:** Sunucu (Go/Kafka/Redis) altyapısının mobil cihazdan takibi.
* **UI Bileşenleri:** Servis adları (Kafka, Database) ve yanlarında yanıp sönen durum ikonları (Yeşil nokta = Aktif, Kırmızı nokta = Hata). Dashboard görünümü.

**5. Giriş Hareketlerini Listeleme Ekranı**
* **API Endpoint:** `GET /users/{userId}/logs`
* **Görev:** Kullanıcı profilindeki "Güvenlik Geçmişi" listesi.
* **UI Bileşenleri:** Tarih, Saat, IP adresi ve Cihaz bilgisini gösteren alt alta sıralanmış temiz bir liste arayüzü.
* **Kullanıcı Deneyimi:** Bilinmeyen bir cihazdan giriş yapılmışsa IP satırının rengini dikkat çekici (Sarı/Turuncu) yapma.

**6. AI Tahmin Geçmişini Temizleme Akışı (AI Görevi)**
* **API Endpoint:** `DELETE /ai/history`
* **Görev:** AI Chatbot ayarlarında geçmişi sıfırlama işlemi.
* **UI Bileşenleri:** Sohbet ekranının sağ üstündeki menüden "Sohbeti Temizle" seçeneği.
* **Kullanıcı Deneyimi:** Çift onaylı bir modal ("Tüm AI analiz geçmişiniz silinecek, emin misiniz?"). Silme başarılı olduğunda mesajlaşma ekranının anında boş (Empty state) hale gelmesi.
