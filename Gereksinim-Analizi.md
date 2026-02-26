# Gereksinim Analizi

Tüm gereksinimlerimizi çıkardıktan sonra beraber tartıştık ve son gereksinimlerin isimlerini hangi API metoduna karşılık geleceğini ve kısa açıklamalarını aşağıda numaralı bir şekilde listeledik. Daha sonra aşağıda her grup üyesi için ayrılmış bölümlerde bu gereksinimlerin detaylı açıklamalarına yer verdik. Toplam 5 kişilik ekibimiz için sistemin temel işlevlerini kapsayan 30 adet gereksinim belirlenmiş ve eşit olarak dağıtılmıştır.

## Tüm Gereksinimler

1. Üye Olma (Furkan Alp Günay)
2. Giriş Yapma (Furkan Alp Günay)
3. Profil Görüntüleme (Furkan Alp Günay)
4. Profil Güncelleme (Furkan Alp Günay)
5. Hesap Silme (Furkan Alp Günay)
6. Giriş Geçmişini İnceleme (Furkan Alp Günay)
7. İzleme Listesi Oluşturma (Enes Çoban)
8. İzleme Listesine Varlık Ekleme (Enes Çoban)
9. İzleme Listelerini Görüntüleme (Enes Çoban)
10. İzleme Listesi Adını Güncelleme (Enes Çoban)
11. İzleme Listesinden Varlık Çıkarma (Enes Çoban)
12. İzleme Listesini Silme (Enes Çoban)
13. Piyasa Emri Oluşturma (Cem Karaca)
14. Limit Emri Oluşturma (Cem Karaca)
15. Açık Emirleri Listeleme (Cem Karaca)
16. Limit Emrini Güncelleme (Cem Karaca)
17. Bekleyen Emri İptal Etme (Cem Karaca)
18. İşlem Geçmişini Görüntüleme (Cem Karaca)
19. Portföy Riskini Analiz Etme (Salih Arda Katırcıoğlu)
20. Varlık Durumunu Analiz Etme (Salih Arda Katırcıoğlu)
21. Fiyat Alarmı Kurma (Salih Arda Katırcıoğlu)
22. Fiyat Alarmını Güncelleme (Salih Arda Katırcıoğlu)
23. Fiyat Alarmını İptal Etme (Salih Arda Katırcıoğlu)
24. Analiz Tercihlerini Kaydetme (Salih Arda Katırcıoğlu)
25. Akıllı Asistan ile Sohbet Etme (Yakup Efe Çelebi)
26. Analiz Geçmişini Temizleme (Yakup Efe Çelebi)
27. Yeni Market Varlığı Ekleme (Yakup Efe Çelebi)
28. Piyasa Verilerini Listeleme (Yakup Efe Çelebi)
29. Varlık Bilgilerini Güncelleme (Yakup Efe Çelebi)
30. Sistem Durumunu Kontrol Etme (Yakup Efe Çelebi)

---

## Gereksinim Dağılımları

### Furkan Alp Günay'ın Gereksinimleri (Kullanıcı ve Hesap Yönetimi)

**1. Üye Olma**
* **API Metodu:** `POST /auth/register`
* **Açıklama:** Kullanıcıların e-posta ve şifre ile sisteme kayıt olmasını sağlar. Başarılı kayıt sonrasında kullanıcının hesabına sanal bir başlangıç bakiyesi tanımlanır.

**2. Giriş Yapma**
* **API Metodu:** `POST /auth/login`
* **Açıklama:** Kayıtlı kullanıcıların sisteme güvenli bir şekilde erişim sağlaması için kimlik doğrulama işlemini gerçekleştirir.

**3. Profil Görüntüleme**
* **API Metodu:** `GET /users/{userId}`
* **Açıklama:** Kullanıcının ad, soyad, e-posta ve mevcut sanal bakiye bilgilerini ekrana getirir.

