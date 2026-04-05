# REST API Görev Dağılımı

**REST API Adresi:** `https://bose-platform.onrender.com/api/v1`
**API Dokümantasyonu (Swagger):** `https://bose-platform.onrender.com/docs`

Bu dokümanda, **BOSE — AI Destekli Borsa ve Kripto Simülasyonu** projemizin Go (Fiber) tabanlı REST API endpoint'lerinin geliştirilmesinden sorumlu ekip üyeleri ve endpoint detayları listelenmektedir.

---

## 1. Furkan Alp Günay — Auth, User CRUD, Admin

| # | Method | Endpoint | Açıklama |
|---|--------|----------|----------|
| 1 | POST | `/auth/register` | Yeni kullanıcı kaydı (fullName, email, password) |
| 2 | POST | `/auth/login` | JWT token ile giriş |
| 3 | GET | `/users/me` | Aktif kullanıcı profili |
| 4 | GET | `/users/:userId` | ID ile kullanıcı detayı |
| 5 | PUT | `/users/:userId` | Profil güncelleme (full_name, risk_level) |
| 6 | DELETE | `/users/:userId` | Hesap silme |
| 7 | POST | `/users/:userId/ai-preferences` | AI risk/yatırım tercihleri |
| 8 | GET | `/admin/logs` | Admin audit logları |
| 9 | PUT | `/admin/users/:id/role` | Kullanıcı rolü güncelleme |
| 10 | DELETE | `/admin/users/:id` | Admin kullanıcı silme |

**Sorumluluklar:** JWT middleware, Claims struct, password hashing (bcrypt), admin role guard, CORS yapılandırması.

---

## 2. Cem Karaca — Trading

| # | Method | Endpoint | Açıklama |
|---|--------|----------|----------|
| 1 | POST | `/trading/order` | Alım/satım emri (symbol, side, quantity) |
| 2 | GET | `/trading/positions` | Açık pozisyonları listele |
| 3 | POST | `/trading/positions/:positionId/close` | Pozisyon kapat |
| 4 | GET | `/trading/history` | İşlem geçmişi |
| 5 | GET | `/trading/portfolio` | Portföy özeti (toplam değer, P&L) |
| 6 | POST | `/admin/announcements` | Sistem duyurusu oluştur |

**Sorumluluklar:** Sanal bakiye yönetimi, pozisyon P&L hesaplama, PriceEngine entegrasyonu, trade history kayıt.

---

## 3. Salih Arda Katırcıoğlu — Watchlist & Alerts

| # | Method | Endpoint | Açıklama |
|---|--------|----------|----------|
| 1 | POST | `/watchlist/` | İzleme listesi oluştur |
| 2 | GET | `/watchlist/` | Tüm listeleri getir (items dahil) |
| 3 | DELETE | `/watchlist/:id` | Liste sil (cascade items) |
| 4 | POST | `/watchlist/:id/items` | Sembol ekle (PriceEngine validasyonu) |
| 5 | DELETE | `/watchlist/:id/items/:itemId` | Sembol çıkar |
| 6 | POST | `/watchlist/alerts` | Fiyat alarmı oluştur (ABOVE/BELOW) |
| 7 | GET | `/watchlist/alerts` | Alarmları listele |
| 8 | DELETE | `/watchlist/alerts/:alertId` | Alarm sil |
| 9 | GET | `/watchlist/alerts/triggered` | Tetiklenen alarmlar |

**Sorumluluklar:** Watchlist CRUD, sembol validasyonu, AlertChecker daemon (5sn interval), in-memory triggered alerts cache.

---

## 4. Enes Çoban — AI Reports & Chat

| # | Method | Endpoint | Açıklama |
|---|--------|----------|----------|
| 1 | POST | `/ai/advice` | Kural tabanlı yatırım tavsiyesi |
| 2 | POST | `/ai/reports/portfolio` | AI portföy analizi |
| 3 | POST | `/ai/reports/watchlist` | AI watchlist sinyal analizi |
| 4 | POST | `/ai/reports/transactions` | AI işlem davranış analizi |
| 5 | POST | `/ai/chat` | AI chatbot (çoklu mesaj desteği) |

**Sorumluluklar:** ProviderChain (Gemini → Anthropic → Rules Engine), prompt template'ler, 15sn timeout, fallback mekanizması, LLM response parsing.

---

## 5. Yakup Efe Çelebi — Market, Leaderboard, Admin Assets

| # | Method | Endpoint | Açıklama |
|---|--------|----------|----------|
| 1 | GET | `/market/assets` | Canlı piyasa verileri (public) |
| 2 | GET | `/leaderboard/rankings` | Global sıralama |
| 3 | GET | `/leaderboard/user/:userId` | Kullanıcı sıralaması |
| 4 | GET | `/leaderboard/achievements` | Başarım listesi |
| 5 | GET | `/admin/market/assets` | Admin asset listesi |
| 6 | POST | `/admin/market/assets` | Yeni asset ekle |
| 7 | DELETE | `/admin/market/assets/:symbol` | Asset sil |

**Sorumluluklar:** PriceEngine (Geometric Brownian Motion), WebSocket hub, market data broadcasting, leaderboard hesaplama, achievement seed.

---

## Ortak Altyapı

- **Authentication:** Tüm protected endpoint'ler `middleware.Protected()` ile korunur
- **Error Format:** `{"error": "mesaj"}` JSON formatı
- **ID Formatı:** Auto-increment uint (UUID değil)
- **Veritabanı:** PostgreSQL + GORM AutoMigrate
- **WebSocket:** `wss://bose-platform.onrender.com/ws/market` (2sn tick)
