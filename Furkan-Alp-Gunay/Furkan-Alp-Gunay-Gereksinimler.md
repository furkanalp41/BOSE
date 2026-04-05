Üye Olma
API Metodu: POST /auth/register
Açıklama: Sisteme yeni bir kullanıcı kaydeder ve 100.000 TL başlangıç sanal bakiyesini tanımlar.

Giriş Yapma
API Metodu: POST /auth/login
Açıklama: Kullanıcının e-posta ve şifre bilgilerini doğrulayarak sisteme giriş yapmasını sağlar. Başarılı giriş durumunda JWT token döner.

Kendi Profilini Görüntüleme
API Metodu: GET /users/me
Açıklama: JWT token'dan alınan kullanıcı ID'si ile kişinin kendi profil bilgilerini (sanal bakiye, rol vs.) getirir. Güvenlik için giriş yapmış olmak gerekir.

Kullanıcı Detayı Görüntüleme
API Metodu: GET /users/{userId}
Açıklama: Belirtilen kullanıcının profil bilgilerini getirir. Güvenlik için giriş yapmış olmak gerekir.

Profil Bilgilerini Güncelleme
API Metodu: PUT /users/{userId}
Açıklama: Kullanıcı profil bilgilerini (Ad Soyad, telefon vb.) günceller. Güvenlik için giriş yapmış olmak gerekir.

Hesap Silme
API Metodu: DELETE /users/{userId}
Açıklama: Kullanıcının hesabını sistemden kalıcı olarak silmesini sağlar. Yönetici tarafından veya kişinin kendi isteğiyle hesap kapatıldığında kullanılır. Güvenlik için giriş yapmış olmak gerekir.

AI Tercihlerini Kaydetme
API Metodu: POST /users/{userId}/ai-preferences
Açıklama: Yapay zeka yatırım risk seviyesi ve vade tercihlerini kaydeder. Güvenlik için giriş yapmış olmak gerekir.

Admin Loglarını Görüntüleme
API Metodu: GET /admin/logs
Açıklama: Sistem yönetim loglarını getirir. Sadece Admin yetkisi gerektirir.

Admin Kullanıcı Silme
API Metodu: DELETE /admin/users/{id}
Açıklama: Admin yetkisiyle herhangi bir kullanıcıyı siler. Sadece Admin yetkisi gerektirir.

Admin Kullanıcı Rolü Güncelleme
API Metodu: PUT /admin/users/{id}/role
Açıklama: Kullanıcının rolünü (user/admin) günceller. Sadece Admin yetkisi gerektirir.
