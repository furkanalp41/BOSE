# Mobil Backend (REST API Bağlantısı) Görev Dağılımı

**REST API Adresi:** `api.simulasyon.com` *(Canlıya alındığında güncellenecek)*

Bu dokümanda, AI Destekli Borsa ve Kripto Simülasyonu mobil uygulamasının, Go mimarisiyle yazılmış REST API ve mikroservisler ile iletişimini sağlayan backend entegrasyon görevleri listelenmektedir. Her grup üyesi (UraniumZ ekibi), kendisine atanan API endpoint'lerinin mobil uygulamadan çağrılması, veri akışının sağlanması ve durum yönetiminden (state management) sorumludur.

## Grup Üyelerinin Mobil Backend Görevleri

1. [Furkan Alp Günay'ın Mobil Backend Görevleri](./Furkan-Alp-Gunay/Furkan-Alp-Gunay-Mobil-Backend-Gorevleri.md)
2. [Enes Çoban'ın Mobil Backend Görevleri](./Enes-Coban/Enes-Coban-Mobil-Backend-Gorevleri.md)
3. [Cem Karaca'ın Mobil Backend Görevleri](./Cem-Karaca/Cem-Karaca-Mobil-Backend-Gorevleri.md)
4. [Salih Arda Katırcıoğlu'nun Mobil Backend Görevleri](./Salih-Arda-Katircioglu/Salih-Arda-Katircioglu-Mobil-Backend-Gorevleri.md)
5. [Yakup Efe Çelebi'nin Mobil Backend Görevleri](./Yakup-Efe-Celebi/Yakup-Efe-Celebi-Mobil-Backend-Gorevleri.md)

---

## Genel Mobil Backend Prensipleri

**1. HTTP Client ve WebSocket Yapılandırması**
* **Base URL:** `https://api.simulasyon.com/v1`
* **Gerçek Zamanlı Veri (WebSocket/SSE):** Borsa ve kripto anlık fiyat akışları için Kafka ve Redis destekli WebSocket bağlantılarının yönetimi.
* **Timeout:** Request timeout 30 saniye, connect timeout 10 saniye (Kritik alım-satım işlemleri için optimize edilmelidir).
* **Headers:**
    * `Content-Type: application/json`
    * `Authorization: Bearer {token}` (Kimlik doğrulama gerektiren endpoint'lerde)

**2. Authentication (Kimlik Doğrulama) Yönetimi**
* JWT (JSON Web Token) verilerini cihazın güvenli depolama alanında (Secure Storage / Keychain) saklama.
* Token refresh mekanizması implementasyonu (Oturumun aniden kapanmasını önlemek için).
* 401 Unauthorized durumunda otomatik token yenileme.
* Kullanıcı çıkış (Logout) yaptığında veya hesap silindiğinde cihazdaki token'ları temizleme.

**3. Error Handling (Hata Yönetimi)**
* Network hataları (timeout, connection error) durumunda kullanıcıya anlaşılır uyarılar çıkarma.
* HTTP status kodlarına (400, 404, 500 vb.) göre uygun hata mesajları gösterme (Örn: "Yetersiz bakiye", "Piyasa kapalı").
* Kritik olmayan GET istekleri için Retry (yeniden deneme) mekanizması.
* Kullanıcının interneti kesildiğinde (Offline durum) uygulamanın çökmesini engelleyen durum yönetimi.

**4. Caching (Önbellekleme) Stratejisi**
* Yapay zeka portföy raporları ve geçmiş işlem dökümleri (GET istekleri) için response caching kullanımı.
* Kullanıcı yeni bir işlem yaptığında (PUT/POST/DELETE sonrası) ilgili önbelleğin (cache invalidation) temizlenmesi.
* Mümkün olan ekranlarda offline-first yaklaşımı ile Redis'ten gelen son verilerin gösterimi.

**5. Loading States (Yükleme Durumları)**
* Alım-satım emri gönderildiğinde veya AI analizi beklenirken request başlangıcında loading indicator (yükleniyor animasyonu) gösterme.
* Başarılı (Örn: "Emir gerçekleşti") veya başarısız durum bildirimlerini (Toast/Snackbar) anında yansıtma.
* Kullanıcı deneyimini (UX) hızlandırmak için Optimistic Updates (sunucu cevabını beklemeden arayüzü güncelleme) kullanımı.

**6. Logging ve Debugging (Kayıt ve Hata Ayıklama)**
* Development (geliştirme) modunda API request ve response loglarının (Interceptor aracılığıyla) konsola yazdırılması.
* Uygulama çökmeleri ve tespit edilemeyen API hataları için Error Logging ve Crash Reporting entegrasyonu.
