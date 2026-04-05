# Furkan Alp Günay'ın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](#)

### 1. Üye Olma

* **Endpoint:** `POST /auth/register`
* **Request Body:**

  ```json
  {
    "fullName": "Furkan Alp Günay",
    "email": "furkan@example.com",
    "password": "GucluSifre123!"
  }
  ```

Authentication: Gerekmiyor

Response: 201 Created - Kullanıcı başarıyla oluşturuldu, JWT token ve kullanıcı bilgileri döner. Başlangıç bakiyesi 100.000 TRY tanımlanır.

2. Giriş Yapma
Endpoint: POST /auth/login

Request Body:
```json
{
  "email": "furkan@example.com",
  "password": "GucluSifre123!"
}
```

Authentication: Gerekmiyor

Response: 200 OK - Giriş başarılı, JWT Token döndürüldü.

3. Profil Görüntüleme
Endpoint: GET /users/me

Authentication: Bearer Token gerekli

Response: 200 OK - Aktif kullanıcının profil bilgileri (id, email, full_name, role, balance) getirildi.

4. Kullanıcı Detayı
Endpoint: GET /users/:userId

Path Parameters:
userId (integer, required) - Kullanıcı ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - Kullanıcı bilgileri ve sanal bakiye başarıyla getirildi.

5. Profil Bilgilerini Güncelleme
Endpoint: PUT /users/:userId

Path Parameters:
userId (integer, required) - Kullanıcı ID'si

Request Body:
```json
{
  "full_name": "Furkan Alp Günay",
  "risk_level": "HIGH"
}
```

Authentication: Bearer Token gerekli

Response: 200 OK - Kullanıcı başarıyla güncellendi.

6. Hesap Silme
Endpoint: DELETE /users/:userId

Path Parameters:
userId (integer, required) - Kullanıcı ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - Kullanıcı başarıyla silindi.

7. AI Tercihlerini Kaydetme
Endpoint: POST /users/:userId/ai-preferences

Path Parameters:
userId (integer, required) - Kullanıcı ID'si

Request Body:
```json
{
  "riskLevel": "HIGH",
  "investmentTerm": "SHORT_TERM"
}
```

Authentication: Bearer Token gerekli

Response: 200 OK - Yapay zeka tercihleri kaydedildi.

8. Admin Log Görüntüleme
Endpoint: GET /admin/logs

Authentication: Bearer Token gerekli (Admin rolü)

Response: 200 OK - Sistem audit logları listelendi.

9. Admin Kullanıcı Rolü Güncelleme
Endpoint: PUT /admin/users/:id/role

Path Parameters:
id (integer, required) - Kullanıcı ID'si

Request Body:
```json
{
  "role": "admin"
}
```

Authentication: Bearer Token gerekli (Admin rolü)

Response: 200 OK - Kullanıcı rolü güncellendi.

10. Admin Kullanıcı Silme
Endpoint: DELETE /admin/users/:id

Path Parameters:
id (integer, required) - Kullanıcı ID'si

Authentication: Bearer Token gerekli (Admin rolü)

Response: 200 OK - Kullanıcı silindi.
