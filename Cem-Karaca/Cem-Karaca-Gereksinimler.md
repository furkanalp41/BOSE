Piyasa Emri Oluşturma
API Metodu: POST /orders/market
Açıklama: Kullanıcının bir varlığı o anki en güncel piyasa fiyatından anlık olarak almasını veya satmasını sağlar. İşlem anında gerçekleşir ve kullanıcının bakiyesi güncellenir. Yeterli bakiyenin bulunması ve sisteme giriş yapılmış olması gerekir.

Limit Emir Oluşturma
API Metodu: POST /orders/limit
Açıklama: Fiyat belirli bir seviyeye ulaştığında otomatik olarak gerçekleşmesi beklenen ileri tarihli emirleri sisteme girer. Emir girildiği anda işlem tutarı kadar bakiye bloke edilir. Güvenlik için giriş yapmış olmak gerekir.

Açık Emirleri Listeleme
API Metodu: GET /orders/open
Açıklama: Kullanıcının sisteme girdiği ancak belirlediği fiyat piyasada henüz oluşmadığı için gerçekleşmeyi bekleyen (açık) tüm limit emirlerini listeler. Kullanıcı sadece kendi açık emirlerini görebilir. Güvenlik için giriş yapmış olmak gerekir.

Limit Emir Güncelleme
API Metodu: PUT /orders/{orderId}
Açıklama: Henüz gerçekleşmemiş bekleyen bir limit emrin hedef fiyatını veya alınacak/satılacak varlık miktarını değiştirir. Bloke edilen bakiye yeni fiyata göre yeniden hesaplanır. Güvenlik için giriş yapmış olmak gerekir.

Bekleyen Emri İptal Etme
API Metodu: DELETE /orders/{orderId}
Açıklama: Kullanıcının henüz piyasada gerçekleşmemiş olan bir emrini sistemden tamamen kaldırmasını sağlar. Bu işlem sonucunda, bloke edilen sanal bakiye kullanıcının kullanılabilir bakiyesine iade edilir. Güvenlik için giriş yapmış olmak gerekir.

AI Portföy Raporu Almak
API Metodu: GET /ai/report/portfolio/{userId}
Açıklama: Yapay zekanın, kullanıcının o an sahip olduğu tüm yatırımları (hisse ve kripto) analiz ederek genel bir risk puanı oluşturmasını ve portföy karlılığını artırmak için stratejik kararlar (varlık dağılımı önerileri) sunmasını sağlar. Güvenlik için giriş yapmış olmak gerekir.
