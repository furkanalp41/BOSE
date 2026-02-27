# Furkan Alp Günay'ın Mobil Frontend Görevleri

**Mobile Front-end Demo Videosu:** `Link buraya eklenecek`

**1. Üye Olma (Kayıt) Ekranı**
* **API Endpoint:** `POST /auth/register`
* **Görev:** Kullanıcı kayıt işlemi için mobil ekran tasarımı ve implementasyonu.
* **UI Bileşenleri:** Email, Şifre (güç göstergeli), Ad-Soyad inputları, "Kayıt Ol" butonu, Loading indicator.
* **Form Validasyonu:** Email format kontrolü, Şifre zorluğu (min 8 karakter, rakam/harf), Boş alan kontrolü.
* **Kullanıcı Deneyimi:** Başarılı kayıtta "Sanal Bakiyeniz Tanımlandı" mesajı ve login ekranına yönlendirme. Hatalı kayıtta input altında kırmızı uyarı metinleri.
* **Teknik Detaylar:** State management (form state), Android Jetpack Compose / iOS SwiftUI form yönetimi, Keyboard dismiss.

**2. Giriş Yapma Ekranı**
* **API Endpoint:** `POST /auth/login`
* **Görev:** Kullanıcıların JWT token alarak sisteme girmesini sağlayan arayüz.
* **UI Bileşenleri:** Email ve Şifre inputu, "Beni Hatırla" checkbox'ı, "Giriş" butonu, Borsa/Kripto temalı arka plan animasyonu.
* **Kullanıcı Deneyimi:** Form gönderilirken butonun "Yükleniyor" spinner'ına dönüşmesi. Hatalı girişte cihaz titreşimi (haptic feedback).
* **Teknik Detaylar:** Secure storage entegrasyonu (Token saklama), Navigation (Başarılı girişte Ana Ekrana geçiş).

**3. Kullanıcı Profil Görüntüleme Ekranı**
* **API Endpoint:** `GET /users/{userId}`
* **Görev:** Profil ve güncel cüzdan bakiyesini gösteren ekran tasarımı.
* **UI Bileşenleri:** Profil avatarı, Ad-Soyad, Güncel Sanal Bakiye (Büyük fontla, yeşil renkli), "Düzenle" ve "Çıkış Yap" butonları.
* **Kullanıcı Deneyimi:** Veri yüklenirken Skeleton Screen (iskelet yükleyici) gösterimi, Pull-to-refresh (yukarıdan çekip yenileme).
* **Teknik Detaylar:** API isteği atılırken global loading state kullanımı.

**4. Profil Bilgilerini Güncelleme Ekranı**
* **API Endpoint:** `PUT /users/{userId}`
* **Görev:** Kişisel bilgilerin değiştirildiği form arayüzü.
* **UI Bileşenleri:** Mevcut değerlerle dolu input alanları (Telefon format maskeli), "Kaydet" butonu.
* **Form Validasyonu:** Sadece değişen alanların aktif olması, real-time telefon/isim validasyonu.
* **Kullanıcı Deneyimi:** Optimistic update (değişikliklerin anında arayüze yansıması), başarısızlıkta eski veriye dönme.

**5. Hesap Silme Akışı**
* **API Endpoint:** `DELETE /users/{userId}`
* **Görev:** Hesabı kalıcı olarak silme arayüzü ve onay mekanizması.
* **UI Bileşenleri:** Kırmızı "Hesabımı Sil" butonu, Çift onaylı Bottom Sheet / Dialog ekranı.
* **Kullanıcı Deneyimi:** Destructive action (yıkıcı işlem) olduğu için belirgin uyarı ikonları, işlemi iptal etme kolaylığı.
* **Teknik Detaylar:** Multi-step dialog yönetimi, silme sonrası navigasyon yığınının (stack) temizlenip Login ekranına atılması.

**6. AI Tercihlerini Kaydetme Ekranı (AI Görevi)**
* **API Endpoint:** `POST /users/{userId}/ai-preferences`
* **Görev:** Yapay zekanın kullanıcıya sunacağı risk profilinin seçildiği ekran.
* **UI Bileşenleri:** Düşük/Orta/Yüksek risk seviyeleri için animasyonlu seçim kartları (Radio Group mantığı), "Tercihleri Kaydet" butonu.
* **Kullanıcı Deneyimi:** Her risk kartına tıklandığında yapay zekanın ne tür hisseler önereceğinin alt bilgi olarak anlık gösterilmesi.
