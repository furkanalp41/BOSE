# Front-end Dokümantasyonu

**Front-end Test Videosu:** [Link buraya eklenecek](#)

---

## 1. Yeni İzleme Listesi Oluşturma Sayfası

**API Endpoint:** `POST /watchlists`

**Görev:**
Kullanıcının özel hisse/kripto klasörleri oluşturması için arayüz tasarımı.

*   **UI Bileşenleri:**
    *   Kenar çubuğunda (Sidebar) "Yeni Liste Ekle" butonu.
    *   Liste adı giriş modal'ı.
    *   "Oluştur" butonu.
*   **Form Validasyonu:**
    *   Liste adı boş olamaz.
    *   Liste adı 20 karakteri geçemez.
*   **Kullanıcı Deneyimi:**
    *   Oluşturulan liste sayfa yenilenmeden kenar çubuğuna eklenmelidir.
    *   Klavye "Enter" tuşu ile form gönderme (submit) desteği sağlanmalıdır.
*   **Teknik Detaylar:**
    *   Modal component state yönetimi.
    *   Sidebar component'i ile global state senkronizasyonu.

---

## 2. İzleme Listesine Varlık Ekleme Bileşeni

**API Endpoint:** `POST /watchlists/{listId}/assets`

**Görev:**
Piyasadan varlık aratıp listeye ekleme tasarımı.

*   **UI Bileşenleri:**
    *   Arama çubuğu (Search bar).
    *   Arama sonuçları dropdown listesi.
    *   Her sonucun yanında "+" ekle butonu.
*   **Kullanıcı Deneyimi:**
    *   Yazı yazarken anında filtreleme (Search Debounce).
    *   Eklendiğinde "+" ikonunun tik işaretine dönüşmesi.
*   **Teknik Detaylar:**
    *   Debounce hook kullanımı (API'yi yormamak için).
    *   Dropdown dışına tıklandığında menünün kapanması (click outside).

---

## 3. İzleme Listelerini Görüntüleme Sayfası

**API Endpoint:** `GET /watchlists`

**Görev:**
Takip edilen varlıkların detaylı tabloda gösterimi.

*   **UI Bileşenleri:**
    *   Liste isimleri arasında geçiş yapmayı sağlayan Tabs (Sekmeler).
    *   Sembol, Son Fiyat, 24s Değişim % sütunlarından oluşan Data Table.
    *   Yükselişler için yeşil, düşüşler için kırmızı metinler.
*   **Kullanıcı Deneyimi:**
    *   Fiyat değiştiğinde hücre arka planının yeşil/kırmızı parlayıp sönmesi (Flash effect).
    *   Veriler yüklenirken skeleton tablo görünümü.
*   **Teknik Detaylar:**
    *   WebSocket veya Polling verisinin tablo ile entegrasyonu.
    *   React Table veya benzeri grid kütüphanesi kullanımı.

---

## 4. Liste Adı Güncelleme Etkileşimi

**API Endpoint:** `PUT /watchlists/{listId}`

**Görev:**
Mevcut liste adını düzenleme etkileşimi.

*   **UI Bileşenleri:**
    *   Liste başlığının yanında beliren "Kalem" (Edit) ikonu.
    *   İkona tıklandığında başlığın input alanına dönüşmesi (Inline editing).
*   **Kullanıcı Deneyimi:**
    *   Input dışına tıklandığında (blur) değişikliğin otomatik kaydedilmesi.
    *   Hata olursa eski isme geri dönülmesi.
*   **Teknik Detaylar:**
    *   Inline edit state yönetimi (isEditing boolean).

---

## 5. İzleme Listesini Silme Akışı

**API Endpoint:** `DELETE /watchlists/{listId}`

**Görev:**
İzleme listesini tamamen kaldırma UI akışı.

*   **UI Bileşenleri:**
    *   Sekme veya menü içinde "Listeyi Sil" butonu (Çöp kutusu ikonu).
    *   Silme onayı isteyen uyarı Modal'ı.
*   **Kullanıcı Deneyimi:**
    *   Silme işlemi sonrası kullanıcının otomatik olarak "Varsayılan" listeye yönlendirilmesi.
*   **Teknik Detaylar:**
    *   Active Tab state'inin silinme sonrası güncellenmesi.

---

## 6. AI Durum Raporu Görüntüleme Sayfası

**API Endpoint:** `GET /ai/report/status/{assetSymbol}`

**Görev:**
Bir hisseye tıklandığında sağ panelde açılan yapay zeka analiz özeti.

*   **UI Bileşenleri:**
    *   Slide-over (sağdan açılan) panel veya Modal.
    *   AI "AL/SAT/TUT" tavsiyesini gösteren hız göstergesi (Gauge chart).
    *   Yapay zeka analiz metni alanı.
*   **Kullanıcı Deneyimi:**
    *   AI metninin daktilo efektiyle (typewriter) ekrana yazdırılması.
*   **Teknik Detaylar:**
    *   Chart.js veya Recharts ile Gauge grafik entegrasyonu.
    *   Asenkron AI yanıtı için özel yükleme (loading) animasyonu.