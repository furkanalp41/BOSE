# Video Sunum

**Video Linki:** `Sunum videosu YouTube/Drive linki buraya eklenecek`

## Sunum Yapısı

### 1. Grup Lideri - Açılış Konuşması (1-2 dakika)

**Konuşma İçeriği:**
* Grup adının (UraniumZ) tanıtılması
* Projenin genel tanıtımı (AI Destekli Borsa ve Kripto Simülasyonu)
* Projenin amacı, kullanılan teknolojiler (Go, Kafka, Redis, Docker) ve kapsamı
* Sunumun yapısının kısaca açıklanması

**Örnek Konuşma:**
*"Merhaba, ben Furkan Alp Günay. UraniumZ ekibi olarak geliştirdiğimiz 'Yapay Zeka Destekli Borsa ve Kripto Simülasyonu' projemizin sunumuna hoş geldiniz. Bu projede, gerçek zamanlı piyasa verilerini Go, Kafka ve Redis altyapısıyla simüle ederek, kullanıcılara risk almadan yapay zeka destekli yatırım yapma ve algoritmik ticaret stratejilerini test etme imkanı sunuyoruz. Bugün sizlere mikroservis mimarisiyle geliştirdiğimiz bu güçlü altyapıyı ve arayüzü tanıtacağız. Şimdi sırasıyla her ekip arkadaşım kendini tanıtacak ve geliştirdiği modüllerin canlı demosunu yapacak."*

---

### 2. Ekip Üyeleri - Kişisel Tanıtım ve Gereksinim Sunumu

Her ekip üyesi sunumunu aşağıdaki formata göre (4-6 dakika) yapacaktır:

* **A) Kişisel Tanıtım (30-45 saniye):** Yüz görünecek şekilde kamera karşısında isim, ekipteki rol ve sorumlu olunan alan belirtilecek.
* **B) Gereksinim Sunumu (3.5-5 dakika):** Sorumlu olunan 6 gereksinimin kısa açıklaması ve ekran kaydı ile Postman/Arayüz üzerinden canlı demosu yapılacaktır. Her bir maddeye yaklaşık 1 dakika ayrılmalıdır.

---

### 3. Ekip Üyeleri Sunum Sırası ve Dağılımı

#### 1. Furkan Alp Günay
* **Rol:** Grup Lideri / Kullanıcı ve Hesap Yönetimi (Backend/Frontend)
* **Gereksinimler ve Demo Akışı:**
  1. **Üye Olma:** `POST /auth/register` (Kayıt ve başlangıç bakiyesi ataması gösterilecek)
  2. **Giriş Yapma:** `POST /auth/login` (JWT token alımı gösterilecek)
  3. **Profil Görüntüleme:** `GET /users/{userId}` (Bakiye ve bilgilerin çekilmesi)
  4. **Profil Güncelleme:** `PUT /users/{userId}` (Kullanıcı bilgilerinin değiştirilmesi)
  5. **Hesap Silme:** `DELETE /users/{userId}` (Hesabın sistemden temizlenmesi)
  6. **AI Analiz Tercihlerini Kaydetme:** `POST /users/{userId}/ai-preferences` (Risk profili seçimi)

#### 2. Enes Çoban
* **Rol:** İzleme Listesi Yönetimi (Backend/Frontend)
* **Gereksinimler ve Demo Akışı:**
  1. **İzleme Listesi Oluşturma:** `POST /watchlists`
  2. **Listeye Varlık Ekleme:** `POST /watchlists/{listId}/assets`
  3. **Listeleri Görüntüleme:** `GET /watchlists`
  4. **Listeden Varlık Çıkarma:** `DELETE /watchlists/{listId}/assets/{assetSymbol}`
  5. **Listeyi Silme:** `DELETE /watchlists/{listId}`
  6. **AI ile Varlık Önerisi Alma:** `GET /watchlists/ai-suggestions`

#### 3. Cem Karaca
* **Rol:** Alım-Satım ve Emir Yönetimi (Backend/Frontend)
* **Gereksinimler ve Demo Akışı:**
  1. **Piyasa Emri Oluşturma:** `POST /orders/market` (Anlık alım-satım)
  2. **Limit Emri Oluşturma:** `POST /orders/limit` (Hedef fiyatlı emir)
  3. **Açık Emirleri Listeleme:** `GET /orders/open`
  4. **Bekleyen Emri İptal Etme:** `DELETE /orders/{orderId}` (Bakiye iadesi)
  5. **İşlem Geçmişini Görüntüleme:** `GET /orders/history`
  6. **AI Otomatik Alım-Satım Emri Kurma:** `POST /orders/ai-bot`

