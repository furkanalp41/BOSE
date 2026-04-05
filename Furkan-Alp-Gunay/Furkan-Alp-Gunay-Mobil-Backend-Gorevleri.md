# Furkan Alp Günay'ın Mobil Backend Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. Üye Olma (Kayıt) Servisi**
* **API Endpoint:** `POST /auth/register`
* **Görev:** Mobil uygulamada kullanıcı kayıt işlemini gerçekleştiren servis entegrasyonu.
* **İşlevler:**
  * Kullanıcı bilgilerini (fullName, email, password) toplama.
  * Form validasyonu (email formatı, şifre kontrolü).
  * API'ye POST isteği gönderme ve 100.000 TRY başlangıç bakiyesinin tanımlanmasını bekleme.
  * Başarılı kayıt durumunda JWT token saklama ve ana ekrana yönlendirme.
* **Teknik Detaylar:**
  * HTTP Client kullanımı (Retrofit/OkHttp veya Alamofire).
  * Request/Response model sınıfları oluşturma (JSON parsing).
  * Error handling (400 Bad Request, 409 Conflict - Email zaten var).

**2. Giriş Yapma Servisi**
* **API Endpoint:** `POST /auth/login`
* **Görev:** Kullanıcı giriş işlemlerini ve JWT Token yönetimini sağlayan entegrasyon.
* **İşlevler:**
  * Email ve şifre ile API'ye istek atma.
  * Dönen JWT Token'ı cihazda güvenli bir şekilde saklama (Keychain/SharedPreferences).
  * Başarılı girişte ana ekrana yönlendirme.
* **Teknik Detaylar:**
  * Şifrelenmiş depolama (EncryptedSharedPreferences).
  * Token expiration kontrolü mekanizması.

**3. Profil Görüntüleme Servisi**
* **API Endpoint:** `GET /users/me`
* **Görev:** Aktif kullanıcının profil ve güncel bakiye bilgilerini API'den çekip gösterme.
* **İşlevler:**
  * JWT token ile kimlik doğrulama.
  * Kullanıcı verilerini (ad, email, rol, bakiye) getirme ve arayüze basma.
* **Teknik Detaylar:**
  * Header kısmına `Authorization: Bearer {token}` ekleme (Interceptor ile).
  * Error handling (401 Unauthorized - Token süresi dolmuşsa login'e yönlendirme).

**4. Profil Bilgilerini Güncelleme Servisi**
* **API Endpoint:** `PUT /users/:userId`
* **Görev:** Kullanıcı profil bilgilerini (full_name, risk_level) güncelleme işlemini gerçekleştirme.
* **İşlevler:**
  * Profil düzenleme ekranından verileri toplayıp JSON formatında API'ye iletme.
  * Başarılı güncelleme sonrası lokal önbelleği güncelleme.
* **Teknik Detaylar:**
  * Partial update desteği (yalnızca değişen alanları gönderme).
  * Loading state yönetimi.

**5. Hesap Silme Servisi**
* **API Endpoint:** `DELETE /users/:userId`
* **Görev:** Kullanıcı hesabını sistemden silme işlemini gerçekleştirme.
* **İşlevler:**
  * Yanlışlıkla silmeyi önlemek için onay dialog'u gösterme.
  * Silme işlemi başarılı olduğunda cihazdaki Token'ı ve tüm önbelleği temizleme.
* **Teknik Detaylar:**
  * Local data cleanup (Token ve cache temizliği).
  * Kullanıcıyı zorunlu Logout durumuna alma ve login ekranına yönlendirme.

**6. AI Tercihlerini Kaydetme Servisi**
* **API Endpoint:** `POST /users/:userId/ai-preferences`
* **Görev:** Kullanıcının yapay zeka asistanından beklediği risk profilini sisteme kaydetme.
* **İşlevler:**
  * Risk seviyesi (LOW/MEDIUM/HIGH) ve yatırım vadesi (SHORT_TERM/MEDIUM_TERM/LONG_TERM) seçimlerini API'ye iletme.
* **Teknik Detaylar:**
  * HTTP POST isteğinde Enum (riskLevel, investmentTerm) verilerinin doğru eşleştirilmesi.

**7. Admin Log Görüntüleme Servisi**
* **API Endpoint:** `GET /admin/logs`
* **Görev:** Admin ekranında sistem audit loglarını listeleme.
* **İşlevler:**
  * Admin rolü kontrolü, log verilerini çekme ve listeleme.
* **Teknik Detaylar:**
  * 403 Forbidden hata yönetimi (admin değilse erişim engeli).

**8. Admin Kullanıcı Rolü Güncelleme Servisi**
* **API Endpoint:** `PUT /admin/users/:id/role`
* **Görev:** Kullanıcı rolünü (user/admin) değiştirme.
* **İşlevler:**
  * Rol değiştirme isteğini API'ye gönderme.
  * Başarılı güncelleme sonrası listeyi yenileme.

**9. Admin Kullanıcı Silme Servisi**
* **API Endpoint:** `DELETE /admin/users/:id`
* **Görev:** Admin panelinden kullanıcı silme işlemini gerçekleştirme.
* **İşlevler:**
  * Onay dialog'u gösterme ve silme isteğini API'ye iletme.
