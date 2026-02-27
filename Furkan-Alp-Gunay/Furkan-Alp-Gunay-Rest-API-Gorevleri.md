Furkan Alp Günay'ın REST API Metotları

API Test Videosu: Link buraya eklenecek

Üye Olma

Endpoint: POST /auth/register
Request Body:
{
"email": "furkan@example.com",
"password": "GucluSifre123!",
"fullName": "Furkan Alp Günay"
}

Authentication: Gerekmiyor
Response: 201 Created - Kullanıcı başarıyla oluşturuldu ve başlangıç bakiyesi tanımlandı.

Giriş Yapma

Endpoint: POST /auth/login
Request Body:
{
"email": "furkan@example.com",
"password": "GucluSifre123!"
}

Authentication: Gerekmiyor
Response: 200 OK - Giriş başarılı, JWT Token döndürüldü.

Profil Görüntüleme

Endpoint: GET /users/{userId}
Path Parameters:
userId (string, required) - Kullanıcı ID'si
Authentication: Bearer Token gerekli
Response: 200 OK - Kullanıcı bilgileri ve sanal bakiye başarıyla getirildi.

Profil Bilgilerini Güncelleme

Endpoint: PUT /users/{userId}
Path Parameters:
userId (string, required) - Kullanıcı ID'si
Request Body:
{
"fullName": "Furkan Alp Günay",
"phone": "+905551234567"
}

Authentication: Bearer Token gerekli
Response: 200 OK - Kullanıcı başarıyla güncellendi.

Hesap Silme

Endpoint: DELETE /users/{userId}
Path Parameters:
userId (string, required) - Kullanıcı ID'si
Authentication: Bearer Token gerekli (Kendi hesabını silme yetkisi)
Response: 204 No Content - Kullanıcı başarıyla silindi.

AI Tercihlerini Kaydetme

Endpoint: POST /users/{userId}/ai-preferences
Path Parameters:
userId (string, required) - Kullanıcı ID'si
Request Body:
{


Authentication: Bearer Token gerekli
Response: 200 OK - Kullanıcı başarıyla güncellendi.
"riskLevel": "HIGH",
"investmentTerm": "LONG_TERM"
}