**4. Profil Güncelleme**
* **API Metodu:** `PUT /users/{userId}`
* **Açıklama:** Kullanıcının telefon, isim veya şifre gibi kişisel bilgilerini değiştirmesine olanak tanır.

**5. Hesap Silme**
* **API Metodu:** `DELETE /users/{userId}`
* **Açıklama:** Kullanıcı hesabını ve bu hesaba bağlı olan tüm kişisel verileri sistemden kalıcı olarak temizler.

**6. Giriş Geçmişini İnceleme**
* **API Metodu:** `GET /users/{userId}/logs`
* **Açıklama:** Hesaba yapılan son giriş işlemlerini (cihaz adresi, tarih, saat) güvenlik takibi amacıyla kullanıcıya listeler.

### Enes Çoban'ın Gereksinimleri (İzleme Listesi Yönetimi)

**7. İzleme Listesi Oluşturma**
* **API Metodu:** `POST /watchlists`
* **Açıklama:** Kullanıcının takip etmek istediği varlıklar için "Favorilerim" veya "Hisselerim" gibi isimlerle özel klasörler (listeler) oluşturmasını sağlar.

**8. İzleme Listesine Varlık Ekleme**
* **API Metodu:** `POST /watchlists/{listId}/assets`
* **Açıklama:** Kullanıcının seçtiği belirli bir listeye hisse senedi veya kripto para eklemesini sağlar.

**9. İzleme Listelerini Görüntüleme**
* **API Metodu:** `GET /watchlists`
* **Açıklama:** Kullanıcıya ait tüm izleme listelerini ve bu listelerin içindeki varlıkların anlık fiyat durumlarını getirir.

**10. İzleme Listesi Adını Güncelleme**
* **API Metodu:** `PUT /watchlists/{listId}`
* **Açıklama:** Daha önceden oluşturulmuş bir izleme listesinin başlığını kullanıcının isteğine göre değiştirir.

**11. İzleme Listesinden Varlık Çıkarma**
* **API Metodu:** `DELETE /watchlists/{listId}/assets/{assetSymbol}`
* **Açıklama:** Kullanıcının artık takip etmek istemediği bir varlığı izleme listesinden kaldırır.

**12. İzleme Listesini Silme**
* **API Metodu:** `DELETE /watchlists/{listId}`
* **Açıklama:** Bir izleme listesini, içindeki kayıtlı varlıklarla birlikte tamamen siler.

### Cem Karaca'nın Gereksinimleri (Alım-Satım ve Emir Yönetimi)

**13. Piyasa Emri Oluşturma**
* **API Metodu:** `POST /orders/market`
* **Açıklama:** Kullanıcının o anki en güncel piyasa fiyatı üzerinden hızlıca alım veya satım işlemi gerçekleştirmesini sağlar.

**14. Limit Emri Oluşturma**
* **API Metodu:** `POST /orders/limit`
* **Açıklama:** Kullanıcının belirlediği özel bir fiyat seviyesine ulaşıldığında otomatik olarak gerçekleşmesi beklenen ileri tarihli emirleri sisteme girer.

**15. Açık Emirleri Listeleme**
* **API Metodu:** `GET /orders/open`
* **Açıklama:** Kullanıcının verdiği ancak piyasa şartları henüz oluşmadığı için gerçekleşmemiş (bekleyen) emirlerin listesini gösterir.

**16. Limit Emrini Güncelleme**
* **API Metodu:** `PUT /orders/{orderId}`
* **Açıklama:** Bekleyen bir emrin hedef fiyatını veya alınacak/satılacak varlık miktarını değiştirir.

**17. Bekleyen Emri İptal Etme**
* **API Metodu:** `DELETE /orders/{orderId}`
* **Açıklama:** Henüz gerçekleşmemiş bir emri sistemden kaldırarak, bu işlem için bekletilen sanal bakiyeyi kullanıcıya iade eder.

