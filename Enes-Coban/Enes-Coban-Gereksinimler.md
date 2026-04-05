AI Yatırım Tavsiyesi
API Metodu: POST /ai/advice
Açıklama: Kural tabanlı yatırım tavsiyesi üretir. Kullanıcının portföy durumuna ve AI tercihlerine göre öneriler sunar. Güvenlik için giriş yapmış olmak gerekir.

AI Portföy Analizi
API Metodu: POST /ai/reports/portfolio
Açıklama: Kullanıcının açık pozisyonlarını ve işlem geçmişini analiz ederek risk skoru, çeşitlendirme tavsiyesi ve genel değerlendirme sunar. ProviderChain mekanizması: Gemini 2.0 Flash → Anthropic Claude Sonnet → Rules Engine fallback. Güvenlik için giriş yapmış olmak gerekir.

AI Watchlist Sinyal Analizi
API Metodu: POST /ai/reports/watchlist
Açıklama: İzleme listesindeki semboller için AL/SAT/TUT/İZLE sinyalleri üretir. Her sembol için confidence (güven) skoru hesaplanır. Güvenlik için giriş yapmış olmak gerekir.

AI İşlem Davranış Analizi
API Metodu: POST /ai/reports/transactions
Açıklama: Kullanıcının işlem geçmişine dayalı davranış pattern'lerini tespit eder ve iyileştirme önerileri sunar. Güvenlik için giriş yapmış olmak gerekir.

AI Chatbot ile Sohbet
API Metodu: POST /ai/chat
Açıklama: Kullanıcının piyasa, teknik terimler veya varlıklar hakkında yapay zeka asistanına yazılı sorular sormasını ve anında cevap almasını sağlar. Çoklu mesaj desteği ve dil seçimi (TR/EN) mevcuttur. 60 saniye timeout ile çalışır. Güvenlik için giriş yapmış olmak gerekir.
