# Furkan Alp Gunay - REST API Dokumantasyonu

> **YouTube Video Linki:** [BURAYA EKLENECEK]

## Genel Bilgiler

| Bilgi | Deger |
|-------|-------|
| **Canli API URL** | https://bose-final-api.onrender.com |
| **Base Path** | `/api` |
| **Framework** | Go Fiber v2 |
| **Veritabani** | PostgreSQL (GORM ORM) |
| **Kimlik Dogrulama** | JWT Bearer Token (72 saat gecerlilik) |

## Kimlik Dogrulama

Korunmus endpointler icin her istekte `Authorization` basligi gonderilmelidir:

```
Authorization: Bearer <jwt_token>
```

Token, Register veya Login isleminden sonra doner.

---

## Endpointler

### 1. Uye Olma (Register)

| Ozellik | Deger |
|---------|-------|
| **Metot** | `POST` |
| **Yol** | `/api/auth/register` |
| **Yetki** | Herkese acik |

**Istek Govdesi:**
```json
{
  "full_name": "Furkan Alp Gunay",
  "email": "furkan@example.com",
  "password": "Sifre123"
}
```

**Basarili Yanit (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "ID": 1,
    "full_name": "Furkan Alp Gunay",
    "email": "furkan@example.com",
    "virtual_balance": 100000,
    "role": "user",
    "risk_level": "Medium",
    "ai_preferences": ""
  }
}
```

**Hata Yanitlari:**
| Kod | Durum | Aciklama |
|-----|-------|----------|
| 400 | Bad Request | Eksik alan (ad, email veya sifre) |
| 409 | Conflict | Email zaten kayitli |

---

### 2. Giris Yapma (Login)

| Ozellik | Deger |
|---------|-------|
| **Metot** | `POST` |
| **Yol** | `/api/auth/login` |
| **Yetki** | Herkese acik |

**Istek Govdesi:**
```json
{
  "email": "furkan@example.com",
  "password": "Sifre123"
}
```

**Basarili Yanit (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "ID": 1,
    "full_name": "Furkan Alp Gunay",
    "email": "furkan@example.com",
    "virtual_balance": 100000,
    "role": "user",
    "risk_level": "Medium",
    "ai_preferences": ""
  }
}
```

**Hata Yanitlari:**
| Kod | Durum | Aciklama |
|-----|-------|----------|
| 400 | Bad Request | Eksik email veya sifre |
| 401 | Unauthorized | Hatali email veya sifre |

---

### 3. Profil Goruntuleme (Get Profile)

| Ozellik | Deger |
|---------|-------|
| **Metot** | `GET` |
| **Yol** | `/api/users/profile` |
| **Yetki** | JWT Token gerekli |

**Basarili Yanit (200):**
```json
{
  "success": true,
  "user": {
    "ID": 1,
    "CreatedAt": "2026-04-04T12:00:00Z",
    "UpdatedAt": "2026-04-04T12:00:00Z",
    "full_name": "Furkan Alp Gunay",
    "email": "furkan@example.com",
    "virtual_balance": 100000,
    "role": "user",
    "risk_level": "Medium",
    "ai_preferences": ""
  }
}
```

**Hata Yanitlari:**
| Kod | Durum | Aciklama |
|-----|-------|----------|
| 401 | Unauthorized | Gecersiz veya eksik token |
| 404 | Not Found | Kullanici bulunamadi |

---

### 4. Profil Guncelleme (Update Profile)

| Ozellik | Deger |
|---------|-------|
| **Metot** | `PUT` |
| **Yol** | `/api/users/profile` |
| **Yetki** | JWT Token gerekli |

**Istek Govdesi:**
```json
{
  "full_name": "Furkan Gunay",
  "email": "yeni@example.com"
}
```

**Basarili Yanit (200):**
```json
{
  "success": true,
  "message": "Profil basariyla guncellendi",
  "user": {
    "ID": 1,
    "full_name": "Furkan Gunay",
    "email": "yeni@example.com",
    "virtual_balance": 100000,
    "role": "user",
    "risk_level": "Medium",
    "ai_preferences": ""
  }
}
```

**Hata Yanitlari:**
| Kod | Durum | Aciklama |
|-----|-------|----------|
| 401 | Unauthorized | Gecersiz token |
| 409 | Conflict | Yeni email zaten kulanimda |

---

### 5. Hesap Silme (Delete Account)

| Ozellik | Deger |
|---------|-------|
| **Metot** | `DELETE` |
| **Yol** | `/api/users/profile` |
| **Yetki** | JWT Token gerekli |

**Basarili Yanit (200):**
```json
{
  "success": true,
  "message": "Hesap basariyla silindi"
}
```

**Hata Yanitlari:**
| Kod | Durum | Aciklama |
|-----|-------|----------|
| 401 | Unauthorized | Gecersiz token |
| 500 | Internal Error | Silme islemi basarisiz |

> **Not:** Silme islemi GORM soft-delete kullanir. Veriler `deleted_at` alani ile isaretlenir, veritabanindan kalici olarak silinmez.

---

### 6. AI Tercihlerini Kaydetme (Save AI Preferences)

| Ozellik | Deger |
|---------|-------|
| **Metot** | `PUT` |
| **Yol** | `/api/users/ai-preferences` |
| **Yetki** | JWT Token gerekli |

**Istek Govdesi:**
```json
{
  "risk_level": "High",
  "investment_term": "short"
}
```

**Basarili Yanit (200):**
```json
{
  "success": true,
  "message": "AI tercihleri basariyla kaydedildi",
  "ai_preferences": {
    "risk_level": "High",
    "investment_term": "short"
  }
}
```

**Gecerli Degerler:**
| Alan | Degerler |
|------|----------|
| `risk_level` | `Low`, `Medium`, `High` |
| `investment_term` | `short`, `medium`, `long` |

**Hata Yanitlari:**
| Kod | Durum | Aciklama |
|-----|-------|----------|
| 400 | Bad Request | Bos tercih gonderildi |
| 401 | Unauthorized | Gecersiz token |

---

## Kullanici Modeli (User Schema)

| Alan | Tip | Aciklama |
|------|-----|----------|
| `ID` | uint | Benzersiz kimlik (otomatik) |
| `full_name` | string | Kullanici adi soyadi |
| `email` | string | Benzersiz email adresi |
| `virtual_balance` | float64 | Sanal bakiye (varsayilan: 100.000 TL) |
| `role` | string | Kullanici rolu (varsayilan: "user") |
| `risk_level` | string | Risk seviyesi (varsayilan: "Medium") |
| `ai_preferences` | string | AI tercihleri (JSON formatinda) |
| `CreatedAt` | datetime | Olusturulma tarihi |
| `UpdatedAt` | datetime | Son guncelleme tarihi |

---

## Teknolojiler

- **Go 1.25** + **Fiber v2** (HTTP Framework)
- **GORM** (ORM) + **PostgreSQL** (Veritabani)
- **JWT (HS256)** (Kimlik Dogrulama)
- **bcrypt** (Sifre Hashleme)
- **Render.com** (Deployment)
