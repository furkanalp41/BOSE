# Front-end Dokümantasyonu

**Front-end Test Videosu:** [Link buraya eklenecek](#)

---

## 26. AI Yatırım Tavsiyesi Ekranı

**API Endpoint:** `POST /ai/advice`

**Görev:**
Varlık detay sayfasında AI destekli al/sat tavsiyesinin gösterilmesi.

*   **UI Bileşenleri:**
    *   Tavsiyeyi (AL/SAT/TUT) belirten renkli butonlar veya indikatör.
    *   AI analiz özeti için metin alanı.
*   **Kullanıcı Deneyimi:**
    *   Analiz isteği gönderildiğinde loading spinner gösterilir.
*   **Teknik Detaylar:**
    *   Axios ile POST isteği yapılıp sonucun anlık State'e kaydedilmesi.

---

## 27. AI Portföy Raporu Dashboard'u

**API Endpoint:** `POST /ai/reports/portfolio`

**Görev:**
Dashboard üzerindeki portföy analiz alanının tasarımı.

*   **UI Bileşenleri:**
    *   "Portföyü Analiz Et" butonu.
    *   Rapor sonuç paneli.
*   **Kullanıcı Deneyimi:**
    *   Yapay zeka analiz yaparken daktilo veya skeleton screen efekti gösterimi.
*   **Teknik Detaylar:**
    *   Asenkron veriyi özel Hook'lar üzerinden yönetme.

---

## 28. AI Watchlist Raporu 

**API Endpoint:** `POST /ai/reports/watchlist`

**Görev:**
Kullanıcının izleme listesinden yola çıkarak fırsat/tehdit analizi bileşeni.

*   **UI Bileşenleri:**
    *   Watchlist sekmesinde rapor gösterim alanı.

---

## 29. AI İşlem Geçmişi Raporu

**API Endpoint:** `POST /ai/reports/transactions`

**Görev:**
Geçmiş işlemlerin kar/zarar analizi ve AI özet geri bildirimi ekranı.

*   **UI Bileşenleri:**
    *   Geçmiş sayfasında "Performansımı Analiz Et" modal'ı.

---

## 30. AI Chatbot Paneli

**API Endpoint:** `POST /ai/chat`

**Görev:**
Platform içi yüzen veya tüm ekranlık chatbot arayüzü tasarımı.

*   **UI Bileşenleri:**
    *   Mesaj geçmişi alanı, Input kutusu, Gönder butonu.
    *   Sağ altta açılıp kapanan chat balonu.
*   **Kullanıcı Deneyimi:**
    *   Mesajlar type-writer efekti ile akmalı.
*   **Teknik Detaylar:**
    *   Zustand ile chat state'inin tutulması.