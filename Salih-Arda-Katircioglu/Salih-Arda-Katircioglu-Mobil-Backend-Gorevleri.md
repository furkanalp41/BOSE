# Salih Arda Katırcıoğlu'nun Mobil Backend Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. İzleme Listesi Oluşturma**
* **API Endpoint:** `POST /watchlist/`
* **Görev:** Yeni izleme listesi oluşturma entegrasyonu.
* **İşlevler:**
  * Kullanıcıdan alınan liste adını API'ye gönderme.
  * Başarılı işlem sonrası UI'daki sekme yapısını anında güncelleme.
* **Teknik Detaylar:**
  * `Authorization: Bearer {token}` yönetimi.

**2. İzleme Listelerini Görüntüleme**
* **API Endpoint:** `GET /watchlist/`
* **Görev:** Kullanıcının izleme listelerini ve içindeki sembol kayıtlarını çekme.
* **İşlevler:**
  * Tüm listeleri çekip ekranda kaydırılabilir yapıda gösterme.
  * Pull-to-refresh ile güncelleme.
* **Teknik Detaylar:**
  * JSON array yapısını parse etme.

**3. İzleme Listesi Silme**
* **API Endpoint:** `DELETE /watchlist/:id`
* **Görev:** İzleme listesini tamamen sistemden kaldırma.
* **İşlevler:**
  * Kullanıcıya silme onayı (Dialog) gösterme.
  * Silme sonrası sayfadaki listeleri yeniden render etme.

**4. Listeye Sembol Ekleme**
* **API Endpoint:** `POST /watchlist/:id/items`
* **Görev:** Sembol arama ve seçilen sembolü listeye ekleme.
* **İşlevler:**
  * Sembol adını ilgili listeye POST etme.
  * PriceEngine'de tanımlı olmayan sembol hatası yönetimi.
* **Teknik Detaylar:**
  * Error handling ve kullanıcıya anlık geri bildirim.

**5. Listeden Sembol Çıkarma**
* **API Endpoint:** `DELETE /watchlist/:id/items/:itemId`
* **Görev:** İzleme listesinden bir sembolü çıkarma.
* **İşlevler:**
  * Swipe-to-delete veya ikona basarak silme eylemi.
  * Başarılı işlem sonrası lokal listeyi güncelleme.
* **Teknik Detaylar:**
  * İki path parametresinin (id, itemId) doğru iletilmesi.

**6. Fiyat Alarmı Oluşturma**
* **API Endpoint:** `POST /watchlist/alerts`
* **Görev:** Belirli bir sembol için ABOVE/BELOW fiyat alarmı kurma.
* **İşlevler:**
  * Sembol, hedef fiyat ve koşul bilgilerini API'ye gönderme.
  * Başarılı kayıtta "Alarm kuruldu" toast bildirimi gösterme.
* **Teknik Detaylar:**
  * Request payload'unun JSON olarak formatlanması.

**7. Alarmları Listeleme**
* **API Endpoint:** `GET /watchlist/alerts`
* **Görev:** Aktif ve pasif alarmları listeleme.
* **İşlevler:**
  * Alarmları çekip canlı fiyatla hedefe yakınlık hesaplama.

**8. Alarm Silme**
* **API Endpoint:** `DELETE /watchlist/alerts/:alertId`
* **Görev:** Kullanıcının alarmını kalıcı olarak silme.
* **İşlevler:**
  * Alarm listesinden swipe-to-delete eylemi.
  * Başarılı işlem sonrası lokal listeyi güncelleme.

**9. Tetiklenen Alarmları Görüntüleme**
* **API Endpoint:** `GET /watchlist/alerts/triggered`
* **Görev:** AlertChecker daemon tarafından tetiklenen alarmları gösterme.
* **İşlevler:**
  * Polling ile tetiklenen alarmları kontrol etme.
  * Push notification entegrasyonu.
