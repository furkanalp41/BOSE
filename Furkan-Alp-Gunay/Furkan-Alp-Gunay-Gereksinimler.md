Üye Olma
API Metodu: POST /auth/register
Açıklama: Kullanıcıların yeni hesaplar oluşturarak sisteme kayıt olmasını sağlar. Kişisel bilgilerin toplanmasını ve hesap oluşturma işlemlerini içerir. Kullanıcılar email adresi ve şifre belirleyerek hesap oluşturur. Başarılı kayıt sonrası kullanıcıya sanal başlangıç bakiyesi tanımlanır.

Giriş Yapma
API Metodu: POST /auth/login
Açıklama: Kayıtlı kullanıcıların e-posta ve şifre bilgilerini doğrulayarak sisteme güvenli erişim sağlamasını kontrol eder. Başarılı giriş durumunda kullanıcının işlemlerine devam edebilmesi için JWT token üretilmesini sağlar.

Profil Görüntüleme
API Metodu: GET /users/{userId}
Açıklama: Kullanıcının profil bilgilerini görüntülemesini sağlar. Kullanıcı adı, email, telefon gibi kişisel bilgiler ve sanal hesap bakiyesi durumu gösterilir. Kullanıcılar kendi profil bilgilerini görüntüleyebilir veya yöneticiler diğer kullanıcıların bilgilerini inceleyebilir. Güvenlik için giriş yapmış olmak gerekir.

Profil Bilgilerini Güncelleme
API Metodu: PUT /users/{userId}
Açıklama: Kullanıcının profil bilgilerini güncellemesini sağlar. Kullanıcılar ad, soyad, email, telefon gibi kişisel bilgilerini değiştirebilir. Güvenlik için giriş yapmış olmak gerekir ve kullanıcılar yalnızca kendi bilgilerini güncelleyebilir.

Hesap Silme
API Metodu: DELETE /users/{userId}
Açıklama: Kullanıcının hesabını sistemden kalıcı olarak silmesini sağlar. Kullanıcı hesabını kapatmak istediğinde veya yönetici tarafından hesap kapatılması gerektiğinde kullanılır. Bu işlem geri alınamaz ve kullanıcının tüm verileri silinir. Güvenlik için giriş yapmış olmak gerekir.

AI Tercihlerini Kaydetme
API Metodu: POST /users/{userId}/ai-preferences
Açıklama: Kullanıcının yatırım yaparken yapay zeka asistanından ne tür tavsiyeler alacağını belirlemesini sağlar. Risk seviyesi (düşük, orta, yüksek) gibi yatırım tercihleri sisteme kaydedilir. Güvenlik için giriş yapmış olmak gerekir.

