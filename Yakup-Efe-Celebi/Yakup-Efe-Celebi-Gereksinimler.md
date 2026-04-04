Yeni Market Varlığı Ekleme
API Metodu: POST /market/assets
Açıklama: Sistem yöneticilerinin (admin), platformda alınıp satılabilmesi için yeni bir BİST hissesini veya Kripto para çiftini sisteme tanımlamasını sağlar. Sadece "Yönetici" yetkisine sahip, giriş yapmış kullanıcılar tarafından kullanılabilir.

Market Verilerini Listeleme
API Metodu: GET /market/prices
Açıklama: Sistemde kayıtlı olan tüm varlıkların Redis üzerinden çekilen anlık fiyat bilgilerini ve değişim oranlarını listeler. Platformun ana veri akışını besler. Bu özellik genel piyasa takibi için halka açık olarak çalışabilir.

Varlık Bilgilerini Güncelleme
API Metodu: PUT /market/assets/{assetId}
Açıklama: Sistemdeki bir varlığın açıklamasını, şirket/coin logosunu veya platformda işlem görüp görmeme durumunu (tahta kapatma) günceller. Güvenlik için "Yönetici" yetkisine sahip giriş yapmış kullanıcılar kullanabilir.

Sistem Sağlık Durumu Görüntüleme
API Metodu: GET /admin/health
Açıklama: Sistemin arka planında çalışan Docker konteynerlarının, Kafka kuyruklarının ve Redis bağlantılarının durumunu teknik rapor olarak sunar. Altyapı takibi için sadece "Yönetici" yetkisine sahip kullanıcılar erişebilir.

Giriş Hareketlerini Listeleme
API Metodu: GET /users/{userId}/logs
Açıklama: Hesaba yapılan son giriş işlemlerini (cihaz IP bilgisi, Tarayıcı, Tarih) siber güvenlik takibi için listeler. Kullanıcılar hesaplarının güvende olup olmadığını kontrol etmek için bu loglara erişebilir. Güvenlik için giriş yapmış olmak gerekir.

AI Tahmin Geçmişini Temizleme
API Metodu: DELETE /ai/history
Açıklama: Kullanıcının akıllı asistan ile daha önce yaptığı sohbet geçmişini ve sistemden istediği analiz sorgularının kaydını veri tabanından kalıcı olarak silmesini sağlar. Gizlilik hakkını korumak için tasarlanmıştır, giriş yapmış olmak gerekir.
