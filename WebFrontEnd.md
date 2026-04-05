# Web Frontend Görev Dağılımı

**Frontend Adresi:** `https://frontend-bose.vercel.app`
**Backend API:** `https://bose-platform.onrender.com/api/v1`

Bu dokümanda, **BOSE — AI Destekli Borsa ve Kripto Simülasyonu** web uygulamasının React + Vite tabanlı kullanıcı arayüzü görevleri listelenmektedir.

---

## 1. Furkan Alp Günay — Auth, Profil, Admin Sayfaları

| Sayfa/Bileşen | Dosya | Açıklama |
|----------------|-------|----------|
| Login Sayfası | `LoginPage.jsx` | Email/şifre ile giriş, JWT token Zustand'a kayıt |
| Register Sayfası | `RegisterPage.jsx` | Yeni kullanıcı kaydı formu |
| Profil Kartı | `ProfileCard.jsx` | Kullanıcı bilgileri, bakiye gösterimi |
| AI Tercihleri | `AIPreferences.jsx` | Risk seviyesi ve yatırım vadesi seçimi |
| Hesap Silme | `DangerZone.jsx` | Hesap silme onay modalı |
| Admin Panel | `AdminPanel.jsx` | Kullanıcı yönetimi, log görüntüleme, duyuru |
| Sidebar | `Sidebar.jsx` | Navigasyon menüsü, aktif sayfa göstergesi |
| Dashboard Layout | `DashboardPage.jsx` | Ana sayfa düzeni, section routing |

**Sorumluluklar:** Auth flow, Zustand store, protected route guard, admin role kontrolü, responsive sidebar.

---

## 2. Cem Karaca — Trading Sayfaları

| Sayfa/Bileşen | Dosya | Açıklama |
|----------------|-------|----------|
| Order Form | `OrderForm.jsx` | BUY/SELL form, sembol seçimi, miktar girişi |
| Positions List | `PositionsList.jsx` | Açık pozisyonlar, canlı P&L, close butonu |
| Trade History | `TradeHistory.jsx` | İşlem geçmişi tablosu |
| Order Summary | `OrderSummary.jsx` | Portföy özeti kartları |

**Sorumluluklar:** Trading API entegrasyonu, canlı fiyat ile P&L hesaplama, pozisyon kapatma akışı.

---

## 3. Salih Arda Katırcıoğlu — Watchlist & Alert Sayfaları

| Sayfa/Bileşen | Dosya | Açıklama |
|----------------|-------|----------|
| Watchlist Manager | `WatchlistManager.jsx` | Liste CRUD, sembol ekleme (dropdown öneriler), canlı fiyatlar |
| Alerts Manager | `AlertsManager.jsx` | Alert oluşturma (ABOVE/BELOW), progress bar, tetiklenen alarmlar |

**Sorumluluklar:** Canlı fiyat entegrasyonu, sembol validasyonu, hedef fiyat proximity göstergesi, triggered alerts polling.

---

## 4. Enes Çoban — AI Analiz & Chat Sayfaları

| Sayfa/Bileşen | Dosya | Açıklama |
|----------------|-------|----------|
| Portfolio Analysis | `PortfolioAnalysis.jsx` | AI portföy analizi, score barlar, model badge |
| Watchlist Analysis | `WatchlistAnalysis.jsx` | AI sinyal analizi (AL/SAT/TUT/İZLE), confidence |
| Transaction Analysis | `TransactionAnalysis.jsx` | AI davranış analizi, pattern'ler |
| AI Chat | `AIChat.jsx` | Chatbot, dil seçimi (EN/TR), suggested actions |

**Sorumluluklar:** AI Reports API entegrasyonu, LLM vs Rules Engine model göstergesi, markdown rendering, 60sn timeout.

---

## 5. Yakup Efe Çelebi — Market & Leaderboard Sayfaları

| Sayfa/Bileşen | Dosya | Açıklama |
|----------------|-------|----------|
| Asset Card | `AssetCard.jsx` | Tek asset kartı (fiyat, değişim, sparkline) |
| Detail Panel | `DetailPanel.jsx` | Seçili asset detay paneli |
| Ticker Tape | `TickerTape.jsx` | Üst kayan fiyat bandı |
| Status Bar | `StatusBar.jsx` | WebSocket bağlantı durumu |
| Rank Table | `RankTable.jsx` | Liderlik tablosu sıralaması |
| Badge Display | `BadgeDisplay.jsx` | Başarım rozetleri |

**Sorumluluklar:** WebSocket canlı veri akışı (useMarketSocket hook), Geometric Brownian Motion fiyat görselleştirme, 2sn tick update.

---

## Genel Frontend Prensipleri

### Teknoloji Yığını
- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS (custom dark theme)
- **State:** Zustand (auth store)
- **Routing:** React Router v6 (SPA)
- **HTTP:** Axios (api + aiClient instances)
- **Animasyon:** Framer Motion
- **Canlı Veri:** Native WebSocket (`useMarketSocket` hook)

### Tasarım Sistemi
- **Tema:** Dark mode (void/coal background), neon/ice/crimson accent colors
- **Font:** System font + monospace for fiyatlar
- **Responsive:** Mobile-first, CSS Grid + Flexbox
- **Glass Effect:** `backdrop-blur` + semi-transparent borders

### API Entegrasyonu
- `VITE_API_URL` environment variable ile backend URL konfigürasyonu
- JWT token otomatik ekleme (Axios interceptor)
- 401 hatalarında auto-logout (sadece auth route'ları)
- AI istekleri için ayrı client (60sn timeout)

### Deploy
- **Platform:** Vercel
- **Build:** `npm run build` → `dist/`
- **Domain:** `https://frontend-bose.vercel.app`
- **Env:** `VITE_API_URL=https://bose-platform.onrender.com/api/v1`
