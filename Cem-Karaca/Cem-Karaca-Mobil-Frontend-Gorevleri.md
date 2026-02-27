**Mobile Front-end Demo Videosu:** `Link buraya eklenecek`

**1. Piyasa Emri Oluşturma (Alım/Satım) Ekranı**
* **API Endpoint:** `POST /orders/market`
* **Görev:** Kullanıcının anlık fiyat üzerinden hızlıca işlem yaptığı al-sat arayüzü.
* **UI Bileşenleri:** Büyük yeşil "AL" ve kırmızı "SAT" sekmeleri, Lot/Miktar girme alanı (Sayısal klavye), Tahmini toplam tutar göstergesi, "İşlemi Onayla" butonu.
* **Form Validasyonu:** Miktar 0'dan büyük olmalı, bakiyeyi aşan alımlarda butonun "Yetersiz Bakiye" uyarısıyla disabled (pasif) olması.
* **Kullanıcı Deneyimi:** İşlem başarılı olduğunda ekranda konfeti efekti veya onay animasyonu (Lottie).

**2. Limit Emir Oluşturma Ekranı**
* **API Endpoint:** `POST /orders/limit`
* **Görev:** İleri tarihli, özel fiyatlı emir formu tasarımı.
* **UI Bileşenleri:** Hedef Fiyat inputu (Örn: BTC 90.000 iken 85.000'e alış girmek), Miktar inputu, Stepper (+/-) butonları.
* **Teknik Detaylar:** Input alanlarında sadece ondalıklı sayı (Decimal/Float) klavyesinin açılmasını sağlama.

**3. Açık Emirleri Listeleme Ekranı**
* **API Endpoint:** `GET /orders/open`
* **Görev:** Bekleyen emirlerin (henüz gerçekleşmemiş) listelendiği panel.
* **UI Bileşenleri:** Emir tipi (Al/Sat), Hedef Fiyat, Miktar ve İptal ikonunu içeren liste öğeleri (List Items).
* **Kullanıcı Deneyimi:** Liste boşsa "Şu an bekleyen emriniz yok" yazan bilgilendirici boş durum (Empty State) tasarımı.

**4. Limit Emir Güncelleme Akışı**
* **API Endpoint:** `PUT /orders/{orderId}`
* **Görev:** Bekleyen emrin fiyatını veya miktarını düzenleme arayüzü.
* **UI Bileşenleri:** Açık emre tıklandığında alttan açılan (Bottom Sheet) düzenleme formu.

**5. Bekleyen Emri İptal Etme Etkileşimi**
* **API Endpoint:** `DELETE /orders/{orderId}`
* **Görev:** Emri iptal edip bakiyeyi iade etme UI akışı.
* **Kullanıcı Deneyimi:** Öğeyi sağa/sola kaydırarak (Swipe to Delete) iptal etme veya "Çöp Kutusu" ikonuna basma. İptal sonrası Snackbar ile "Emir iptal edildi, bakiye iade edildi" bildirimi.

**6. AI Portföy Raporu Ekranı (AI Görevi)**
* **API Endpoint:** `GET /ai/report/portfolio/{userId}`
* **Görev:** Yapay zekanın kullanıcının tüm yatırımlarını analiz ettiği görsel dashboard.
* **UI Bileşenleri:** Portföy dağılımını gösteren Renkli Pasta Grafiği (Pie Chart), 100 üzerinden "Risk Skoru" barı, "AI Strateji Önerisi" metin kutusu.
* **Teknik Detaylar:** Mobil grafik kütüphaneleri (MPAndroidChart veya Charts iOS) entegrasyonu ve erişilebilir renk kontrastları.
