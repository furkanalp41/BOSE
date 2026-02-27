**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. Piyasa Emri Oluşturma (Alım/Satım)**
* **API Endpoint:** `POST /orders/market`
* **Görev:** Anlık fiyattan alım-satım emirlerini iletme.
* **İşlevler:**
  * Miktar ve İşlem Yönü (BUY/SELL) verilerini toplayıp API'ye gönderme.
  * Emir başarılı olduğunda bakiyeyi güncellemek için Profil servisiyle senkronize çalışma.
* **Teknik Detaylar:**
  * Çift tıklamayı veya art arda isteği önlemek için Buton kilitleme (Debounce).
  * 400 Bad Request (Yetersiz bakiye) hatasının yönetimi.

**2. Limit Emir Oluşturma**
* **API Endpoint:** `POST /orders/limit`
* **Görev:** İleri tarihli ve özel fiyatlı emirleri oluşturma.
* **İşlevler:**
  * Hedef fiyat ve miktar bilgilerini doğrulayarak (Sıfırdan büyük olmalı) API'ye gönderme.
  * Emrin "Bekleyen (Pending)" statüsünde kaydedildiğini arayüzde gösterme.
* **Teknik Detaylar:**
  * Float/Decimal veri tiplerinin JSON formatında hassasiyetini (Precision) koruyarak iletilmesi.

**3. Açık Emirleri Listeleme**
* **API Endpoint:** `GET /orders/open`
* **Görev:** Henüz gerçekleşmemiş limit emirleri kullanıcı arayüzünde listeleme.
* **İşlevler:**
  * Bekleyen emirleri çekip bir sekmede (Tab) listeleme.
  * Pull-to-refresh ile emir durumlarını (Gerçekleşti mi?) kontrol etme.
* **Teknik Detaylar:**
  * JWT Token ile authorization sağlanması.

**4. Limit Emir Güncelleme**
* **API Endpoint:** `PUT /orders/{orderId}`
* **Görev:** Bekleyen bir emrin hedef fiyatını veya lot miktarını değiştirme.
* **İşlevler:**
  * Güncelleme modalından alınan verileri PUT metoduyla gönderme.
  * Bloke bakiye değişimini kullanıcıya hissettirme.
* **Teknik Detaylar:**
  * Conflict resolution ve loading state yönetimi.

**5. Bekleyen Emri İptal Etme**
* **API Endpoint:** `DELETE /orders/{orderId}`
* **Görev:** Gerçekleşmemiş bir emri iptal ederek bakiyeyi boşa çıkarma.
* **İşlevler:**
  * Listeden kaydırarak veya butona basarak silme eylemi.
  * İptal başarılı olduğunda açık emirler listesini local olarak filtreleyip güncelleme.
* **Teknik Detaylar:**
  * API'den 200/204 durum kodu geldiğinde UI State'i güncelleme.

**6. AI Portföy Raporu Almak**
* **API Endpoint:** `GET /ai/report/portfolio/{userId}`
* **Görev:** Kullanıcının yatırımlarının yapay zeka tarafından analiz edilip sunulması.
* **İşlevler:**
  * Portföy risk skorunu ve dağılım pasta grafiğini besleyen verileri çekme.
  * AI analiz yanıtını parse ederek strateji önerilerini arayüze basma.
* **Teknik Detaylar:**
  * Response caching stratejisi (Rapor her saniye değişmeyeceği için önbelleğe alma).