#### 4. Salih Arda Katırcıoğlu
* **Rol:** Yapay Zeka Analiz ve Bildirim Servisleri (Backend/Frontend)
* **Gereksinimler ve Demo Akışı:**
  1. **Portföy Riskini Analiz Etme:** `GET /ai/report/portfolio/{userId}`
  2. **Varlık Durumunu Analiz Etme:** `GET /ai/report/status/{assetSymbol}`
  3. **Fiyat Alarmı Kurma:** `POST /alerts`
  4. **Fiyat Alarmını Güncelleme:** `PUT /alerts/{alertId}`
  5. **Fiyat Alarmını İptal Etme:** `DELETE /alerts/{alertId}`
  6. **Akıllı Asistan ile Sohbet:** `POST /ai/chat`

#### 5. Yakup Efe Çelebi
* **Rol:** Market Verileri ve Sistem Yönetimi (Backend/Frontend)
* **Gereksinimler ve Demo Akışı:**
  1. **Yeni Market Varlığı Ekleme:** `POST /market/assets`
  2. **Piyasa Verilerini Listeleme:** `GET /market/prices` (Redis üzerinden anlık akış)
  3. **Varlık Bilgilerini Güncelleme:** `PUT /market/assets/{assetId}`
  4. **Sistem Durumunu Kontrol Etme:** `GET /admin/health` (Kafka/Docker durumu)
  5. **AI Analiz Geçmişini Temizleme:** `DELETE /ai/history`
  6. **AI Piyasa Duyarlılığını Görüntüleme:** `GET /ai/market-sentiment`

---

### 4. Grup Lideri - Kapanış Konuşması (1 dakika)

**Konuşma İçeriği:**
* Tüm gereksinimlerin test edildiğinin ve başarıyla çalıştığının özeti.
* Projenin hedefine ulaştığının vurgulanması.

**Örnek Konuşma:**
*"Bugün sizlere UraniumZ ekibi olarak geliştirdiğimiz projemizin tüm fonksiyonlarını sunduk. Gördüğünüz gibi anlık veri akışı, yapay zeka entegrasyonları, emir yönetimleri ve kullanıcı servislerimiz mikroservis mimarisiyle sorunsuz bir şekilde çalışıyor. Ekip olarak finansal teknolojiler alanında gerçek piyasa dinamiklerine çok yakın bir laboratuvar ortamı inşa etmeyi başardık. Bizi dinlediğiniz için teşekkür ederiz."*

---

## Sunum Hazırlık Kontrol Listesi

### Genel Hazırlık
- [ ] Grup lideri açılış ve kapanış konuşmalarını hazırladı
- [ ] Her ekip üyesi kendi sunumunu ve ekran kayıtlarını hazırladı
- [ ] Tüm 30 gereksinim canlı ortamda / Postman'de çalışır durumda
- [ ] Demo senaryoları, sanal bakiyeler ve test hesapları hazırlandı

### Teknik Hazırlık
- [ ] Video kayıt cihazı / web kamerası hazır ve test edildi
- [ ] Mikrofon kalitesi test edildi (cızırtı/yankı yok)
- [ ] Işıklandırma yüzü net gösterecek şekilde ayarlandı
- [ ] Arka plan düzenlendi (profesyonel/sade bir görünüm)
- [ ] Ekran kayıt yazılımı (OBS vb.) kodları ve postman'i net gösterecek çözünürlükte ayarlandı

### Kişisel Hazırlık
- [ ] Her ekip üyesi kendi bölümünü süre tutarak prova etti
- [ ] Postman/Arayüz demo akışında yaşanabilecek gecikmelere karşı önlem alındı
- [ ] Anlatım sırasında teknik jargona boğmadan net açıklamalar çalışıldı

## Video Çekim Teknikleri ve Zaman Yönetimi

* **Kamera:** Omuz üstü çekim, göz teması kamerayla kurulmalı.
* **Ekran Kaydı:** Kodlar veya arayüz gösterilirken okunaklı olması için gerekirse zoom yapılmalı (Özellikle JSON yanıtları gösterilirken).
* **Zaman Çizelgesi (Hedef: 30-35 Dakika)**
  * Lider Açılış: 2 dk
  * Furkan Alp Günay Demo: 5 dk
  * Enes Çoban Demo: 5 dk
  * Cem Karaca Demo: 5 dk
  * Salih Arda Katırcıoğlu Demo: 5 dk
  * Yakup Efe Çelebi Demo: 5 dk
  * Lider Kapanış: 1 dk
