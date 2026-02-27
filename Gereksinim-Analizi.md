# Gereksinim Analizi

Tüm gereksinimlerimizi çıkardıktan sonra beraber tartıştık ve son gereksinimlerin isimlerini hangi API metoduna karşılık geleceğini ve kısa açıklamalarını aşağıda numaralı bir şekilde listeledik. Daha sonra aşağıda her grup üyesi için ayrılmış bölümlerde bu gereksinimlerin detaylı açıklamalarına yer verdik. Toplam 5 kişilik ekibimiz için sistemin temel işlevlerini kapsayan 30 adet gereksinim belirlenmiş ve eşit olarak dağıtılmıştır.

## Tüm Gereksinimler

1. Üye Olma (Furkan Alp Günay)
2. Giriş Yapma (Furkan Alp Günay)
3. Profil Görüntüleme (Furkan Alp Günay)
4. Profil Bilgilerini Güncelleme (Furkan Alp Günay)
5. Hesap Silme (Furkan Alp Günay)
6. Giriş Hareketlerini Listeleme (Furkan Alp Günay)
7. Yeni İzleme Listesi Oluşturma (Enes Çoban)
8. İzleme Listesine Varlık Ekleme (Enes Çoban)
9. İzleme Listelerini Görüntüleme (Enes Çoban)
10. Liste Adı Güncelleme (Enes Çoban)
11. Listeden Varlık Çıkarma (Enes Çoban)
12. İzleme Listesini Silme (Enes Çoban)
13. Piyasa Emri Oluşturma (Cem Karaca)
14. Limit Emir Oluşturma (Cem Karaca)
15. Açık Emirleri Listeleme (Cem Karaca)
16. Limit Emir Güncelleme (Cem Karaca)
17. Bekleyen Emri İptal Etme (Cem Karaca)
18. İşlem Geçmişini Görüntüleme (Cem Karaca)
19. AI Portföy Raporu Almak (Salih Arda Katırcıoğlu)
20. AI Durum Raporu Almak (Salih Arda Katırcıoğlu)
21. Fiyat Alarmı Ekleme (Salih Arda Katırcıoğlu)
22. Fiyat Alarmı Güncelleme (Salih Arda Katırcıoğlu)
23. Fiyat Alarmını Silme (Salih Arda Katırcıoğlu)
24. AI Tercihlerini Kaydetme (Salih Arda Katırcıoğlu)
25. AI Chatbot ile Sohbet (Yakup Efe Çelebi)
26. AI Tahmin Geçmişini Temizleme (Yakup Efe Çelebi)
27. Yeni Market Varlığı Ekleme (Yakup Efe Çelebi)
28. Market Verilerini Listeleme (Yakup Efe Çelebi)
29. Varlık Bilgilerini Güncelleme (Yakup Efe Çelebi)
30. Sistem Sağlık Durumu Görüntüleme (Yakup Efe Çelebi)

---

## Gereksinim Dağılımları

<details>
<summary><b>Furkan Alp Günay'ın Gereksinimleri (Kullanıcı ve Hesap Yönetimi)</b></summary>
<br>

**1. Üye Olma**
* **API Metodu:** `POST /auth/register`
* **Açıklama:** Kullanıcıların e-posta ve şifre ile sisteme kayıt olmasını sağlar. Başarılı kayıt sonrası kullanıcıya başlangıç bakiyesi tanımlanır.

**2. Giriş Yapma**
* **API Metodu:** `POST /auth/login`
* **Açıklama:** Kayıtlı kullanıcıların sisteme erişim sağlaması için JWT token üretilmesini sağlar.

**3. Profil Görüntüleme**
* **API Metodu:** `GET /users/{userId}`
* **Açıklama:** Kullanıcının ad, soyad, e-posta ve mevcut bakiye bilgilerini döndürür.

**4. Profil Bilgilerini Güncelleme**
* **API Metodu:** `PUT /users/{userId}`
* **Açıklama:** Kullanıcının telefon, isim veya şifre gibi bilgilerini değiştirmesine olanak tanır.

**5. Hesap Silme**
* **API Metodu:** `DELETE /users/{userId}`
* **Açıklama:** Kullanıcı hesabını ve ilişkili tüm kişisel verileri sistemden kalıcı olarak temizler.

**6. Giriş Hareketlerini Listeleme**
* **API Metodu:** `GET /users/{userId}/logs`
* **Açıklama:** Hesaba yapılan son giriş işlemlerini (IP, Tarih) siber güvenlik takibi için listeler.
</details>

<details>
<summary><b>Enes Çoban'ın Gereksinimleri (İzleme Listeleri - Watchlist)</b></summary>
<br>

**7. Yeni İzleme Listesi Oluşturma**
* **API Metodu:** `POST /watchlists`
* **Açıklama:** Kullanıcının "Favorilerim" veya "Hisselerim" gibi isimlerle özel listeler oluşturmasını sağlar.

**8. İzleme Listesine Varlık Ekleme**
* **API Metodu:** `POST /watchlists/{listId}/assets`
* **Açıklama:** Belirli bir listeye BİST hissesi veya Kripto para sembolü ekler.

**9. İzleme Listelerini Görüntüleme**
* **API Metodu:** `GET /watchlists`
* **Açıklama:** Kullanıcıya ait tüm izleme listelerini ve içindeki varlıkların anlık
