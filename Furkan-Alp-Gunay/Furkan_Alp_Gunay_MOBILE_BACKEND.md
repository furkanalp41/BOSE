# 6. Mobile Back-End — Furkan Alp Günay

Üye: **Furkan Alp Günay**
Backend servis: `bose-furkan` → `:8080/api/v1`
Modül: `Furkan-Alp-Gunay/` (Go + Fiber + GORM + Redis JWT cache)

## Sahip Olunan Endpoint'ler (6/6)

| Metod | Yol | Controller |
|---|---|---|
| POST | /api/v1/auth/register | `controllers/auth_controller.go:Register` |
| POST | /api/v1/auth/login | `controllers/auth_controller.go:Login` |
| GET | /api/v1/users/{id} | `controllers/user_controller.go:GetUserByID` |
| PUT | /api/v1/users/{id} | `controllers/user_controller.go:UpdateUser` |
| DELETE | /api/v1/users/{id} | `controllers/user_controller.go:DeleteUser` |
| POST | /api/v1/users/{id}/ai-preferences | `controllers/user_controller.go:SaveAIPreferences` |

## Kanıt Videosu (Mobil → REST → DB)

Video'da gösterilmesi gereken net akış (PDF zorunluluğu):

1. Mobil emülatör / cihazda Furkan ekranı açılır.
2. Form doldurulur, butona basılır.
3. **Backend logu (terminal)** ekrana getirilir — Fiber logger satırı `POST /api/v1/auth/login 200` formatında görünmelidir.
4. Postgres satırı veya GORM log'u gösterilebilir.
5. Ekrandaki başarı durumu (toast / yeni ekran) gösterilir.

- **Video linki:** ____

## Yapılan / Yapılamayan

- [x] Tüm 6 endpoint kodlandı, testler geçti (`go test ./controllers/...`)
- [x] `/api/v1` prefix doğrulandı
- [ ] Video kaydı: ____
