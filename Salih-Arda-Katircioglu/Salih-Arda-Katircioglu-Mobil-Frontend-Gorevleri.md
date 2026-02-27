**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. Fiyat Alarmı Ekleme**
* **API Endpoint:** `POST /alerts`
* **Görev:** Belirli bir varlık için fiyat seviyesinde alarm kurma entegrasyonu.
* **İşlevler:**
  * Hedef fiyat ve varlık sembolünü (Örn: BTCUSDT > 95000) API'ye gönderme.
  * Başarılı kayıtta "Alarm kuruldu" snackbar/toast uyarısı gösterme.
* **Teknik Detaylar:**
  * HTTP Client kullanımı ve request payload'unun JSON olarak formatlanması.

**2. Fiyat Alarmı Güncelleme**
* **API Endpoint:** `PUT /alerts/{alertId}`
* **Görev:** Mevcut bir alarmın fiyat seviyesini veya aktiflik durumunu (aç/kapa) güncelleme.
* **İşlevler:**
  * Alarm listesindeki toggle (switch) butonuna basıldığında API'ye anlık istek atma.
* **Teknik Detaylar:**
  * Optimistic Update (API cevabını beklemeden butonu açık/kapalı konuma getirme, hata olursa geri alma).

**3. Fiyat Alarmını Silme**
* **API Endpoint:** `DELETE /alerts/{alertId}`
* **Görev:** Kullanıcının alarmını kalıcı olarak silme işlemini yönetme.
* **İşlevler:**
  * Alarm listesinden Swipe-to-delete (yana kaydırarak silme) eylemi.
  * Başarılı işlem sonrası cihazdaki lokal listeyi güncelleme.
* **Teknik Detaylar:**
  * 404 (Alarm bulunamadı) hatası kontrolü.

**4. İşlem Geçmişini Görüntüleme**
* **API Endpoint:** `GET /orders/history`
* **Görev:** Geçmiş alım/satım işlemlerini kronolojik olarak listeleme.
* **İşlevler:**
  * Verileri çekip, borsa terminolojisine uygun tasarlanmış listeye (RecyclerView) yansıtma.
  * Çok fazla veri varsa Lazy Loading (sayfa aşağı indikçe veri çekme) (Pagination) yapısı.
* **Teknik Detaylar:**
  * Query parametreleri ile sayfalama (`?page=1&limit=20`) kullanımı.

**5. Listeden Varlık Çıkarma (İzleme Listesi Ortak Görevi)**
* **API Endpoint:** `DELETE /watchlists/{listId}/assets/{assetSymbol}`
* **Görev:** İzleme listesi detay ekranından bir varlığı çıkarma.
* **İşlevler:**
  * İzleme listesinde bir coinin üzerine basılı tutup veya ikonuna basıp listeden çıkarma.
* **Teknik Detaylar:**
  * Path parametrelerini (`{listId}`, `{assetSymbol}`) URL encode ederek doğru iletme.

**6. AI Chatbot ile Sohbet**
* **API Endpoint:** `POST /ai/chat`
* **Görev:** OpenAI / LLM destekli yapay zeka asistanı ile mesajlaşma altyapısı.
* **İşlevler:**
  * Kullanıcının mesajını API'ye iletme ve dönen AI cevabını mesaj baloncuğunda gösterme.
  * "Yapay zeka yazıyor..." (Typing indicator) animasyonunu tetikleme.
* **Teknik Detaylar:**
  * Uzun yanıt sürelerine karşı HTTP Timeout süresini yüksek tutma (veya SSE - Server Sent Events yapısına hazırlık).
