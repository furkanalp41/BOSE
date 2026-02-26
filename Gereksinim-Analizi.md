<details>
<summary><b>Furkan Alp Günay'ın Gereksinimleri (Kullanıcı ve AI Tercihleri)</b></summary>
<br>

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

**6. Yapay Zeka Analiz Tercihlerini Kaydetme**
* **API Metodu:** `POST /users/{userId}/ai-preferences`
* **Açıklama:** Kullanıcının yatırım yaparken yapay zekadan hangi risk seviyesinde (düşük, orta, yüksek) tavsiyeler almak istediğini sisteme kaydeder.
</details>

<details>
<summary><b>Enes Çoban'ın Gereksinimleri (İzleme Listesi ve AI Önerileri)</b></summary>
<br>

**7. İzleme Listesi Oluşturma**
* **API Metodu:** `POST /watchlists`
* **Açıklama:** Kullanıcının takip etmek istediği varlıklar için özel klasörler (listeler) oluşturmasını sağlar.

**8. İzleme Listesine Varlık Ekleme**
* **API Metodu:** `POST /watchlists/{listId}/assets`
* **Açıklama:** Kullanıcının seçtiği belirli bir listeye hisse senedi veya kripto para eklemesini sağlar.

**9. İzleme Listelerini Görüntüleme**
* **API Metodu:** `GET /watchlists`
* **Açıklama:** Kullanıcıya ait tüm izleme listelerini ve bu listelerin içindeki varlıkların anlık fiyat durumlarını getirir.

**10. İzleme Listesinden Varlık Çıkarma**
* **API Metodu:** `DELETE /watchlists/{listId}/assets/{assetSymbol}`
* **Açıklama:** Kullanıcının artık takip etmek istemediği bir varlığı izleme listesinden kaldırır.

**11. İzleme Listesini Silme**
* **API Metodu:** `DELETE /watchlists/{listId}`
* **Açıklama:** Bir izleme listesini, içindeki kayıtlı varlıklarla birlikte tamamen siler.

**12. Yapay Zeka ile Varlık Önerisi Alma**
* **API Metodu:** `GET /watchlists/ai-suggestions`
* **Açıklama:** Kullanıcının mevcut izleme listesine veya yatırım alışkanlıklarına bakarak yapay zekanın yeni hisse veya kripto para önermesini sağlar.
</details>

<details>
<summary><b>Cem Karaca'nın Gereksinimleri (Alım-Satım ve AI Bot İşlemleri)</b></summary>
<br>

**13. Piyasa Emri Oluşturma**
* **API Metodu:** `POST /orders/market`
* **Açıklama:** Kullanıcının o anki en güncel piyasa fiyatı üzerinden hızlıca alım veya satım işlemi gerçekleştirmesini sağlar.

**14. Limit Emri Oluşturma**
* **API Metodu:** `POST /orders/limit`
* **Açıklama:** Kullanıcının belirlediği özel bir fiyat seviyesine ulaşıldığında otomatik olarak gerçekleşmesi beklenen ileri tarihli emirleri sisteme girer.

**15. Açık Emirleri Listeleme**
* **API Metodu:** `GET /orders/open`
* **Açıklama:** Kullanıcının verdiği ancak piyasa şartları henüz oluşmadığı için gerçekleşmemiş (bekleyen) emirlerin listesini gösterir.

**16. Bekleyen Emri İptal Etme**
* **API Metodu:** `DELETE /orders/{orderId}`
* **Açıklama:** Henüz gerçekleşmemiş bir emri sistemden kaldırarak, bu işlem için bekletilen sanal bakiyeyi kullanıcıya iade eder.

**17. İşlem Geçmişini Görüntüleme**
* **API Metodu:** `GET /orders/history`
* **Açıklama:** Kullanıcının geçmişte yaptığı tüm başarılı alım ve satım işlemlerinin detaylı dökümünü sunar.

**18. Yapay Zeka Otomatik Alım-Satım Emri Kurma**
* **API Metodu:** `POST /orders/ai-bot`
* **Açıklama:** Yapay zekanın piyasa durumuna göre belirli kurallar çerçevesinde otomatik olarak alım veya satım yapması için bir bot talimatı oluşturur.
</details>

<details>
<summary><b>Salih Arda Katırcıoğlu'nun Gereksinimleri (AI Analiz ve Bildirimler)</b></summary>
<br>

**19. Portföy Riskini Yapay Zeka ile Analiz Etme**
* **API Metodu:** `GET /ai/report/portfolio/{userId}`
* **Açıklama:** Akıllı sistemin, kullanıcının sahip olduğu tüm varlıkları inceleyerek genel bir risk puanı çıkarmasını ve yatırımları iyileştirmek için öneriler sunmasını sağlar.

**20. Varlık Durumunu Yapay Zeka ile Analiz Etme**
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

**24. Akıllı Asistan ile Sohbet Etme**
* **API Metodu:** `POST /ai/chat`
* **Açıklama:** Kullanıcının piyasa veya belirli varlıklar hakkında yapay zeka asistanına yazılı sorular sormasını ve anında cevap almasını sağlar.
</details>

<details>
<summary><b>Yakup Efe Çelebi'nin Gereksinimleri (Sistem Verileri ve AI Duyarlılığı)</b></summary>
<br>

**25. Yeni Market Varlığı Ekleme**
* **API Metodu:** `POST /market/assets`
* **Açıklama:** Yetkili kullanıcıların (yöneticilerin) sisteme alınıp satılabilecek yeni bir hisse senedi veya kripto para tanımlamasını sağlar.

**26. Piyasa Verilerini Listeleme**
* **API Metodu:** `GET /market/prices`
* **Açıklama:** Sistemde kayıtlı olan tüm varlıkların o anki güncel fiyat bilgilerini listeler.

**27. Varlık Bilgilerini Güncelleme**
* **API Metodu:** `PUT /market/assets/{assetId}`
* **Açıklama:** Yetkili kullanıcıların sistemdeki bir varlığın adını, açıklamasını veya işlem görüp görmeme durumunu değiştirmesini sağlar.

**28. Sistem Durumunu Kontrol Etme**
* **API Metodu:** `GET /admin/health`
* **Açıklama:** Sistemin arka planında çalışan altyapı servislerinin ve veri bağlantılarının sorunsuz çalışıp çalışmadığını kontrol eden bir rapor sunar.

**29. Yapay Zeka Analiz Geçmişini Temizleme**
* **API Metodu:** `DELETE /ai/history`
* **Açıklama:** Kullanıcının akıllı asistan ile yaptığı geçmiş konuşmaları ve analiz sorgularını kalıcı olarak siler.

**30. Yapay Zeka Piyasa Duyarlılığını Görüntüleme**
* **API Metodu:** `GET /ai/market-sentiment`
* **Açıklama:** Yapay zekanın genel piyasa haberlerini ve trendlerini okuyarak borsanın veya kripto piyasasının o günkü genel psikolojisini (olumlu/olumsuz) raporlamasını sağlar.
</details>
