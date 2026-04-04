# Furkan Alp Gunay - Frontend Dokumantasyonu

> **YouTube Video Linki:** [BURAYA EKLENECEK]

## Genel Bilgiler

| Bilgi | Deger |
|-------|-------|
| **Canli Frontend URL** | https://bose-front.vercel.app |
| **API Baglantisi** | https://bose-final-api.onrender.com/api |
| **Framework** | React 19 + Vite |
| **Stil** | Tailwind CSS v4 (Dark Theme) |
| **HTTP Client** | Axios |
| **Routing** | React Router v7 |

---

## Kurulum ve Calistirma

```bash
cd Furkan-Alp-Gunay/frontend

# Bagimliliklari yukle
npm install

# .env dosyasini duzenle
# VITE_API_URL=http://localhost:8080/api

# Gelistirme sunucusunu baslat
npm run dev

# Production build
npm run build
```

**Ortam Degiskenleri (.env):**

| Degisken | Aciklama | Varsayilan |
|----------|----------|------------|
| `VITE_API_URL` | Backend API adresi | `http://localhost:8080/api` |

---

## Proje Yapisi

```
frontend/src/
├── main.jsx                    # Uygulama giris noktasi (BrowserRouter + AuthProvider)
├── App.jsx                     # Route tanimlari ve layout
├── index.css                   # Tailwind CSS import
├── api/
│   └── axios.js                # Axios instance (JWT interceptor)
├── context/
│   └── AuthContext.jsx         # Kimlik dogrulama state yonetimi
├── components/
│   ├── ProtectedRoute.jsx      # Korunmus route wrapper
│   └── Navbar.jsx              # Navigasyon bari
└── pages/
    ├── Login.jsx               # Giris sayfasi
    ├── Register.jsx            # Kayit sayfasi
    ├── Dashboard.jsx           # Ana panel
    ├── Profile.jsx             # Profil goruntuleme/duzenleme/silme
    └── AIPreferences.jsx       # AI tercih ayarlari
```

---

## Sayfa ve Bilesen Aciklamalari

### Login.jsx - Giris Sayfasi
- Email ve sifre formu
- Goster/gizle sifre butonu
- Hata mesajlari gosterimi
- Basarili giriste Dashboard'a yonlendirme

### Register.jsx - Kayit Sayfasi
- Ad soyad, email, sifre ve sifre tekrar formu
- Canli sifre guc gostergesi (uzunluk, buyuk harf, kucuk harf, rakam)
- Sifre esleme kontrolu
- Tum kontroller gecene kadar buton devre disi

### Dashboard.jsx - Ana Panel
- Hosgeldin mesaji ve kullanici adi
- Sanal bakiye gosterimi (TRY formatinda)
- Email, rol ve risk seviyesi bilgi kartlari
- Profil ve AI Tercihleri sayfasi baglantilari

### Profile.jsx - Profil Sayfasi
- **Goruntuleme Modu:** Tum kullanici bilgilerini listeler
- **Duzenleme Modu:** Ad soyad ve email duzenleme formu
- **Tehlikeli Bolge:** Hesap silme butonu ve onay modali (checkbox ile)

### AIPreferences.jsx - AI Tercihleri
- Risk toleransi secimi: Dusuk (yesil), Orta (sari), Yuksek (kirmizi) kartlar
- Yatirim vadesi secimi: Kisa, Orta, Uzun vade kartlari
- Secili kartlarda parlayan kenar efekti
- Mevcut tercihleri otomatik yukleme

### Navbar.jsx - Navigasyon
- BOSE logosu ve sayfa baglantilari
- Kullanici adi ve cikis butonu
- Mobil uyumlu hamburger menu

### AuthContext.jsx - Kimlik Dogrulama
- Token yonetimi (localStorage)
- Otomatik profil yukleme (sayfa yenilemede)
- `login()`, `register()`, `logout()`, `updateUser()` fonksiyonlari

### ProtectedRoute.jsx - Korunmus Rotalar
- Token yoksa `/login` sayfasina yonlendirir
- Yukleme sirasinda spinner gosterir

---

## Bilesen-API Eslestirme Tablosu

| Sayfa / Bilesen | API Endpoint | HTTP Metodu | Aciklama |
|------------------|-------------|-------------|----------|
| **Register.jsx** | `/api/auth/register` | POST | Yeni hesap olusturma |
| **Login.jsx** | `/api/auth/login` | POST | Kullanici girisi |
| **Dashboard.jsx** | `/api/users/profile` | GET | Profil bilgisi yukleme |
| **Profile.jsx** (goruntule) | `/api/users/profile` | GET | Profil bilgisi goruntuleme |
| **Profile.jsx** (duzenle) | `/api/users/profile` | PUT | Profil bilgilerini guncelleme |
| **Profile.jsx** (sil) | `/api/users/profile` | DELETE | Hesap silme |
| **AIPreferences.jsx** | `/api/users/ai-preferences` | PUT | AI tercihlerini kaydetme |
| **AuthContext.jsx** | `/api/users/profile` | GET | Sayfa yenilemede oturum dogrulama |

---

## Kimlik Dogrulama Akisi

1. Kullanici **Register** veya **Login** sayfasindan giris yapar
2. Backend JWT token dondurur
3. Token `localStorage`'da `bose_token` anahtariyla saklanir
4. Axios interceptor her istege `Authorization: Bearer <token>` ekler
5. 401 yaniti alinirsa token silinir ve `/login`'e yonlendirilir
6. Sayfa yenilemede AuthContext mevcut token ile profili dogrular

---

## Deployment (Vercel)

1. Vercel'de yeni proje olustur ve GitHub reposunu bagla
2. **Framework Preset:** Vite
3. **Root Directory:** `Furkan-Alp-Gunay/frontend`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Ortam Degiskeni:** `VITE_API_URL` = `https://bose-final-api.onrender.com/api`

---

## Teknolojiler

- **React 19** (UI Kutuphanesi)
- **Vite 8** (Build Araci)
- **React Router v7** (Istemci Tarafli Yonlendirme)
- **Axios** (HTTP Istemcisi)
- **Tailwind CSS v4** (Utility-First CSS)
- **Vercel** (Deployment)
