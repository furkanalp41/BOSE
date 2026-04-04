**1. Yeni İzleme Listesi Oluşturma**
* **API Endpoint:** `POST /watchlists`
* **Görev:** "Favorilerim", "Kriptolar" gibi yeni izleme klasörleri oluşturma entegrasyonu.
* **İşlevler:**
  * Kullanıcıdan alınan liste adını API'ye gönderme.
  * Başarılı işlem sonrası UI'daki sekme (Tab) yapısını anında güncelleme.
* **Teknik Detaylar:**
  * `Authorization: Bearer {token}` yönetimi.
  * Optimistic UI Update ile listeyi beklemeden ekranda gösterme.

**2. İzleme Listesine Varlık Ekleme**
* **API Endpoint:** `POST /watchlists/{listId}/assets`
* **Görev:** BİST veya Kripto varlıklarını seçilen listeye ekleme işlemi.
* **İşlevler:**
  * Varlık sembolünü (Örn: THYAO, BTC) ilgili listeye POST etme.
  * Zaten ekli olan bir varlık için dönen 409 Conflict hatasını kullanıcıya Toast mesajı ile gösterme.
* **Teknik Detaylar:**
  * Error handling ve kullanıcıya anlık geri bildirim.

**3. İzleme Listelerini Görüntüleme**
* **API Endpoint:** `GET /watchlists`
* **Görev:** Kullanıcının izleme listelerini ve içindeki anlık fiyatları çekme.
* **İşlevler:**
  * Tüm listeleri çekip ekranda yatay veya dikey kaydırılabilir (RecyclerView/UICollectionView) bir yapıda gösterme.
  * Offline-first yaklaşımı ile son fiyatları cache'den okuma.
* **Teknik Detaylar:**
  * Gelen karmaşık JSON array yapısını parse etme.
  * Pull-to-refresh (Aşağı çekip yenileme) implementasyonu.

**4. Liste Adı Güncelleme**
* **API Endpoint:** `PUT /watchlists/{listId}`
* **Görev:** Mevcut bir izleme listesinin adını değiştirme.
* **İşlevler:**
  * İsim değiştirme popup'ından gelen veriyi PUT isteği ile sunucuya iletme.
  * Başarılı olduğunda lokal cache'i yenileme.
* **Teknik Detaylar:**
  * 404 Not Found (Liste bulunamadı) veya 403 (Yetki yok) hatalarının yönetimi.

**5. İzleme Listesini Silme**
* **API Endpoint:** `DELETE /watchlists/{listId}`
* **Görev:** İzleme listesini tamamen sistemden kaldırma.
* **İşlevler:**
  * Kullanıcıya silme onayı (Dialog) gösterme.
  * Silme sonrası sayfadaki listeleri yeniden render etme.
* **Teknik Detaylar:**
  * HTTP DELETE request yönetimi.

**6. AI Durum Raporu Almak**
* **API Endpoint:** `GET /ai/report/status/{assetSymbol}`
* **Görev:** Kullanıcı alışkanlıklarını yorumlama.
* **İşlevler:**
  * AI durum raporunun getirilmesi.
  * AI analizi üretilirken ekranda Skeleton Loading (İskelet yükleyici) gösterme.
* **Teknik Detaylar:**
  * Uzun sürebilecek AI requestleri için Timeout süresini ayarlama (Örn: 30 sn).
