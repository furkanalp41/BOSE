Salih Arda Katırcıoğlu'nun Web Frontend Görevleri
Site Linki: [https://frontend-bose.vercel.app/]


Front-end Test Videosu: [https://youtu.be/28jhHzgf9sc]

Yeni İzleme Listesi Oluşturma Sayfası
API Endpoint: POST /watchlist
Görev: Kullanıcının özel hisse/kripto klasörleri oluşturması için arayüz tasarımı.

İzleme Listelerini Görüntüleme Ekranı
API Endpoint: GET /watchlist
Görev: Takip edilen varlıkların detaylı listelendiği ekran.
UI Bileşenleri: Sekmelerle (tabs) listeler arasında geçiş. Skeleton loader vb. entegrasyonu.

İzleme Listesini Silme Akışı
API Endpoint: DELETE /watchlist/{id}
Görev: "Sil" butonu ve modal onayı tasarımı.

İzleme Listesine Varlık Ekleme
API Endpoint: POST /watchlist/{id}/items
Görev: Arama çubuğu (Search bar) ve sonuçlar içinden ekleme işlemi tasarımları.

Listeden Varlık Çıkarma
API Endpoint: DELETE /watchlist/{id}/items/{itemId}
Görev: Listedeki varlık etiketinden çarpı "x" ile çıkarma aksiyonu.

Fiyat Alarmı Ekleme Modal'ı
API Endpoint: POST /watchlist/alerts
Görev: Seçili varlık için hedef fiyat ve koşul ayarlama (örn. Hedef Fiyat 65000 Düşerken/Yükselirken) modal'ı tasarımı.

Fiyat Alarmlarını Listeleme Ekranı
API Endpoint: GET /watchlist/alerts
Görev: Tüm kurulmuş fiyat alarmlarını listeleyen ve durumunu belirten tablo arayüzü tasarımı.

Fiyat Alarmını Silme Akışı
API Endpoint: DELETE /watchlist/alerts/{alertId}
Görev: Mevcut alarmları silebilme yeteneği.

Tetiklenmiş Alarmları Görüntüleme (Bildirimler)
API Endpoint: GET /watchlist/alerts/triggered
Görev: Navbar üzerinde çan ikonu ve drop-down menü ile gelen bildirim/alarmların gösterilmesi.
