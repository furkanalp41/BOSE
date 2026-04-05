Enes Çoban'ın Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Portfolio Analysis Sayfası (PortfolioAnalysis.jsx)

API Endpoint: POST /ai/reports/portfolio
Görev: AI portföy analizi sonuçlarının görselleştirilmesi
UI Bileşenleri:
Score barları (risk, çeşitlendirme, performans) animasyonlu gösterim
ModelBadge bileşeni (AI: gemini-2.0-flash veya Rules Engine gösterimi)
AI analiz içeriği yeşil çerçeveli kutuda vurgulanır
Skeleton loading (AI yanıtı beklerken)
Kullanıcı Deneyimi:
LLM vs Rules Engine ayrımının görsel olarak belirtilmesi
Analiz metninin markdown formatında render edilmesi
Teknik Detaylar:
60 saniye timeout için ayrı aiClient axios instance kullanımı
model_used alanına göre koşullu badge gösterimi

Watchlist Analysis Sayfası (WatchlistAnalysis.jsx)

API Endpoint: POST /ai/reports/watchlist
Görev: AI sinyal analizi sonuçlarının görselleştirilmesi
UI Bileşenleri:
Sembol bazlı sinyal kartları (AL/SAT/TUT/İZLE)
Her sembol için confidence bar (animasyonlu)
Renk kodları: AL yeşil, SAT kırmızı, TUT sarı, İZLE mavi
ModelBadge ile LLM vs Rules Engine ayrımı
Kullanıcı Deneyimi:
Türkçe ve İngilizce sinyal desteği (AL/BUY, SAT/SELL, TUT/HOLD, İZLE/WATCH)

Transaction Analysis Sayfası (TransactionAnalysis.jsx)

API Endpoint: POST /ai/reports/transactions
Görev: AI davranış analizi sonuçlarının görselleştirilmesi
UI Bileşenleri:
Davranış pattern'leri listesi
Impact seviyeleri renkli badge'lerle gösterilir (HIGH kırmızı, MEDIUM sarı, LOW yeşil)
AI analiz metni mor çerçeveli kutuda
ModelBadge bileşeni
Kullanıcı Deneyimi:
Türkçe ve İngilizce impact etiketleri desteklenir

AI Chat Sayfası (AIChat.jsx)

API Endpoint: POST /ai/chat
Görev: Finansal yapay zeka asistanı ile mesajlaşma arayüzü
UI Bileşenleri:
Sağda kullanıcı, solda AI mesaj baloncukları
Dil seçimi toggle (TR/EN)
Suggested actions (hazır soru önerileri)
Mesaj yazma inputu ve "Gönder" butonu
Kullanıcı Deneyimi:
Mesaj gönderildiğinde "AI yazıyor..." (typing indicator) animasyonu
Yeni mesaj geldiğinde otomatik olarak en aşağı kaydırma (auto-scroll)
60 saniye timeout göstergesi
Teknik Detaylar:
Chat mesaj geçmişinin state üzerinde tutulması
aiClient (60sn timeout) ile API isteği
Markdown rendering
