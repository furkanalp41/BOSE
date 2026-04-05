Yeni İzleme Listesi Oluşturma
API Metodu: POST /watchlist
Açıklama: Kullanıcının özel izleme listeleri oluşturmasını sağlar. Güvenlik için sisteme giriş yapmış olmak gerekir.

İzleme Listelerini Görüntüleme
API Metodu: GET /watchlist
Açıklama: Kullanıcının kendi sahip olduğu tüm izleme listelerini içlerindeki varlıklarla birlikte getirir. Güvenlik için giriş yapmış olmak gerekir.

İzleme Listesini Silme
API Metodu: DELETE /watchlist/{id}
Açıklama: Belirtilen izleme listesini kalıcı olarak kaldırır. Güvenlik için giriş yapmış olmak gerekir.

İzleme Listesine Varlık Ekleme
API Metodu: POST /watchlist/{id}/items
Açıklama: İzleme listesine piyasada olan bir varlığı ekler. Güvenlik için giriş yapmış olmak gerekir.

Listeden Varlık Çıkarma
API Metodu: DELETE /watchlist/{id}/items/{itemId}
Açıklama: Kullanıcının artık takip etmek istemediği belirli bir hisse senedini veya kripto parayı izleme listesinden çıkarmasını sağlar. Güvenlik için giriş yapmış olmak gerekir.

Fiyat Alarmı Ekleme
API Metodu: POST /watchlist/alerts
Açıklama: Kullanıcının takip ettiği bir varlık belirli bir fiyat seviyesine ulaştığında sistemin bildirim göndermesi için kural oluşturmasını sağlar. Güvenlik için sisteme giriş yapmış olmak gerekir.

Fiyat Alarmlarını Listeleme
API Metodu: GET /watchlist/alerts
Açıklama: Kullanıcının tüm fiyat alarmlarını listeler. Güvenlik için giriş yapmış olmak gerekir.

Fiyat Alarmını Silme
API Metodu: DELETE /watchlist/alerts/{alertId}
Açıklama: Artık ihtiyaç duyulmayan bir fiyat alarmını sistemden kalıcı olarak kaldırır. Güvenlik için giriş yapmış olmak gerekir.

Tetiklenmiş Alarmları Görüntüleme
API Metodu: GET /watchlist/alerts/triggered
Açıklama: Son kontrol döngüsünde tetiklenen alarmları listeler. Güvenlik için giriş yapmış olmak gerekir.
