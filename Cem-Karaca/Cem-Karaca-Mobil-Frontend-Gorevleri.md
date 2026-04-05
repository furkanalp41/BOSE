# Cem Karaca'nın Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** `Link buraya eklenecek`

**1. Alım/Satım Emri Ekranı**
* **API Endpoint:** `POST /trading/order`
* **Görev:** Kullanıcının anlık fiyat üzerinden hızlıca işlem yaptığı al-sat arayüzü.
* **UI Bileşenleri:** Büyük yeşil "AL" ve kırmızı "SAT" sekmeleri, sembol seçimi dropdown, miktar girme alanı (sayısal klavye), tahmini toplam tutar göstergesi, "İşlemi Onayla" butonu.
* **Form Validasyonu:** Miktar 0'dan büyük olmalı, bakiyeyi aşan alımlarda butonun "Yetersiz Bakiye" uyarısıyla disabled olması.
* **Kullanıcı Deneyimi:** İşlem başarılı olduğunda onay animasyonu ve toast mesajı.

**2. Açık Pozisyonlar Ekranı**
* **API Endpoint:** `GET /trading/positions`
* **Görev:** Açık pozisyonların ve canlı P&L'in listelendiği ekran.
* **UI Bileşenleri:** Sembol, giriş fiyatı, güncel fiyat, P&L ve "Kapat" butonu içeren liste öğeleri.
* **Kullanıcı Deneyimi:** Kâr yeşil, zarar kırmızı renk kodlaması. Canlı fiyatla güncellenen P&L değerleri.

**3. Pozisyon Kapatma Akışı**
* **API Endpoint:** `POST /trading/positions/:positionId/close`
* **Görev:** Açık pozisyonu kapatma UI akışı.
* **UI Bileşenleri:** "Kapat" butonuna basınca alttan açılan onay Bottom Sheet.
* **Kullanıcı Deneyimi:** Kapatma sonrası haptic feedback ve portföy güncelleme.

**4. İşlem Geçmişi Ekranı**
* **API Endpoint:** `GET /trading/history`
* **Görev:** Geçmiş işlemlerin kronolojik listesi.
* **UI Bileşenleri:** Tarih, sembol, işlem tipi (BUY/SELL), fiyat ve tutar bilgilerini içeren liste. Alış yeşil, satış kırmızı badge.
* **Teknik Detaylar:** Lazy loading ile performanslı veri gösterimi.

**5. Portföy Özeti Ekranı**
* **API Endpoint:** `GET /trading/portfolio`
* **Görev:** Portföy özet kartlarının mobil arayüz tasarımı.
* **UI Bileşenleri:** Toplam Değer, P&L, Bakiye ve Pozisyon Sayısı kartları.
* **Kullanıcı Deneyimi:** Animasyonlu counter, pull-to-refresh desteği.

**6. Admin Duyuru Ekranı**
* **API Endpoint:** `POST /admin/announcements`
* **Görev:** Admin panelinden duyuru oluşturma arayüzü.
* **UI Bileşenleri:** Duyuru metni input alanı, "Gönder" butonu.
* **Kullanıcı Deneyimi:** Sadece admin rolündeki hesaplarda görünür. Başarılı gönderimde toast mesajı.
