# API Tasarimi - OpenAPI Specification

**Canli API:** `https://bose-platform.onrender.com/api/v1`
**API Dokumantasyonu:** `https://bose-platform.onrender.com/docs`
**Frontend:** `https://frontend-bose.vercel.app`

Bu dokuman, UraniumZ ekibi tarafindan gelistirilen "BOSE — AI Destekli Borsa ve Kripto Simulasyonu" projesi icin OpenAPI Specification (OAS) 3.0 standardina gore hazirlanmis API tasarimini icermektedir. Toplam **37 endpoint** tanimlanmistir.

```yaml
openapi: 3.0.3
info:
  title: BOSE - AI Destekli Borsa ve Kripto Simulasyonu API
  description: |
    UraniumZ ekibi tarafindan gelistirilen, gercek zamanli borsa ve kripto para
    simulasyonu icin RESTful API.

    ## Ozellikler
    - JWT tabanli kimlik dogrulama (HS256)
    - Kullanici profili, AI tercihleri ve admin yonetimi
    - Sanal bakiye ile alis/satis islemleri
    - Izleme listeleri ve fiyat alarmlari
    - AI destekli portfoy/watchlist/islem analizi ve chatbot
    - Gercek zamanli piyasa verileri (WebSocket + REST)
    - Liderlik tablosu ve basarimlar
    - Geometric Brownian Motion fiyat motoru
  version: 2.0.0
  contact:
    name: UraniumZ Ekibi

servers:
  - url: https://bose-platform.onrender.com/api/v1
    description: Production server (Render)
  - url: http://localhost:8080/api/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik dogrulama islemleri (Kayit, Giris)
  - name: users
    description: Kullanici profili ve AI tercihleri
  - name: trading
    description: Alis/satis emirleri, pozisyonlar, portfoy
  - name: watchlist
    description: Izleme listeleri ve sembol yonetimi
  - name: alerts
    description: Fiyat alarmlari (ABOVE/BELOW)
  - name: ai
    description: AI analiz, rapor ve chatbot (Gemini → Claude → Rules Engine)
  - name: market
    description: Canli piyasa verileri
  - name: leaderboard
    description: Siralama ve basarimlar
  - name: admin
    description: Admin yonetim islemleri

# ============================================================
# PATHS — 37 Endpoint
# ============================================================
paths:

  # ── Auth (Furkan Alp Gunay) ──────────────────────────────
  /auth/register:
    post:
      tags: [auth]
      summary: Yeni kullanici kaydi
      description: fullName, email, password ile kayit. Baslangic bakiyesi 100,000 TRY.
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
      responses:
        '201':
          description: Kullanici olusturuldu, JWT token doner
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: Email zaten kullanimda
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      tags: [auth]
      summary: Kullanici girisi
      description: Email ve sifre ile giris, JWT token doner.
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginCredentials'
      responses:
        '200':
          description: Giris basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  # ── Users (Furkan Alp Gunay) ─────────────────────────────
  /users/me:
    get:
      tags: [users]
      summary: Aktif kullanici profili
      operationId: getMe
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}:
    get:
      tags: [users]
      summary: Kullanici detayi
      operationId: getUserById
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      tags: [users]
      summary: Profil guncelle
      operationId: updateUser
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdate'
      responses:
        '200':
          description: Guncellendi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

    delete:
      tags: [users]
      summary: Hesap sil
      operationId: deleteUser
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: Silindi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MessageResponse'

  /users/{userId}/ai-preferences:
    post:
      tags: [users]
      summary: AI tercihlerini kaydet
      description: Risk seviyesi ve yatirim vadesi tercihleri.
      operationId: saveAIPreferences
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AIPreference'
      responses:
        '200':
          description: Tercihler kaydedildi

  # ── Trading (Cem Karaca) ─────────────────────────────────
  /trading/order:
    post:
      tags: [trading]
      summary: Alim/satim emri olustur
      description: Sanal bakiye ile BUY/SELL emri. PriceEngine'den anlik fiyat alinir.
      operationId: placeOrder
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderCreate'
      responses:
        '201':
          description: Emir gerceklesti
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Trade'
        '400':
          $ref: '#/components/responses/BadRequest'

  /trading/positions:
    get:
      tags: [trading]
      summary: Acik pozisyonlari listele
      operationId: getPositions
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Position'

  /trading/positions/{positionId}/close:
    post:
      tags: [trading]
      summary: Pozisyon kapat
      operationId: closePosition
      security:
        - bearerAuth: []
      parameters:
        - name: positionId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Pozisyon kapatildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Trade'

  /trading/history:
    get:
      tags: [trading]
      summary: Islem gecmisi
      operationId: getTradeHistory
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Trade'

  /trading/portfolio:
    get:
      tags: [trading]
      summary: Portfoy ozeti
      description: Toplam deger, P&L, pozisyon sayisi.
      operationId: getPortfolio
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Portfolio'

  # ── Watchlist (Salih Arda Katircioglu) ───────────────────
  /watchlist/:
    post:
      tags: [watchlist]
      summary: Izleme listesi olustur
      operationId: createWatchlist
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WatchlistCreate'
      responses:
        '201':
          description: Olusturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Watchlist'

    get:
      tags: [watchlist]
      summary: Tum listeleri getir
      description: Items dahil tum izleme listelerini doner.
      operationId: getWatchlists
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Watchlist'

  /watchlist/{id}:
    delete:
      tags: [watchlist]
      summary: Listeyi sil (cascade items)
      operationId: deleteWatchlist
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Silindi

  /watchlist/{id}/items:
    post:
      tags: [watchlist]
      summary: Sembol ekle
      description: PriceEngine'den sembol validasyonu yapilir.
      operationId: addWatchlistItem
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [symbol]
              properties:
                symbol:
                  type: string
                  example: "BTC"
      responses:
        '201':
          description: Eklendi

  /watchlist/{id}/items/{itemId}:
    delete:
      tags: [watchlist]
      summary: Sembol cikar
      operationId: removeWatchlistItem
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
        - name: itemId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Cikarildi

  # ── Alerts (Salih Arda Katircioglu) ──────────────────────
  /watchlist/alerts:
    post:
      tags: [alerts]
      summary: Fiyat alarmi olustur
      description: ABOVE veya BELOW kosulu ile hedef fiyat alarmi.
      operationId: createAlert
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AlertCreate'
      responses:
        '201':
          description: Alarm kuruldu

    get:
      tags: [alerts]
      summary: Alarmlari listele
      operationId: getAlerts
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Alert'

  /watchlist/alerts/{alertId}:
    delete:
      tags: [alerts]
      summary: Alarm sil
      operationId: deleteAlert
      security:
        - bearerAuth: []
      parameters:
        - name: alertId
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Silindi

  /watchlist/alerts/triggered:
    get:
      tags: [alerts]
      summary: Tetiklenen alarmlar
      description: In-memory cache'den son tetiklenen alarmlar (max 100).
      operationId: getTriggeredAlerts
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/TriggeredAlert'

  # ── AI Reports & Chat (Enes Coban) ──────────────────────
  /ai/advice:
    post:
      tags: [ai]
      summary: AI yatirim tavsiyesi
      description: Kural tabanli yatirim tavsiyesi.
      operationId: getAIAdvice
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIReport'

  /ai/reports/portfolio:
    post:
      tags: [ai]
      summary: AI portfoy analizi
      description: |
        ProviderChain: Gemini 2.0 Flash → Anthropic Claude Sonnet → Rules Engine.
        Portfoy risk skoru, cesiitlendirme tavsiyesi, genel degerlendirme.
      operationId: getPortfolioReport
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIReport'

  /ai/reports/watchlist:
    post:
      tags: [ai]
      summary: AI watchlist sinyal analizi
      description: Izleme listesindeki semboller icin AL/SAT/TUT/IZLE sinyalleri.
      operationId: getWatchlistReport
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      name:
                        type: string
                      price:
                        type: number
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIReport'

  /ai/reports/transactions:
    post:
      tags: [ai]
      summary: AI islem davranis analizi
      description: Islem gecmisine dayali davranis pattern'leri ve oneriler.
      operationId: getTransactionReport
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIReport'

  /ai/chat:
    post:
      tags: [ai]
      summary: AI chatbot
      description: Coklu mesaj destegi, dil secimi (EN/TR).
      operationId: sendAIChatMessage
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AIChatRequest'
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIChatResponse'

  # ── Market (Yakup Efe Celebi) ────────────────────────────
  /market/assets:
    get:
      tags: [market]
      summary: Canli piyasa verileri
      description: |
        Public endpoint (token gerekmez).
        PriceEngine'den anlik fiyatlar, 24h degisim, drift/volatility.
        Default assets: BTC, ETH, SOL, THYAO, ASELS, AAPL, NVDA, GOOGL.
      operationId: getMarketAssets
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MarketAsset'

  # ── Leaderboard (Yakup Efe Celebi) ──────────────────────
  /leaderboard/rankings:
    get:
      tags: [leaderboard]
      summary: Global siralama
      operationId: getRankings
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/RankEntry'

  /leaderboard/user/{userId}:
    get:
      tags: [leaderboard]
      summary: Kullanici siralamasi
      operationId: getUserRanking
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/RankEntry'

  /leaderboard/achievements:
    get:
      tags: [leaderboard]
      summary: Basarim listesi
      operationId: getAchievements
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Achievement'

  # ── Admin (Furkan Alp Gunay + Cem Karaca + Yakup Efe) ───
  /admin/logs:
    get:
      tags: [admin]
      summary: Admin audit loglari
      operationId: getAdminLogs
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili (admin rolu gerekli)
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/users/{id}/role:
    put:
      tags: [admin]
      summary: Kullanici rolu guncelle
      operationId: updateUserRole
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [role]
              properties:
                role:
                  type: string
                  enum: [user, admin]
      responses:
        '200':
          description: Rol guncellendi
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/users/{id}:
    delete:
      tags: [admin]
      summary: Admin kullanici silme
      operationId: adminDeleteUser
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: integer
      responses:
        '200':
          description: Silindi
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/announcements:
    post:
      tags: [admin]
      summary: Sistem duyurusu olustur
      operationId: createAnnouncement
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [message]
              properties:
                message:
                  type: string
                  example: "Sistem bakimda!"
      responses:
        '201':
          description: Duyuru olusturuldu
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/market/assets:
    get:
      tags: [admin]
      summary: Admin asset listesi
      operationId: getAdminAssets
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Basarili
        '403':
          $ref: '#/components/responses/Forbidden'

    post:
      tags: [admin]
      summary: Yeni asset ekle
      operationId: createAdminAsset
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdminAssetCreate'
      responses:
        '201':
          description: Asset eklendi
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/market/assets/{symbol}:
    delete:
      tags: [admin]
      summary: Asset sil
      operationId: deleteAdminAsset
      security:
        - bearerAuth: []
      parameters:
        - name: symbol
          in: path
          required: true
          schema:
            type: string
            example: "TSLA"
      responses:
        '200':
          description: Silindi
        '403':
          $ref: '#/components/responses/Forbidden'

# ============================================================
# COMPONENTS
# ============================================================
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token (HS256, golang-jwt/v5)

  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      schema:
        type: integer
        description: Auto-increment uint ID

  schemas:
    # ── Auth ──
    UserRegistration:
      type: object
      required: [fullName, email, password]
      properties:
        fullName:
          type: string
          example: "Furkan Alp Gunay"
        email:
          type: string
          format: email
          example: "furkan@test.com"
        password:
          type: string
          format: password
          minLength: 6
          example: "Test1234!"

    LoginCredentials:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          format: password

    AuthResponse:
      type: object
      properties:
        token:
          type: string
          description: JWT token (HS256)
        user:
          $ref: '#/components/schemas/User'

    # ── User ──
    User:
      type: object
      properties:
        id:
          type: integer
        email:
          type: string
        full_name:
          type: string
        role:
          type: string
          enum: [user, admin]
        balance:
          type: number
          format: float
          description: Sanal bakiye (TRY), baslangic 100,000
        created_at:
          type: string
          format: date-time

    UserUpdate:
      type: object
      properties:
        full_name:
          type: string
        risk_level:
          type: string
          enum: [LOW, MEDIUM, HIGH]

    AIPreference:
      type: object
      properties:
        riskLevel:
          type: string
          enum: [LOW, MEDIUM, HIGH]
        investmentTerm:
          type: string
          enum: [SHORT_TERM, MEDIUM_TERM, LONG_TERM]

    MessageResponse:
      type: object
      properties:
        message:
          type: string

    # ── Trading ──
    OrderCreate:
      type: object
      required: [symbol, side, quantity]
      properties:
        symbol:
          type: string
          example: "BTC"
        side:
          type: string
          enum: [BUY, SELL]
        quantity:
          type: number
          format: float
          example: 0.01

    Trade:
      type: object
      properties:
        id:
          type: integer
        user_id:
          type: integer
        symbol:
          type: string
        side:
          type: string
          enum: [BUY, SELL]
        quantity:
          type: number
        price:
          type: number
        total:
          type: number
        created_at:
          type: string
          format: date-time

    Position:
      type: object
      properties:
        id:
          type: integer
        symbol:
          type: string
        side:
          type: string
        quantity:
          type: number
        entry_price:
          type: number
        current_price:
          type: number
        pnl:
          type: number
        is_open:
          type: boolean

    Portfolio:
      type: object
      properties:
        balance:
          type: number
        total_value:
          type: number
        total_pnl:
          type: number
        position_count:
          type: integer

    # ── Watchlist ──
    WatchlistCreate:
      type: object
      required: [name]
      properties:
        name:
          type: string
          example: "Kripto Favori"

    Watchlist:
      type: object
      properties:
        id:
          type: integer
        user_id:
          type: integer
        name:
          type: string
        items:
          type: array
          items:
            $ref: '#/components/schemas/WatchlistItem'

    WatchlistItem:
      type: object
      properties:
        id:
          type: integer
        symbol:
          type: string
        added_at:
          type: string
          format: date-time

    # ── Alerts ──
    AlertCreate:
      type: object
      required: [symbol, target_price, condition]
      properties:
        symbol:
          type: string
          example: "BTC"
        target_price:
          type: number
          format: float
          example: 70000
        condition:
          type: string
          enum: [ABOVE, BELOW]

    Alert:
      type: object
      properties:
        id:
          type: integer
        user_id:
          type: integer
        symbol:
          type: string
        target_price:
          type: number
        condition:
          type: string
          enum: [ABOVE, BELOW]
        is_active:
          type: boolean
        created_at:
          type: string
          format: date-time

    TriggeredAlert:
      type: object
      properties:
        alert_id:
          type: integer
        symbol:
          type: string
        target_price:
          type: number
        triggered_price:
          type: number
        condition:
          type: string
        triggered_at:
          type: string
          format: date-time

    # ── AI ──
    AIReport:
      type: object
      properties:
        analysis:
          type: string
          description: AI veya Rules Engine tarafindan uretilen analiz metni
        model_used:
          type: string
          description: Kullanilan model (gemini-2.0-flash, claude-sonnet, rules-engine)
        scores:
          type: object
          description: Skor degerleri (portfoy analizi icin)
        signals:
          type: array
          description: Sinyal listesi (watchlist analizi icin)
          items:
            type: object

    AIChatRequest:
      type: object
      required: [message]
      properties:
        message:
          type: string
          example: "BTC hakkinda ne dusunuyorsun?"

    AIChatResponse:
      type: object
      properties:
        response:
          type: string
        model_used:
          type: string

    # ── Market ──
    MarketAsset:
      type: object
      properties:
        symbol:
          type: string
          example: "BTC"
        price:
          type: number
          format: float
        change_24h:
          type: number
          format: float
          description: 24 saatlik degisim yuzdesi
        high_24h:
          type: number
        low_24h:
          type: number
        drift:
          type: number
        volatility:
          type: number

    AdminAssetCreate:
      type: object
      required: [symbol, price]
      properties:
        symbol:
          type: string
          example: "TSLA"
        price:
          type: number
          example: 245.50
        drift:
          type: number
          example: 0.0001
        volatility:
          type: number
          example: 0.0015

    # ── Leaderboard ──
    RankEntry:
      type: object
      properties:
        user_id:
          type: integer
        full_name:
          type: string
        total_value:
          type: number
        rank:
          type: integer
        trade_count:
          type: integer

    Achievement:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        description:
          type: string
        icon:
          type: string

    # ── Errors ──
    Error:
      type: object
      properties:
        error:
          type: string
          example: "Invalid credentials"

  responses:
    BadRequest:
      description: Gecersiz istek
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Unauthorized:
      description: Yetkisiz erisim veya token suresi dolmus
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    NotFound:
      description: Kaynak bulunamadi
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    Forbidden:
      description: Admin yetkisi gerekli
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
```

---

## WebSocket Endpoint

| Parametre | Deger |
|-----------|-------|
| URL | `wss://bose-platform.onrender.com/ws/market` |
| Protokol | WebSocket (gofiber/contrib/websocket) |
| Tick Araligi | 2 saniye |
| Veri Formati | JSON (MarketSnapshot) |
| Auth | Gerekli degil (public) |

WebSocket baglantisi kuruldugunda, PriceEngine her 2 saniyede bir tum asset'lerin guncel fiyatlarini broadcast eder.

---

## Endpoint Dagilimi (Kisi Bazinda)

| Uye | Modul | Endpoint Sayisi |
|-----|-------|----------------|
| Furkan Alp Gunay | Auth, User CRUD, Admin | 10 |
| Cem Karaca | Trading, Admin Announcements | 6 |
| Salih Arda Katircioglu | Watchlist, Alerts | 9 |
| Enes Coban | AI Reports, Chat | 5 |
| Yakup Efe Celebi | Market, Leaderboard, Admin Assets | 7 |
| **Toplam** | | **37** |