**18. İşlem Geçmişini Görüntüleme**
* **API Metodu:** `GET /orders/history`
* **Açıklama:** Kullanıcının geçmişte yaptığı tüm başarılı alım ve satım işlemlerinin detaylı dökümünü sunar.

### Salih Arda Katırcıoğlu'nun Gereksinimleri (Yapay Zeka ve Bildirimler)

**19. Portföy Riskini Analiz Etme**
* **API Metodu:** `GET /ai/report/portfolio/{userId}`
* **Açıklama:** Akıllı sistemin, kullanıcının sahip olduğu tüm varlıkları inceleyerek genel bir risk puanı çıkarmasını ve yatırımları iyileştirmek için öneriler sunmasını sağlar.

**20. Varlık Durumunu Analiz Etme**
* **API Metodu:** `GET /ai/report/status/{assetSymbol}`
* **Açıklama:** Belirli bir hisse veya kripto para için piyasadaki güncel haberleri ve gidişatı yorumlayarak özet bir yön tahmini (Al/Sat/Tut) sunar.

**21. Fiyat Alarmı Kurma**
* **API Metodu:** `POST /alerts`
* **Açıklama:** Kullanıcının takip ettiği bir varlık belirlediği fiyata ulaştığında sistemin anlık bildirim göndermesi için kural oluşturmasını sağlar.

**22. Fiyat Alarmını Güncelleme**
* **API Metodu:** `PUT /alerts/{alertId}`
* **Açıklama:** Daha önce kurulmuş bir alarmın hedef fiyatını veya bildirim tercihlerini değiştirmeye olanak tanır.

**23. Fiyat Alarmını İptal Etme**
* **API Metodu:** `DELETE /alerts/{alertId}`
* **Açıklama:** Kullanıcının artık ihtiyaç duymadığı bir fiyat bildirim kuralını sistemden kaldırır.

**24. Analiz Tercihlerini Kaydetme**
* **API Metodu:** `POST /ai/preferences`
* **Açıklama:** Kullanıcının yatırım yaparken hangi risk seviyesinde (düşük, orta, yüksek) tavsiyeler almak istediğini sisteme kaydeder.

### Yakup Efe Çelebi'nin Gereksinimleri (Akıllı Asistan ve Sistem Yönetimi)

**25. Akıllı Asistan ile Sohbet Etme**
* **API Metodu:** `POST/GET /ai/chat/{assetSymbol}`
* **Açıklama:** Kullanıcının piyasa veya belirli bir varlık hakkında yapay zeka asistanına yazılı sorular sormasını ve anında cevap almasını sağlar.

**26. Analiz Geçmişini Temizleme**
* **API Metodu:** `DELETE /ai/history`
* **Açıklama:** Kullanıcının akıllı asistan ile yaptığı geçmiş konuşmaları ve analiz sorgularını kalıcı olarak siler.

**27. Yeni Market Varlığı Ekleme**
* **API Metodu:** `POST /market/assets`
* **Açıklama:** Yetkili kullanıcıların (yöneticilerin) sisteme alınıp satılabilecek yeni bir hisse senedi veya kripto para tanımlamasını sağlar.

**28. Piyasa Verilerini Listeleme**
* **API Metodu:** `GET /market/prices`
* **Açıklama:** Sistemde kayıtlı olan tüm varlıkların o anki güncel fiyat bilgilerini listeler.

**29. Varlık Bilgilerini Güncelleme**
* **API Metodu:** `PUT /market/assets/{assetId}`
* **Açıklama:** Yetkili kullanıcıların sistemdeki bir varlığın adını, açıklamasını veya işlem görüp görmeme durumunu değiştirmesini sağlar.

**30. Sistem Durumunu Kontrol Etme**
* **API Metodu:** `GET /admin/health`
* **Açıklama:** Sistemin arka planında çalışan altyapı servislerinin ve veri bağlantılarının sorunsuz çalışıp çalışmadığını kontrol eden bir rapor sunar.
