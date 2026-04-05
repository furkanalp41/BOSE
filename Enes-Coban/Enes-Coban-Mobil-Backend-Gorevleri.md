# Enes Çoban'ın Mobil Backend Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. AI Yatırım Tavsiyesi Servisi**
* **API Endpoint:** `POST /ai/advice`
* **Görev:** Kural tabanlı yatırım tavsiyesi isteme entegrasyonu.
* **İşlevler:**
  * Tavsiye isteğini API'ye gönderme.
  * Response'daki analiz metnini ve model_used bilgisini parse etme.
* **Teknik Detaylar:**
  * Bearer Token ile kimlik doğrulama.

**2. AI Portföy Analizi Servisi**
* **API Endpoint:** `POST /ai/reports/portfolio`
* **Görev:** Kullanıcının portföyünü yapay zeka ile analiz ettirme.
* **İşlevler:**
  * Portföy analiz isteği gönderme ve skor değerlerini çekme.
  * model_used ile LLM vs Rules Engine ayrımı gösterme.
* **Teknik Detaylar:**
  * Uzun AI response için yüksek timeout ayarı (60 saniye).
  * ProviderChain: Gemini 2.0 Flash → Anthropic Claude Sonnet → Rules Engine fallback.

**3. AI Watchlist Sinyal Analizi Servisi**
* **API Endpoint:** `POST /ai/reports/watchlist`
* **Görev:** İzleme listesi verilerini analiz ettirerek sinyal üretme.
* **İşlevler:**
  * İzleme listesi verilerini (sembol adı ve fiyat) request body'de gönderme.
  * AL/SAT/TUT/İZLE sinyallerini parse etme.
  * Confidence skorlarını UI'a yansıtma.
* **Teknik Detaylar:**
  * JSON array yapısının doğru formatlanması.

**4. AI İşlem Davranış Analizi Servisi**
* **API Endpoint:** `POST /ai/reports/transactions`
* **Görev:** İşlem geçmişine dayalı davranış pattern'lerini analiz ettirme.
* **İşlevler:**
  * Analiz isteği gönderme ve pattern verilerini çekme.
  * Impact seviyelerini renk kodlarıyla eşleştirme.
* **Teknik Detaylar:**
  * Response parsing ve hata yönetimi.

**5. AI Chatbot Servisi**
* **API Endpoint:** `POST /ai/chat`
* **Görev:** Yapay zeka asistanı ile mesajlaşma altyapısı.
* **İşlevler:**
  * Kullanıcının mesajını API'ye iletme ve dönen AI cevabını mesaj baloncuğunda gösterme.
  * "Yapay zeka yazıyor..." (typing indicator) animasyonunu tetikleme.
  * Chat geçmişini lokal state'te tutma.
* **Teknik Detaylar:**
  * 60 saniye HTTP timeout ayarı.
  * Çoklu mesaj desteği ve dil seçimi (TR/EN).
