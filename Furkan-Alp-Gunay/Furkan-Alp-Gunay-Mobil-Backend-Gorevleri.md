# Furkan Alp Günay'ın Mobil Backend Görevleri

**Mobil Front-end ile Back-end Bağlanmış Test Videosu:** `Link buraya eklenecek`

**1. Üye Olma (Kayıt) Servisi**
* **API Endpoint:** `POST /auth/register`
* **Görev:** Mobil uygulamada kullanıcı kayıt işlemini gerçekleştiren servis entegrasyonu.
* **İşlevler:**
  * Kullanıcı bilgilerini (email, password, fullName) toplama.
  * Form validasyonu (email formatı, şifre zorluğu kontrolü).
  * API'ye POST isteği gönderme ve başlangıç bakiyesinin (sanal para) tanımlanmasını bekleme.
  * Başarılı kayıt durumunda kullanıcıyı giriş ekranına yönlendirme.
* **Teknik Detaylar:**
  * HTTP Client kullanımı (Android için Retrofit/OkHttp, iOS için Alamofire).
  * Request/Response model sınıfları oluşturma (JSON parsing).
  * Error handling (400 Bad Request, 409 Conflict - Email zaten var).

**2. Giriş Yapma Servisi**
* **API Endpoint:** `POST /auth/login`
* **Görev:** Kullanıcı giriş işlemlerini ve JWT Token yönetimini sağlayan entegrasyon.
* **İşlevler:**
  * Email ve şifre ile API'ye istek atma.
  * Dönen JWT Access Token'ı cihazda güvenli bir şekilde saklama (Secure Storage / Keychain).
  * Başarılı girişte kullanıcıyı Ana Ekrana (Piyasa/Portföy) yönlendirme.
* **Teknik Detaylar:**
  * Şifrelenmiş depolama (EncryptedSharedPreferences).
  * Token expiration (süre dolumu) kontrolü mekanizması.

**3. Profil Görüntüleme Servisi**
* **API Endpoint:** `GET /users/{userId}`
* **Görev:** Kullanıcı profil ve güncel bakiye bilgilerini API'den çekip mobil UI'da gösterme.
* **İşlevler:**
  * JWT token ile kimlik doğrulama.
  * Kullanıcı ID'sini kullanarak verileri getirme ve arayüze basma.
  * Çevrimdışı (offline) durumlarda cache'den son bakiyeyi gösterme.
* **Teknik Detaylar:**
  * Header kısmına `Authorization: Bearer {token}` ekleme (Interceptor ile).
  * Error handling (401 Unauthorized - Token süresi dolmuşsa login'e atma).

**4. Profil Bilgilerini Güncelleme Servisi**
* **API Endpoint:** `PUT /users/{userId}`
* **Görev:** Kullanıcı profil bilgilerini (telefon, isim vb.) güncelleme işlemini gerçekleştirme.
* **İşlevler:**
  * Profil düzenleme ekranından verileri toplayıp JSON formatında API'ye iletme.
  * Başarılı güncelleme sonrası lokal önbelleği (cache) güncelleme.
  * Yükleniyor (Loading) state yönetimi.
* **Teknik Detaylar:**
  * Partial update desteği (yalnızca değişen alanları gönderme).
  * 403 Forbidden ve 400 Bad Request hatalarını yakalama.

**5. Hesap Silme Servisi**
* **API Endpoint:** `DELETE /users/{userId}`
* **Görev:** Kullanıcı hesabını sistemden silme işlemini gerçekleştirme.
* **İşlevler:**
  * Yanlışlıkla silmeyi önlemek için onay dialog'u (Confirmation) gösterme.
  * Silme işlemi başarılı olduğunda cihazdaki Token'ı ve tüm önbelleği temizleme.
* **Teknik Detaylar:**
  * Local data cleanup (Veritabanı ve SharedPreferences temizliği).
  * Kullanıcıyı zorunlu Logout durumuna alma.

**6. AI Tercihlerini Kaydetme Servisi**
* **API Endpoint:** `POST /users/{userId}/ai-preferences`
* **Görev:** Kullanıcının yapay zeka asistanından beklediği risk profilini sisteme kaydetme.
* **İşlevler:**
  * Düşük/Orta/Yüksek risk seçimlerini API'ye iletme.
  * Yapay zeka servislerinin optimizasyonu için tercihleri arka planda eşitleme.
* **Teknik Detaylar:**
  * HTTP POST isteğinde Enum (RiskLevel) verilerinin doğru eşleştirilmesi.
