Furkan Alp Günay'ın Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Üye Olma (Kayıt) Sayfası
API Endpoint: POST /auth/register
Görev: Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu
UI Bileşenleri:
Responsive kayıt formu (desktop ve mobile uyumlu)
Email input alanı (type="email", autocomplete="email")
Şifre input alanı (type="password", şifre gücü göstergesi)
Ad Soyad (fullName) input alanı
"Kayıt Ol" butonu (primary button style)
"Zaten hesabınız var mı? Giriş Yap" linki
Loading spinner (kayıt işlemi sırasında)
Form container (card veya centered layout, borsa temalı)
Form Validasyonu:
JavaScript real-time validation
Email format kontrolü (regex pattern)
Şifre güvenlik kuralları (min 8 karakter, büyük/küçük harf, rakam)

Giriş Yapma Sayfası
API Endpoint: POST /auth/login
Görev: Kullanıcı giriş işlemi ve token yönetimi için sayfa tasarımı
UI Bileşenleri:
Email input alanı
Şifre input alanı (göz ikonu ile şifre göster/gizle)
"Giriş Yap" butonu

Kendi Profilini Görüntüleme Sayfası
API Endpoint: GET /users/me
Görev: Kullanıcının kendi profil ve cüzdan bilgilerini görüntüleme sayfası tasarımı
UI Bileşenleri:
Responsive profil layout (desktop: sidebar + content)
Kullanıcı adı ve soyadı
Güncel Sanal Bakiye göstergesi (büyük font, yeşil renk)
"Profili Düzenle" butonu
"Çıkış Yap" butonu

Kullanıcı Detayı Görüntüleme Sayfası
API Endpoint: GET /users/{userId}
Görev: Herhangi bir kullanıcının bilgilerinin (genellikle Admin tarafından) görüntülenmesi
UI Bileşenleri:
Kullanıcı temel bilgilerini (id, email vb.) gösteren tablo veya kart

Kullanıcı Profil Düzenleme Sayfası
API Endpoint: PUT /users/{userId}
Görev: Kullanıcı profil bilgilerini düzenleme sayfası tasarımı
UI Bileşenleri:
Ad Soyad ve Telefon input alanları (mevcut değerle dolu)
"Kaydet" ve "İptal" butonları
Değişiklik yapıldığında "Kaydet" butonu aktif olur
Form Validasyonu:
Telefon numarası format kontrolü

Hesap Silme Akışı
API Endpoint: DELETE /users/{userId}
Görev: Kullanıcı hesabını silme işlemi için web UI akışı tasarımı
UI Bileşenleri:
"Hesabı Sil" butonu (kırmızı danger button style)
Modal dialog (destructive action için)
"Emin misiniz?" onay checkbox'ı

AI Tercihlerini Kaydetme Formu
API Endpoint: POST /users/{userId}/ai-preferences
Görev: Yapay zeka yatırım risk seviyesi ve vade tercihlerinin kaydedilmesi

Admin Loglarını Görüntüleme
API Endpoint: GET /admin/logs
Görev: Adminlerin sistem loglarını görüntülemesi
UI Bileşenleri:
Log metinlerini renklendirerek gösteren bir konsol arayüzü

Admin Kullanıcı Silme
API Endpoint: DELETE /admin/users/{id}
Görev: Admin tarafından zararlı / inaktif bir kullanıcının silinmesi

Admin Kullanıcı Rolü Güncelleme
API Endpoint: PUT /admin/users/{id}/role
Görev: Adminin kullanıcı rolünü (user/admin) değiştirmesi
UI Bileşenleri:
Kullanıcı profili sayfasında adminler için Role Select dropdown'ı ve kaydet butonu
