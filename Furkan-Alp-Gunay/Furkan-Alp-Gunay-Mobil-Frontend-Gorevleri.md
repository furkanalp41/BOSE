# Furkan Alp Günay'ın Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** `Link buraya eklenecek`

**1. Giriş Yapma Ekranı**
* **API Endpoint:** `POST /auth/login`
* **Görev:** Kullanıcıların JWT token alarak sisteme girmesini sağlayan arayüz.
* **UI Bileşenleri:** Email ve Şifre inputu, göz ikonu ile şifre göster/gizle, "Giriş Yap" butonu.
* **Kullanıcı Deneyimi:** Form gönderilirken butonun spinner'a dönüşmesi. Hatalı girişte hata mesajı gösterimi.
* **Teknik Detaylar:** Secure storage entegrasyonu (JWT token saklama), başarılı girişte ana ekrana navigasyon.

**2. Üye Olma (Kayıt) Ekranı**
* **API Endpoint:** `POST /auth/register`
* **Görev:** Yeni kullanıcı kayıt formunun mobil arayüz tasarımı.
* **UI Bileşenleri:** fullName, Email, Şifre inputları, "Kayıt Ol" butonu, Loading indicator.
* **Form Validasyonu:** Email format kontrolü, şifre minimum 6 karakter, boş alan kontrolü.
* **Kullanıcı Deneyimi:** Başarılı kayıtta otomatik giriş ve ana ekrana yönlendirme. Hatalı kayıtta input altında uyarı metinleri.

**3. Profil Görüntüleme Ekranı**
* **API Endpoint:** `GET /users/me`
* **Görev:** Profil ve güncel bakiye bilgilerini gösteren ekran tasarımı.
* **UI Bileşenleri:** Profil avatarı, Ad-Soyad, Güncel Sanal Bakiye (büyük fontla, yeşil renkli), Rol göstergesi, "Düzenle" ve "Çıkış Yap" butonları.
* **Kullanıcı Deneyimi:** Skeleton Screen (iskelet yükleyici) gösterimi, Pull-to-refresh desteği.

**4. Profil Bilgilerini Güncelleme Ekranı**
* **API Endpoint:** `PUT /users/:userId`
* **Görev:** Kullanıcı profil bilgilerini düzenleme form arayüzü.
* **UI Bileşenleri:** Mevcut değerlerle dolu full_name ve risk_level inputları, "Kaydet" butonu.
* **Kullanıcı Deneyimi:** Başarılı güncelleme sonrası toast bildirimi.

**5. Hesap Silme Akışı**
* **API Endpoint:** `DELETE /users/:userId`
* **Görev:** Hesabı kalıcı olarak silme arayüzü ve onay mekanizması.
* **UI Bileşenleri:** Kırmızı "Hesabımı Sil" butonu, çift onaylı Dialog ekranı.
* **Kullanıcı Deneyimi:** "Bu işlem geri alınamaz" uyarısı, silme sonrası login ekranına yönlendirme.
* **Teknik Detaylar:** Silme sonrası navigasyon yığınının temizlenip Login ekranına atılması.

**6. AI Tercihlerini Kaydetme Ekranı**
* **API Endpoint:** `POST /users/:userId/ai-preferences`
* **Görev:** Yapay zekanın kullanıcıya sunacağı risk profilinin seçildiği ekran.
* **UI Bileşenleri:** LOW/MEDIUM/HIGH risk seviyeleri için seçim kartları, SHORT_TERM/MEDIUM_TERM/LONG_TERM vade seçimi, "Tercihleri Kaydet" butonu.
* **Kullanıcı Deneyimi:** Seçim yapıldığında kartın vurgulanması ve kayıt sonrası geri bildirim.

**7. Admin Paneli Ekranı**
* **API Endpoint:** `GET /admin/logs`, `PUT /admin/users/:id/role`, `DELETE /admin/users/:id`
* **Görev:** Yönetici kullanıcı yönetimi ve log görüntüleme ekranı.
* **UI Bileşenleri:** Kullanıcı listesi, rol değiştirme switch, silme butonu, audit log tablosu.
* **Kullanıcı Deneyimi:** Sadece admin rolündeki hesaplarda görünür. Swipe-to-delete ile kullanıcı silme.
