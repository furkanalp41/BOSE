# Backend (REST API) Teknik Dokümantasyon

**REST API Adresi:** `https://bose-platform.onrender.com/api/v1`
**API Dokümantasyonu:** `https://bose-platform.onrender.com/docs`
**WebSocket:** `wss://bose-platform.onrender.com/ws/market`

Bu dokümanda, **BOSE — AI Destekli Borsa ve Kripto Simülasyonu** projesinin Go (Fiber) tabanlı backend mimarisi ve API entegrasyon prensipleri açıklanmaktadır.

---

## Teknoloji Yığını

| Bileşen | Teknoloji |
|---------|-----------|
| Dil | Go 1.22 |
| Web Framework | Fiber v2 |
| Veritabanı | PostgreSQL 16 (Render Managed) |
| ORM | GORM v2 |
| Auth | JWT (golang-jwt/v5, HS256) |
| AI Provider 1 | Google Gemini 2.0 Flash |
| AI Provider 2 | Anthropic Claude Sonnet |
| Fiyat Motoru | Geometric Brownian Motion |
| WebSocket | gofiber/contrib/websocket |
| Deploy | Render Web Service |

---

## Mimari Yapı

```
backend/
├── main.go                    # Uygulama başlangıcı, middleware, route setup
├── config/database.go         # PostgreSQL bağlantısı, GORM AutoMigrate
├── middleware/auth.go          # JWT middleware, Claims struct
├── models/                    # GORM modelleri
│   ├── user.go                # User, AIPreference
│   ├── trade.go               # Trade, Position (composite indexes)
│   └── watchlist.go           # Watchlist, WatchlistItem, Alert
├── controllers/               # HTTP handler'lar
│   ├── auth_controller.go     # Register, Login
│   ├── user_controller.go     # GetMe, GetUser, UpdateUser, DeleteUser
│   ├── trading_controller.go  # PlaceOrder, GetPositions, ClosePosition
│   ├── watchlist_controller.go# Watchlist CRUD
│   ├── alert_controller.go    # Alert CRUD, GetTriggered
│   ├── ai_reports_controller.go # AI analiz + chat
│   ├── admin_controller.go    # Admin işlemleri
│   ├── market_controller.go   # GetAssets, WebSocket handler
│   └── leaderboard_controller.go # Rankings, achievements
├── services/
│   ├── ai/                    # LLM provider chain
│   │   ├── provider.go        # ProviderChain, Analyze(), ChatCompletion()
│   │   ├── gemini.go          # Gemini API client
│   │   └── anthropic.go       # Anthropic API client
│   ├── market/                # Fiyat motoru
│   │   ├── engine.go          # PriceEngine, Geometric Brownian Motion
│   │   ├── hub.go             # WebSocket broadcast hub
│   │   └── types.go           # MarketSnapshot, Tick
│   ├── alert/checker.go       # AlertChecker daemon (5sn interval)
│   └── leaderboard/seed.go    # Achievement seed data
├── routes/routes.go           # Tüm route tanımları
└── static/swagger.html        # API dokümantasyonu (go:embed)
```

---

## HTTP Client Yapılandırması

- **Base URL:** `https://bose-platform.onrender.com/api/v1`
- **WebSocket:** `wss://bose-platform.onrender.com/ws/market`
- **Content-Type:** `application/json`
- **Auth Header:** `Authorization: Bearer {jwt_token}`
- **Timeout:** Normal istekler 10sn, AI istekleri 60sn

---

## Authentication (JWT)

- Login başarılı → `{"token": "eyJ...", "user": {...}}` döner
- Token HS256 ile imzalanır, `JWT_SECRET` env var kullanılır
- Claims: `{user_id: uint, email: string, role: string, exp: timestamp}`
- Protected endpoint'ler `middleware.Protected()` ile korunur
- Admin endpoint'ler ek `controllers.AdminRequired` guard'ı gerektirir

---

## AI Provider Chain

Sıralı fallback mekanizması:

1. **Gemini 2.0 Flash** (`GEMINI_API_KEY` gerekli) — 30sn timeout, 2048 max token
2. **Anthropic Claude Sonnet** (`ANTHROPIC_API_KEY` gerekli) — 30sn timeout, 2048 max token
3. **Rules Engine** — API key gerekmez, deterministik kurallar

Her analiz endpoint'i 15sn context timeout ile çalışır. Provider başarısız olursa sonrakine geçer.

---

## Fiyat Motoru (PriceEngine)

- **Algoritma:** Geometric Brownian Motion (drift + volatility)
- **Tick Aralığı:** 2 saniye
- **Default Assets:** BTC, ETH, SOL, THYAO, ASELS, AAPL, NVDA, GOOGL
- **Broadcast:** WebSocket üzerinden tüm connected client'lara

---

## Alert Checker Daemon

- Arka planda 5 saniyede bir çalışır
- Tüm aktif alarmları DB'den çeker
- PriceEngine'den güncel fiyatları alır
- ABOVE: `currentPrice >= targetPrice` → tetikle
- BELOW: `currentPrice <= targetPrice` → tetikle
- Tetiklenen alarm: `is_active = false` yapılır, in-memory cache'e eklenir (max 100)

---

## Environment Variables

| Değişken | Açıklama |
|----------|----------|
| `DB_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT imzalama anahtarı |
| `PORT` | Server portu (default: 8080) |
| `GEMINI_API_KEY` | Google Gemini API key (opsiyonel) |
| `ANTHROPIC_API_KEY` | Anthropic API key (opsiyonel) |
| `CORS_ORIGINS` | Ek izinli CORS origin'ler |
