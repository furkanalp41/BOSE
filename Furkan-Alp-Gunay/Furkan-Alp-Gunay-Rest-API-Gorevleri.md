# Furkan Alp Günay'ın REST API Metotları

**API Test Videosu:** `Link buraya eklenecek`

**1. Üye Olma**
* **Endpoint:** `POST /auth/register`
* **Request Body:**
```json
{
  "email": "furkan@example.com",
  "password": "GüçlüŞifre123!",
  "fullName": "Furkan Alp Günay"
}

Authentication: Gerekmiyor

Response: 201 Created - Kullanıcı başarıyla oluşturuldu ve başlangıç bakiyesi tanımlandı.

2. Giriş Yapma

Endpoint: POST /auth/login

Request Body:


{
  "email": "furkan@example.com",
  "password": "GüçlüŞifre123!"
}

Authentication: Gerekmiyor

Response: 200 OK - Giriş başarılı, JWT Token döndürüldü.

3. Profil Görüntüleme

Endpoint: GET /users/{userId}

Path Parameters:

userId (string, required) - Kullanıcı ID'si

Authentication: Bearer Token gerekli

Response: 200 OK - Kullanıcı bilgileri ve sanal bakiye başarıyla getirildi.

4. Profil Bilgilerini Güncelleme

Endpoint: PUT /users/{userId}

Path Parameters:

userId (string, required) - Kullanıcı ID'si

Request Body:

JSON
{
  "fullName": "Furkan Alp Günay",
  "phone": "+905551234567"
}
Authentication: Bearer Token gerekli

Response: 200 OK - Kullanıcı başarıyla güncellendi.

5. Hesap Silme

Endpoint: DELETE /users/{userId}

Path Parameters:

userId (string, required) - Kullanıcı ID'si

Authentication: Bearer Token gerekli (Kendi hesabını silme yetkisi)

Response: 204 No Content - Kullanıcı başarıyla silindi.

6. AI Tercihlerini Kaydetme (AI Görevi)

Endpoint: POST /users/{userId}/ai-preferences

Path Parameters:

userId (string, required) - Kullanıcı ID'si

Request Body:

JSON
{
  "riskLevel": "HIGH",
  "investmentTerm": "LONG_TERM"
}
Authentication: Bearer Token gerekli

Response: 200 OK - Yapay zeka tercihleri kaydedildi.
