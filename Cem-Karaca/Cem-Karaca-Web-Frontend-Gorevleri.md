Cem Karaca'nın Web Frontend Görevleri

Front-end Test Videosu: Link buraya eklenecek

Order Form (OrderForm.jsx)

API Endpoint: POST /trading/order
Görev: Anlık piyasa fiyatından alım-satım panelinin tasarımı
UI Bileşenleri:
BUY (Yeşil) ve SELL (Kırmızı) sekmeleri
Sembol seçimi (dropdown)
Miktar girişi input alanı
İşlem tutarı özeti (Miktar × Anlık Fiyat)
"İşlemi Onayla" butonu
Form Validasyonu:
Miktar 0'dan büyük olmalı
Kullanıcının bakiyesi işlem tutarını karşılamıyorsa buton disabled olmalı
Kullanıcı Deneyimi:
Geçersiz miktar girildiğinde input altında uyarı
Başarılı işlemde success toast mesajı
Teknik Detaylar:
Gerçek zamanlı fiyat verisiyle işlem tutarının anlık hesaplanması
Number formatting (binlik ayraçlar ve ondalık kısımlar)

Positions List (PositionsList.jsx)

API Endpoint: GET /trading/positions
Görev: Açık pozisyonların ve canlı P&L'in listelendiği tablo
UI Bileşenleri:
Sembol, Giriş Fiyatı, Güncel Fiyat, P&L, Miktar sütunları
Her satırda "Kapat" butonu
Kâr yeşil, zarar kırmızı renk kodlaması
Kullanıcı Deneyimi:
Canlı fiyat ile P&L anlık güncellenir
Pozisyon kapatma sonrası tablo yenilenir
Teknik Detaylar:
WebSocket entegrasyonu ile canlı fiyat güncellemesi
P&L hesaplama: (currentPrice - entryPrice) × quantity

Trade History (TradeHistory.jsx)

API Endpoint: GET /trading/history
Görev: Kullanıcının bitmiş işlemlerinin tarihsel dökümü
UI Bileşenleri:
Tarih, Sembol, İşlem Tipi (BUY/SELL), Fiyat, Tutar sütunlu tablo
Alış işlemleri yeşil, satış işlemleri kırmızı badge ile gösterilir
Kullanıcı Deneyimi:
Kronolojik sıralama
Teknik Detaylar:
Date formatting (tarih ve saatin yerel formata çevrilmesi)

Order Summary (OrderSummary.jsx)

API Endpoint: GET /trading/portfolio
Görev: Portföy özet kartlarının tasarımı
UI Bileşenleri:
Toplam Değer kartı
P&L (Kâr/Zarar) kartı
Bakiye kartı
Açık Pozisyon Sayısı kartı
Kullanıcı Deneyimi:
Animasyonlu counter gösterimi (Framer Motion)
Kâr yeşil, zarar kırmızı renk kodlaması
