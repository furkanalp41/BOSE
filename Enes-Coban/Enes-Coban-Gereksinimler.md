# Yeni İzleme Listesi Oluşturma
    API Metodu: POST /watchlists
Açıklama: Kullanıcının "Favorilerim" veya "Hisselerim" gibi isimlerle özel izleme listeleri oluşturmasını sağlar. Bu sayede piyasadaki varlıklar gruplandırılabilir. İşlemi yapabilmek için sisteme giriş yapmış olmak gerekir.

# İzleme Listesine Varlık Ekleme
    API Metodu: POST /watchlists/{listId}/assets
Açıklama: Kullanıcının daha önce oluşturduğu bir izleme listesine piyasada işlem gören yeni bir BİST hissesi veya Kripto para sembolü eklemesini sağlar. Güvenlik için giriş yapmış olmak gerekir ve kullanıcı yalnızca kendi listesine ekleme yapabilir.

# İzleme Listelerini Görüntüleme
    API Metodu: GET /watchlists
Açıklama: Kullanıcıya ait tüm izleme listelerini ve bu listelerin içerisindeki varlıkların o anki canlı piyasa fiyatlarını getirir. Kullanıcı sadece kendi oluşturduğu listeleri görüntüleyebilir. Güvenlik için giriş yapmış olmak gerekir.

# Liste Adı Güncelleme
    API Metodu: PUT /watchlists/{listId}
Açıklama: Mevcut bir izleme listesinin başlığını (örn: "Kriptolarım" -> "Yatırımlarım") kullanıcının isteğine göre değiştirir. Güvenlik için giriş yapmış olmak gerekir ve yalnızca liste sahibi bu işlemi gerçekleştirebilir.

# İzleme Listesini Silme
    API Metodu: DELETE /watchlists/{listId}
Açıklama: Kullanıcının oluşturduğu bir izleme listesini kalıcı olarak sistemden kaldırmasını sağlar. Bu işlemle beraber liste içindeki tüm kayıtlı varlık takipleri de silinir. Güvenlik için giriş yapmış olmak gerekir.

# AI Durum Raporu Almak
    API Metodu: GET /ai/report/status/{assetSymbol}
Açıklama: Kullanıcının belirli zaman aralığında yatırımcı davranışlarını analiz ederek sahip olduğu alışkanlıkları iyileştirmek üzere rapor hazırlar.
