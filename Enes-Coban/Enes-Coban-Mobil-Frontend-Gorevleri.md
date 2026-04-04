**1. Yeni İzleme Listesi Oluşturma Ekranı**
* **API Endpoint:** `POST /watchlists`
* **Görev:** Kullanıcının özel klasörler (örn: Kriptolarım) oluşturmasını sağlayan UI.
* **UI Bileşenleri:** Liste adı için Text Input barındıran Modal / Bottom Sheet, "Oluştur" butonu.
* **Form Validasyonu:** Boş liste adı veya 20 karakterden uzun isim girilememesi.
* **Kullanıcı Deneyimi:** Klavye açıldığında Modal'ın yukarı kayması (Keyboard Avoiding View).

**2. İzleme Listesine Varlık Ekleme Arama Ekranı**
* **API Endpoint:** `POST /watchlists/{listId}/assets`
* **Görev:** Piyasadan varlık aratıp listeye ekleme tasarımı.
* **UI Bileşenleri:** Üstte Search Bar (Arama çubuğu), altında arama sonuçlarını listeleyen RecyclerView/List, her satırda "+" (Ekle) ikonu.
* **Kullanıcı Deneyimi:** Yazı yazarken anında filtreleme (Search Debounce), eklendiğinde "+" ikonunun "Check" (Tik) ikonuna dönüşmesi.

**3. İzleme Listelerini Görüntüleme (Ana Ekran Sekmesi)**
* **API Endpoint:** `GET /watchlists`
* **Görev:** Takip edilen varlıkların fiyatlarının yatay ve dikey tablolarda gösterimi.
* **UI Bileşenleri:** Üstte liste isimlerini içeren kaydırılabilir TabBar, altta hisse/coin sembolü, anlık fiyatı ve günlük % değişimini içeren kartlar.
* **Kullanıcı Deneyimi:** Yükselen hisselerin yüzdesinin yeşil, düşenlerin kırmızı gösterilmesi. Fiyat değiştiğinde hücrenin anlık parlaması (Flash effect).
* **Teknik Detaylar:** Çok fazla hisse eklendiğinde kasmasını önlemek için LazyColumn (Compose) / UICollectionView kullanımı.

**4. Liste Adı Güncelleme Akışı**
* **API Endpoint:** `PUT /watchlists/{listId}`
* **Görev:** Mevcut liste adını düzenleme etkileşimi.
* **UI Bileşenleri:** Liste adının yanındaki "Kalem" ikonuna tıklanınca açılan in-line (satır içi) editör veya Dialog.

**5. İzleme Listesini Silme Akışı**
* **API Endpoint:** `DELETE /watchlists/{listId}`
* **Görev:** Listeyi tamamen kaldırma UI akışı.
* **UI Bileşenleri:** Sekme ayarlarına girildiğinde çıkan kırmızı "Listeyi Sil" butonu.
* **Kullanıcı Deneyimi:** Yanlışlıkla silmeyi önleyen "Tüm varlık takipleri silinecek, emin misiniz?" uyarısı.

**6. AI Durum Raporu Ekranı (AI Görevi)**
* **API Endpoint:** `GET /ai/report/status/{assetSymbol}`
* **Görev:** Kullanıcı alışkanlıklarını yorumlayan rapor üretir.
* **UI Bileşenleri:** Kullanıcının AL/SAT alışkanlıklarını, hisse portföy dağılımlarını, kar/zarar durumunu grafikler ve tablolarla gösteren ve yapay zeka yorumu içeren bir ekran.
* **Kullanıcı Deneyimi:** AI verisi yüklenirken bir "Yapay Zeka Analiz Ediyor..." loading animasyonu.

