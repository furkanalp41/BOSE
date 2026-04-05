Furkan Alp Günay'ın Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Login Sayfası (LoginPage.jsx)

API Endpoint: POST /auth/login
Görev: Kullanıcı giriş işlemi ve JWT token yönetimi için sayfa tasarımı
UI Bileşenleri:
Email input alanı
Şifre input alanı (göz ikonu ile şifre göster/gizle)
"Giriş Yap" butonu
Kullanıcı Deneyimi:
Başarılı girişte dashboard ekranına yönlendirme
Hatalı girişte hata mesajı gösterimi
JWT Token Zustand auth store'a kaydedilir
Teknik Detaylar:
Zustand state management (auth store)
Axios interceptor ile otomatik token ekleme
Protected route guard

Register Sayfası (RegisterPage.jsx)

API Endpoint: POST /auth/register
Görev: Yeni kullanıcı kayıt formu tasarımı ve implementasyonu
UI Bileşenleri:
fullName input alanı
Email input alanı (format validasyonu)
Şifre input alanı
"Kayıt Ol" butonu
"Zaten hesabınız var mı? Giriş Yap" linki
Loading spinner (kayıt işlemi sırasında)
Form Validasyonu:
Email format kontrolü
Şifre güvenlik kuralları (minimum 6 karakter)
Tüm alanlar dolu kontrolü
Kullanıcı Deneyimi:
Başarılı kayıtta otomatik giriş ve dashboard'a yönlendirme
Hata durumlarında kullanıcı dostu mesajlar (409 email zaten var)

Profil Kartı (ProfileCard.jsx)

API Endpoint: GET /users/me
Görev: Kullanıcı profil ve bakiye bilgilerini görüntüleme
UI Bileşenleri:
Kullanıcı adı ve email gösterimi
Güncel sanal bakiye (100.000 TRY başlangıç)
Rol göstergesi (user/admin)
"Düzenle" butonu
Kullanıcı Deneyimi:
Skeleton loading (veri yüklenirken)
Bakiyenin büyük fontla gösterimi

AI Tercihleri (AIPreferences.jsx)

API Endpoint: POST /users/:userId/ai-preferences
Görev: Yapay zeka yatırım risk tercihlerinin seçildiği form
UI Bileşenleri:
Risk seviyesi seçim kartları (LOW, MEDIUM, HIGH)
Yatırım vadesi seçimi (SHORT_TERM, MEDIUM_TERM, LONG_TERM)
"Tercihleri Kaydet" butonu
Kullanıcı Deneyimi:
Seçim yapıldığında kartların etrafında parlayan border
API yanıtı beklenirken buton içinde spinner
Teknik Detaylar:
Enum değerlerinin (LOW, MEDIUM, HIGH) doğru iletilmesi

Hesap Silme (DangerZone.jsx)

API Endpoint: DELETE /users/:userId
Görev: Kullanıcı hesabını silme işlemi için web UI akışı
UI Bileşenleri:
"Hesabı Sil" butonu (kırmızı danger button style)
Modal dialog (destructive action onayı)
Kullanıcı Deneyimi:
Kırmızı renk ve uyarı ikonları ile görsel uyarılar
Silme sonrası localStorage temizliği ve login sayfasına yönlendirme
Teknik Detaylar:
Modal component state yönetimi
Logout işlemi entegrasyonu

Admin Paneli (AdminPanel.jsx)

API Endpoint: GET /admin/logs, PUT /admin/users/:id/role, DELETE /admin/users/:id
Görev: Yönetici kullanıcı yönetimi ve log görüntüleme paneli
UI Bileşenleri:
Kullanıcı listesi tablosu
Rol değiştirme (user/admin) toggle
Kullanıcı silme butonu
Audit log görüntüleme
Kullanıcı Deneyimi:
Sadece admin rolündeki kullanıcılar bu sayfayı görebilir (Protected Route)
Teknik Detaylar:
Role-based Access Control (RBAC) ile frontend menü gizleme/gösterme

Sidebar (Sidebar.jsx)

Görev: Navigasyon menüsü ve aktif sayfa göstergesi
UI Bileşenleri:
Sayfa linkleri (Dashboard, Trading, Watchlist, AI, Market, Leaderboard, Profil)
Admin menüsü (sadece admin rolünde görünür)
Aktif sayfa vurgusu
Teknik Detaylar:
React Router v6 entegrasyonu
Responsive sidebar (mobile-first)

Dashboard Layout (DashboardPage.jsx)

Görev: Ana sayfa düzeni ve section routing
UI Bileşenleri:
Sol sidebar + sağ içerik alanı
Section routing (sayfa içi navigasyon)
Teknik Detaylar:
Tailwind CSS dark theme
Responsive grid layout
