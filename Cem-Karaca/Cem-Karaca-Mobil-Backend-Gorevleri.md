# Cem Karaca'nın Mobil Backend Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. Alım/Satım Emri Oluşturma**
* **API Endpoint:** `POST /trading/order`
* **Görev:** Anlık fiyattan alım-satım emirlerini iletme.
* **İşlevler:**
  * Sembol, miktar ve işlem yönü (BUY/SELL) verilerini toplayıp API'ye gönderme.
  * Emir başarılı olduğunda bakiyeyi güncellemek için portföy servisiyle senkronize çalışma.
* **Teknik Detaylar:**
  * Çift tıklamayı önlemek için buton kilitleme (Debounce).
  * 400 Bad Request (yetersiz bakiye) hatasının yönetimi.

**2. Açık Pozisyonları Listeleme**
* **API Endpoint:** `GET /trading/positions`
* **G��rev:** Kullanıcının açık pozisyonlarını ve canlı P&L bilgilerini listeleme.
* **İşlevler:**
  * Pozisyon listesini çekip canlı fiyatlarla P&L hesaplama.
  * Pull-to-refresh ile pozisyon durumlarını güncelleme.
* **Teknik Detaylar:**
  * JWT Token ile authorization sağlanması.

**3. Pozisyon Kapatma**
* **API Endpoint:** `POST /trading/positions/:positionId/close`
* **Görev:** Açık bir pozisyonu güncel fiyattan kapatma.
* **İşlevler:**
  * Onay dialog'u gösterme ve kapatma isteğini gönderme.
  * Kâr/zarar bakiyeye yansıtıldığında arayüzü güncelleme.
* **Teknik Detaylar:**
  * Path parametresinin (positionId) doğru iletilmesi.

**4. İşlem Geçmişi**
* **API Endpoint:** `GET /trading/history`
* **Görev:** Geçmiş alım/satım işlemlerini kronolojik olarak listeleme.
* **İşlevler:**
  * Verileri çekip borsa terminolojisine uygun listeye yansıtma.
  * Çok fazla veri varsa Lazy Loading yapısı.
* **Teknik Detaylar:**
  * Tarih formatlarını yerel saat dilimine çevirme.

**5. Portföy Özeti**
* **API Endpoint:** `GET /trading/portfolio`
* **Görev:** Kullanıcının toplam portföy değeri, P&L ve bakiye bilgilerini çekme.
* **İşlevler:**
  * Portföy verilerini parse ederek özet kartlarını besleme.
* **Teknik Detaylar:**
  * Response caching stratejisi (hızlı yükleme için).

**6. Admin Duyuru Oluşturma**
* **API Endpoint:** `POST /admin/announcements`
* **Görev:** Admin panelinden sistem duyurusu oluşturma.
* **İşlevler:**
  * Duyuru metnini toplayıp API'ye gönderme.
* **Teknik Detaylar:**
  * 403 Forbidden hata yönetimi (admin değilse erişim engeli).
