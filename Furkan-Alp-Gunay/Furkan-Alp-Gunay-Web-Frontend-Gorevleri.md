Furkan Alp Günay'ın Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Üye Olma (Kayıt) Sayfası

API Endpoint: POST /auth/register
Görev: Kullanıcı kayıt işlemi için web sayfası tasarımı ve implementasyonu
UI Bileşenleri:
Responsive kayıt formu (desktop ve mobile uyumlu)
Email input alanı (type="email", autocomplete="email")
Şifre input alanı (type="password", şifre gücü göstergesi)
Ad (firstName) input alanı
Soyad (lastName) input alanı
"Kayıt Ol" butonu (primary button style)
"Zaten hesabınız var mı? Giriş Yap" linki
Loading spinner (kayıt işlemi sırasında)
Form container (card veya centered layout, borsa temalı)
Form Validasyonu:
JavaScript real-time validation
Email format kontrolü (regex pattern)
Şifre güvenlik kuralları (min 8 karakter, büyük/küçük harf, rakam)
Tüm alanlar geçerli olmadan buton disabled
Kullanıcı Deneyimi:
Form hatalarını input altında gösterilmesi (inline validation)
Başarılı kayıt sonrası success notification ve sanal bakiye bildirimi
Hata durumlarında kullanıcı dostu mesajlar (409 Conflict)
Teknik Detaylar:
Framework: React/Vue/Angular veya Vanilla JS
Form library: React Hook Form, Formik
State management (form state, loading state, error state)

Giriş Yapma Sayfası

API Endpoint: POST /auth/login
Görev: Kullanıcı giriş işlemi ve token yönetimi için sayfa tasarımı
UI Bileşenleri:
Email input alanı
Şifre input alanı (göz ikonu ile şifre göster/gizle)
"Beni Hatırla" checkbox
"Giriş Yap" butonu
Kullanıcı Deneyimi:
Başarılı girişte dashboard/piyasa ekranına yönlendirme
Hatalı girişte shake (titreme) animasyonu ve hata mesajı
Teknik Detaylar:
JWT Token'ın localStorage veya HTTP-Only cookie'de saklanması
Protected route mantığına geçiş
Global auth state güncellemesi

Kullanıcı Profil Görüntüleme Sayfası

API Endpoint: GET /users/{userId}
Görev: Kullanıcı profil ve cüzdan bilgilerini görüntüleme sayfası tasarımı
UI Bileşenleri:
Responsive profil layout (desktop: sidebar + content)
Kullanıcı adı ve soyadı (H1 heading)
Güncel Sanal Bakiye göstergesi (büyük font, yeşil renk)
Email adresi ve Telefon numarası
"Profili Düzenle" butonu
"Çıkış Yap" butonu
Kullanıcı Deneyimi:
Loading skeleton screen (veri yüklenirken)
Sanal bakiyenin animasyonlu (counter) şekilde yüklenmesi
Teknik Detaylar:
State management (user data, loading, error states)
Routing (profil düzenleme sayfasına geçiş)

Kullanıcı Profil Düzenleme Sayfası

API Endpoint: PUT /users/{userId}
Görev: Kullanıcı profil bilgilerini düzenleme sayfası tasarımı
UI Bileşenleri:
Ad, Soyad, Email ve Telefon input alanları (mevcut değerle dolu)
"Kaydet" ve "İptal" butonları
Değişiklik yapıldığında "Kaydet" butonu aktif olur
Form Validasyonu:
Telefon numarası format kontrolü (input masking)
Real-time validation feedback
Kullanıcı Deneyimi:
Optimistic update (kaydet butonuna basıldığında UI anında güncellenir)
Başarılı güncelleme sonrası toast bildirimi
Teknik Detaylar:
Form state management (initial values, edited values)
Unsaved changes warning (sayfa kapatılırken uyarı)

Hesap Silme Akışı

API Endpoint: DELETE /users/{userId}
Görev: Kullanıcı hesabını silme işlemi için web UI akışı tasarımı
UI Bileşenleri:
"Hesabı Sil" butonu (kırmızı danger button style)
Modal dialog (destructive action için)
"Emin misiniz?" onay checkbox'ı
Kullanıcı Deneyimi:
Destructive action için görsel uyarılar (kırmızı renk, warning icons)
Başarılı silme sonrası localStorage temizliği ve login sayfasına yönlendirme
Teknik Detaylar:
Modal/Dialog component kullanımı
Logout işlemi entegrasyonu

AI Tercihlerini Kaydetme Sayfası

API Endpoint: POST /users/{userId}/ai-preferences
Görev: Yapay zeka yatırım risk tercihlerinin seçildiği form ekranı
UI Bileşenleri:
Düşük, Orta ve Yüksek risk seçenekleri için interaktif kartlar
Seçilen karta göre değişen açıklama metinleri
"Tercihleri Kaydet" butonu
Kullanıcı Deneyimi:
Seçim yapıldığında kartların etrafında parlayan border (aktif durumu)
Teknik Detaylar:
API'ye Enum değerlerinin (LOW, MEDIUM, HIGH) doğru iletilmesi
API yanıtı beklenirken buton içinde spinner gösterimi
