# AI Yatırım Tavsiyesi Alma
    API Metodu: POST /ai/advice
Açıklama: Belirtilen varlık için yapay zeka tabanlı AL/SAT/TUT tavsiyesi alır. İşlemi yapabilmek için sisteme giriş yapmış olmak gerekir.

# AI Portföy Raporu Alma
    API Metodu: POST /ai/reports/portfolio
Açıklama: ProviderChain (Gemini → Claude → Rules Engine) altyapısı kullanılarak kullanıcının mevcut portföy risk analizi ve strateji önerisi raporlanır. Güvenlik için giriş yapmış olmak gerekir.

# AI Watchlist Raporu Alma
    API Metodu: POST /ai/reports/watchlist
Açıklama: İzleme listesindeki varlıklar için yapay zeka analizi sağlar. Kullanıcı sadece giriş yapmışsa sonuçları görüntüleyebilir.

# AI İşlem Geçmişi Raporu Alma
    API Metodu: POST /ai/reports/transactions
Açıklama: Kullanıcının işlem geçmişi üzerinden yapay zeka performans ve alışkanlık analizi oluşturur. Güvenlik için giriş yapmış olmak gerekir.

# AI Chatbot ile Sohbet
    API Metodu: POST /ai/chat
Açıklama: Yapay zeka asistanı ile serbest metin üzerinden finansal konular hakkında sohbet edilmesini sağlar. Giriş yapmak gereklidir.
