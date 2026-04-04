Fiyat Alarmı Ekleme
API Metodu: POST /alerts
Açıklama: Kullanıcının takip ettiği bir varlık belirli bir fiyat seviyesine ulaştığında sistemin anlık bildirim göndermesi için yeni bir takip kuralı oluşturmasını sağlar. Güvenlik için sisteme giriş yapmış olmak gerekir.

Fiyat Alarmı Güncelleme
API Metodu: PUT /alerts/{alertId}
Açıklama: Kullanıcının daha önce kurmuş olduğu bir fiyat alarmının hedef fiyat değerini veya alarmın aktiflik durumunu (açık/kapalı) değiştirmesine olanak tanır. Yalnızca alarmı kuran kullanıcı güncelleyebilir ve giriş yapmış olmak gerekir.

Fiyat Alarmını Silme
API Metodu: DELETE /alerts/{alertId}
Açıklama: Artık ihtiyaç duyulmayan veya hedefine ulaşmış olan bir fiyat alarmını sistemden kalıcı olarak kaldırır. Güvenlik için giriş yapmış olmak ve işlemi yapanın alarm sahibi olması gerekir.

İşlem Geçmişini Görüntüleme
API Metodu: GET /orders/history
Açıklama: Kullanıcının geçmişte başarıyla gerçekleştirdiği veya iptal ettiği tüm alım-satım işlemlerinin detaylı dökümünü kronolojik olarak sunar. Hangi fiyattan, ne zaman işlem yapıldığı gösterilir. Güvenlik için giriş yapmış olmak gerekir.

Listeden Varlık Çıkarma
API Metodu: DELETE /watchlists/{listId}/assets/{assetSymbol}
Açıklama: Kullanıcının artık takip etmek istemediği belirli bir hisse senedini veya kripto parayı izleme listesinden çıkarmasını sağlar. İşlem sadece kullanıcının kendi izleme listesinde yapılabilir. Güvenlik için giriş yapmış olmak gerekir.

AI Chatbot ile Sohbet
API Metodu: POST /ai/chat
Açıklama: Kullanıcının piyasa, teknik terimler veya varlıklar hakkında yapay zeka asistanına yazılı sorular sormasını ve anında cevap almasını sağlar. Finansal kararlara destek olmak için tasarlanmıştır. Güvenlik için giriş yapmış olmak gerekir.
