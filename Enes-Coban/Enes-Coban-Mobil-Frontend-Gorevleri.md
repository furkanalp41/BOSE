# Enes Çoban'ın Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** `Link buraya eklenecek`

**1. Portfolio Analysis Ekranı**
* **API Endpoint:** `POST /ai/reports/portfolio`
* **Görev:** AI portföy analizi sonuçlarını gösteren ekran tasarımı.
* **UI Bileşenleri:** Risk skoru, çeşitlendirme skoru bar grafikleri, AI analiz metni kutusu (yeşil vurgulu), ModelBadge (LLM model adı veya Rules Engine).
* **Kullanıcı Deneyimi:** AI verisi yüklenirken Skeleton Screen gösterimi. LLM kullanıldığında yeşil çerçeveli vurgulama.
* **Teknik Detaylar:** 60 saniye timeout, model_used alanına göre koşullu gösterim.

**2. Watchlist Analysis Ekranı**
* **API Endpoint:** `POST /ai/reports/watchlist`
* **Görev:** AI sinyal analizi sonuçlarını gösteren ekran tasarımı.
* **UI Bileşenleri:** Sembol bazlı sinyal kartları (AL/SAT/TUT/İZLE), her sembol için confidence bar (animasyonlu).
* **Kullanıcı Deneyimi:** Renk kodları: AL yeşil, SAT kırmızı, TUT sarı, İZLE mavi. Türkçe ve İngilizce sinyal desteği.

**3. Transaction Analysis Ekranı**
* **API Endpoint:** `POST /ai/reports/transactions`
* **Görev:** AI davranış analizi sonuçlarını gösteren ekran tasarımı.
* **UI Bileşenleri:** Davranış pattern listesi, Impact badge'leri (HIGH kırmızı, MEDIUM sarı, LOW yeşil), AI öneri metni kutusu.
* **Kullanıcı Deneyimi:** AI verisi yüklenirken "Yapay Zeka Analiz Ediyor..." loading animasyonu.

**4. AI Chat Ekranı**
* **API Endpoint:** `POST /ai/chat`
* **Görev:** Yapay zeka asistanı ile mesajlaşma arayüzü tasarımı.
* **UI Bileşenleri:** Sağda kullanıcı solda AI mesaj baloncukları, dil seçimi toggle (TR/EN), hazır soru önerileri (suggested actions), mesaj input alanı ve "Gönder" butonu.
* **Kullanıcı Deneyimi:** "Yapay zeka yazıyor..." typing indicator animasyonu. Yeni mesajda otomatik aşağı kaydırma. 60 saniye timeout.
* **Teknik Detaylar:** Chat mesaj geçmişinin state yönetimi, markdown rendering.
