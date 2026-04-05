Üye Olma
API Metodu: POST /auth/register
Açıklama: Kullanıcıların fullName, email ve password bilgileriyle sisteme kayıt olmasını sağlar. Başarılı kayıt sonrası kullanıcıya 100.000 TRY sanal başlangıç bakiyesi tanımlanır ve JWT token döner.

Giriş Yapma
API Metodu: POST /auth/login
Açıklama: Kayıtlı kullanıcıların e-posta ve şifre bilgilerini doğrulayarak sisteme güvenli erişim sağlamasını kontrol eder. Başarılı giriş durumunda kullanıcının işlemlerine devam edebilmesi için JWT token (HS256) üretilir.

Profil Görüntüleme
API Metodu: GET /users/me
Açıklama: Aktif kullanıcının kendi profil bilgilerini görüntülemesini sağlar. Kullanıcı adı, email, rol ve sanal hesap bakiyesi durumu gösterilir. Güvenlik için giriş yapmış olmak gerekir.

Kullanıcı Detayı
API Metodu: GET /users/:userId
Açıklama: ID ile belirli bir kullanıcının profil bilgilerini getirir. Kullanıcı adı, email ve bakiye bilgileri gösterilir. Güvenlik için giriş yapmış olmak gerekir.

Profil Bilgilerini Güncelleme
API Metodu: PUT /users/:userId
Açıklama: Kullanıcının full_name ve risk_level gibi profil bilgilerini güncellemesini sağlar. Güvenlik için giriş yapmış olmak gerekir ve kullanıcılar yalnızca kendi bilgilerini güncelleyebilir.

Hesap Silme
API Metodu: DELETE /users/:userId
Açıklama: Kullanıcının hesabını sistemden kalıcı olarak silmesini sağlar. Bu işlem geri alınamaz ve kullanıcının tüm verileri silinir. Güvenlik için giriş yapmış olmak gerekir.

AI Tercihlerini Kaydetme
API Metodu: POST /users/:userId/ai-preferences
Açıklama: Kullanıcının yapay zeka asistanından alacağı tavsiyelerin profilini belirlemesini sağlar. Risk seviyesi (LOW, MEDIUM, HIGH) ve yatırım vadesi (SHORT_TERM, MEDIUM_TERM, LONG_TERM) tercihleri sisteme kaydedilir. Bu tercihler AI analiz raporlarında kullanılır. Güvenlik için giriş yapmış olmak gerekir.

Admin Log Görüntüleme
API Metodu: GET /admin/logs
Açıklama: Yönetici yetkisine sahip kullanıcıların sistem audit loglarını görüntülemesini sağlar. Sadece admin rolündeki kullanıcılar erişebilir.

Admin Kullanıcı Rolü Güncelleme
API Metodu: PUT /admin/users/:id/role
Açıklama: Yönetici yetkisine sahip kullanıcıların diğer kullanıcıların rolünü (user/admin) değiştirmesini sağlar. Sadece admin rolü gerektirir.

Admin Kullanıcı Silme
API Metodu: DELETE /admin/users/:id
Açıklama: Yönetici yetkisine sahip kullanıcıların herhangi bir kullanıcıyı sistemden silmesini sağlar. Sadece admin rolü gerektirir.
