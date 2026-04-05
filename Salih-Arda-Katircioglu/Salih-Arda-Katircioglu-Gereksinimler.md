İzleme Listesi Oluşturma
API Metodu: POST /watchlist/
Açıklama: Kullanıcının "Kripto Favori" veya "Hisselerim" gibi isimlerle özel izleme listeleri oluşturmasını sağlar. Bu sayede piyasadaki varlıklar gruplandırılabilir. İşlemi yapabilmek için sisteme giriş yapmış olmak gerekir.

İzleme Listelerini Görüntüleme
API Metodu: GET /watchlist/
Açıklama: Kullanıcıya ait tüm izleme listelerini ve bu listelerin içerisindeki sembol kayıtlarını getirir. Kullanıcı sadece kendi oluşturduğu listeleri görüntüleyebilir. Güvenlik için giriş yapmış olmak gerekir.

İzleme Listesini Silme
API Metodu: DELETE /watchlist/:id
Açıklama: Kullanıcının oluşturduğu bir izleme listesini kalıcı olarak sistemden kaldırmasını sağlar. Bu işlemle beraber liste içindeki tüm kayıtlı sembol takipleri de silinir (cascade). Güvenlik için giriş yapmış olmak gerekir.

Listeye Sembol Ekleme
API Metodu: POST /watchlist/:id/items
Açıklama: Kullanıcının daha önce oluşturduğu bir izleme listesine piyasada işlem gören yeni bir sembol eklemesini sağlar. PriceEngine'den sembol validasyonu yapılır. Güvenlik için giriş yapmış olmak gerekir.

Listeden Sembol Çıkarma
API Metodu: DELETE /watchlist/:id/items/:itemId
Açıklama: Kullanıcının artık takip etmek istemediği belirli bir sembolü izleme listesinden çıkarmasını sağlar. İşlem sadece kullanıcının kendi izleme listesinde yapılabilir. Güvenlik için giriş yapmış olmak gerekir.

Fiyat Alarmı Oluşturma
API Metodu: POST /watchlist/alerts
Açıklama: Kullanıcının takip ettiği bir varlık belirli bir fiyat seviyesine ulaştığında bildirim almak için ABOVE (üstüne çıkınca) veya BELOW (altına düşünce) koşuluyla alarm kurmasını sağlar. Güvenlik için giriş yapmış olmak gerekir.

Alarmları Listeleme
API Metodu: GET /watchlist/alerts
Açıklama: Kullanıcının tüm aktif ve pasif fiyat alarmlarını listeler. Güvenlik için giriş yapmış olmak gerekir.

Alarm Silme
API Metodu: DELETE /watchlist/alerts/:alertId
Açıklama: Artık ihtiyaç duyulmayan bir fiyat alarmını sistemden kalıcı olarak kaldırır. Güvenlik için giriş yapmış olmak gerekir.

Tetiklenen Alarmları Görüntüleme
API Metodu: GET /watchlist/alerts/triggered
Açıklama: AlertChecker daemon tarafından tetiklenen alarmları in-memory cache'den getirir. Maksimum 100 tetiklenen alarm saklanır. Güvenlik için giriş yapmış olmak gerekir.
