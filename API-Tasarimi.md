# API Tasarımı - OpenAPI Specification

**OpenAPI Spesifikasyon Dosyası:** [lamine.yaml](./lamine.yaml)

Bu doküman, UraniumZ ekibi tarafından geliştirilen "AI Destekli Borsa ve Kripto Simülasyonu" projesi için OpenAPI Specification (OAS) 3.0 standardına göre hazırlanmış API tasarımını içermektedir.

```yaml
openapi: 3.0.3
info:
  title: AI Destekli Borsa ve Kripto Simülasyonu API
  description: |
    UraniumZ ekibi tarafından geliştirilen, gerçek zamanlı Borsa İstanbul (BİST) ve Kripto para simülasyonu için RESTful API.
    
    ## Özellikler
    - Kullanıcı profili, bakiye ve yönetim işlemleri
    - İzleme listesi (Watchlist) ve fiyat alarmı operasyonları
    - Gerçek zamanlı piyasa verileri ve varlık yönetimi
    - Alım/Satım emir işlemleri ve pozisyon yönetimi
    - Yapay zeka destekli portföy analizi, watchlist analizi ve akıllı sohbet
    - Liderlik tablosu ve başarım sistemi
    - JWT tabanlı kimlik doğrulama
  version: 1.0.0
  contact:
    name: UraniumZ API Destek Ekibi
    email: api-support@bose-platform.onrender.com
    url: https://bose-platform.onrender.com
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://bose-platform.onrender.com/api/v1
    description: Production server (Render)
  - url: http://localhost:8080/api/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri (Kayıt, Giriş)
  - name: users
    description: Kullanıcı profili, güncelleme ve AI tercih işlemleri
  - name: trading
    description: Emir oluşturma, pozisyon yönetimi ve portföy işlemleri
  - name: watchlist
    description: İzleme listesi ve fiyat alarmı işlemleri
  - name: ai
    description: Yapay zeka analiz, rapor ve sohbet işlemleri
  - name: market
    description: Piyasa verileri ve varlık listeleme işlemleri
  - name: leaderboard
    description: Liderlik tablosu ve başarım işlemleri
  - name: admin
    description: Yönetim paneli, kullanıcı ve varlık yönetimi işlemleri

paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Yeni kullanıcı kaydı
      description: Sisteme yeni bir kullanıcı kaydeder ve 100.000 TL başlangıç sanal bakiyesini tanımlar.
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '400':
          $ref: '#/components/responses/BadRequest'
        '409':
          description: Email adresi zaten kullanımda
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /auth/login:
    post:
      tags:
        - auth
      summary: Kullanıcı girişi
      description: Email ve şifre ile giriş yapar, JWT token döner.
      operationId: loginUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/me:
    get:
      tags:
        - users
      summary: Kendi profilini görüntüle
      description: JWT token'dan alınan kullanıcı ID'si ile kendi profil bilgilerini getirir.
      operationId: getMe
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}:
    get:
      tags:
        - users
      summary: Kullanıcı detayı
      description: Kullanıcının profil bilgilerini ve sanal bakiyesini getirir.
      operationId: getUserById
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
    
    put:
      tags:
        - users
      summary: Kullanıcı güncelle
      description: Kullanıcı profil bilgilerini günceller.
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
              $ref: '#/components/schemas/UpdateProfileRequest'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
    
    delete:
      tags:
        - users
      summary: Kullanıcı sil
      description: Kullanıcıyı ve tüm verilerini sistemden siler.
      operationId: deleteUser
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '204':
          description: Başarıyla silindi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}/ai-preferences:
    post:
      tags:
        - users
      summary: AI tercihlerini kaydet
      description: Yapay zeka yatırım risk seviyesi ve vade tercihlerini kaydeder.
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
              $ref: '#/components/schemas/AIPreferencesRequest'
      responses:
        '200':
          description: Tercihler kaydedildi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /trading/order:
    post:
      tags:
        - trading
      summary: Emir oluştur
      description: Anlık piyasa fiyatından alım veya satım emri oluşturur. Alımda bakiyeden düşer, satışta pozisyon kapatılır.
      operationId: placeOrder
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderRequest'
      responses:
        '201':
          description: Emir gerçekleşti
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Trade'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /trading/positions:
    get:
      tags:
        - trading
      summary: Açık pozisyonları listele
      description: Kullanıcının tüm açık pozisyonlarını güncel piyasa fiyatları ve PnL ile getirir.
      operationId: getPositions
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PositionDetail'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /trading/positions/{positionId}/close:
    post:
      tags:
        - trading
      summary: Pozisyon kapat
      description: Belirtilen pozisyonu güncel piyasa fiyatından kapatır ve bakiyeyi günceller.
      operationId: closePosition
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/PositionIdParam'
      responses:
        '200':
          description: Pozisyon kapatıldı
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /trading/history:
    get:
      tags:
        - trading
      summary: İşlem geçmişi
      description: Kullanıcının gerçekleşmiş tüm alım-satım işlemlerini kronolojik listeler.
      operationId: getTradeHistory
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Trade'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /trading/portfolio:
    get:
      tags:
        - trading
      summary: Portföy özeti
      description: Kullanıcının toplam bakiye, pozisyon değeri, PnL ve detaylı pozisyon bilgilerini döner.
      operationId: getPortfolio
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PortfolioResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlist:
    get:
      tags:
        - watchlist
      summary: İzleme listelerini getir
      description: Kullanıcının tüm izleme listelerini ve içlerindeki varlıkları listeler.
      operationId: getWatchlists
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Watchlist'
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      tags:
        - watchlist
      summary: Yeni liste oluştur
      description: Yeni bir izleme listesi oluşturur.
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
          description: Oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Watchlist'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlist/{id}:
    delete:
      tags:
        - watchlist
      summary: Listeyi sil
      operationId: deleteWatchlist
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/WatchlistIdParam'
      responses:
        '204':
          description: Silindi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlist/{id}/items:
    post:
      tags:
        - watchlist
      summary: Listeye varlık ekle
      operationId: addWatchlistItem
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/WatchlistIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                symbol:
                  type: string
                  example: "BTC"
      responses:
        '201':
          description: Eklendi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlist/{id}/items/{itemId}:
    delete:
      tags:
        - watchlist
      summary: Listeden varlık çıkar
      operationId: removeWatchlistItem
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/WatchlistIdParam'
        - $ref: '#/components/parameters/ItemIdParam'
      responses:
        '204':
          description: Çıkarıldı
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlist/alerts:
    post:
      tags:
        - watchlist
      summary: Fiyat alarmı kur
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
        '400':
          $ref: '#/components/responses/BadRequest'

    get:
      tags:
        - watchlist
      summary: Alarmları listele
      operationId: getAlerts
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Alert'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlist/alerts/{alertId}:
    delete:
      tags:
        - watchlist
      summary: Alarmı sil
      operationId: deleteAlert
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/AlertIdParam'
      responses:
        '204':
          description: Silindi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlist/alerts/triggered:
    get:
      tags:
        - watchlist
      summary: Tetiklenmiş alarmları getir
      description: Son kontrol döngüsünde tetiklenen alarmları listeler.
      operationId: getTriggeredAlerts
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Alert'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/advice:
    post:
      tags:
        - ai
      summary: AI yatırım tavsiyesi
      description: Belirtilen varlık için yapay zeka tabanlı AL/SAT/TUT tavsiyesi alır.
      operationId: getAdvice
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AIAdviceRequest'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIAdviceResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/reports/portfolio:
    post:
      tags:
        - ai
      summary: AI portföy raporu
      description: ProviderChain (Gemini → Claude → Rules Engine) ile portföy risk analizi ve strateji önerisi.
      operationId: analyzePortfolio
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIReportResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/reports/watchlist:
    post:
      tags:
        - ai
      summary: AI watchlist raporu
      description: İzleme listesindeki varlıklar için yapay zeka analizi.
      operationId: analyzeWatchlist
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIReportResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/reports/transactions:
    post:
      tags:
        - ai
      summary: AI işlem geçmişi raporu
      description: İşlem geçmişi üzerinden yapay zeka performans analizi.
      operationId: analyzeTransactions
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIReportResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/chat:
    post:
      tags:
        - ai
      summary: AI chatbot
      description: Yapay zeka asistanı ile serbest metin sohbet.
      operationId: aiChat
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
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIChatResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /market/assets:
    get:
      tags:
        - market
      summary: Piyasa varlıklarını listele
      description: PriceEngine tarafından üretilen anlık fiyatlarla tüm varlıkları döndürür.
      operationId: getAssets
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MarketAsset'

  /leaderboard/rankings:
    get:
      tags:
        - leaderboard
      summary: Liderlik tablosu
      description: Tüm kullanıcıları toplam portföy değerine göre sıralar.
      operationId: getRankings
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/LeaderboardEntry'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /leaderboard/user/{userId}:
    get:
      tags:
        - leaderboard
      summary: Kullanıcı sıralaması
      description: Belirtilen kullanıcının liderlik tablosundaki sırasını getirir.
      operationId: getUserRank
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/UserIdParam'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LeaderboardEntry'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /leaderboard/achievements:
    get:
      tags:
        - leaderboard
      summary: Başarımları listele
      description: Kullanıcının kazandığı başarım rozetlerini listeler.
      operationId: getAchievements
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/UserAchievement'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /admin/logs:
    get:
      tags:
        - admin
      summary: Admin loglarını görüntüle
      description: Sistem yönetim loglarını getirir. Admin yetkisi gerektirir.
      operationId: getAdminLogs
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/users/{id}:
    delete:
      tags:
        - admin
      summary: Kullanıcı sil (Admin)
      description: Admin yetkisiyle herhangi bir kullanıcıyı siler.
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
        '204':
          description: Silindi
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/users/{id}/role:
    put:
      tags:
        - admin
      summary: Kullanıcı rolü güncelle (Admin)
      description: Kullanıcının rolünü (user/admin) günceller.
      operationId: adminUpdateRole
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
              properties:
                role:
                  type: string
                  enum: [user, admin]
      responses:
        '200':
          description: Güncellendi
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/announcements:
    post:
      tags:
        - admin
      summary: Duyuru oluştur (Admin)
      description: Sistem genelinde duyuru yayınlar.
      operationId: createAnnouncement
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnnouncementCreate'
      responses:
        '201':
          description: Duyuru oluşturuldu
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/market/assets:
    get:
      tags:
        - admin
      summary: Admin varlık listesi
      description: Tüm market varlıklarını admin görünümüyle listeler.
      operationId: adminGetAssets
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MarketAsset'
        '403':
          $ref: '#/components/responses/Forbidden'

    post:
      tags:
        - admin
      summary: Yeni market varlığı ekle (Admin)
      operationId: adminCreateAsset
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MarketAssetCreate'
      responses:
        '201':
          description: Eklendi
        '403':
          $ref: '#/components/responses/Forbidden'

  /admin/market/assets/{symbol}:
    put:
      tags:
        - admin
      summary: Varlık bilgilerini güncelle (Admin)
      operationId: adminUpdateAsset
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/SymbolParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MarketAssetUpdate'
      responses:
        '200':
          description: Güncellendi
        '403':
          $ref: '#/components/responses/Forbidden'

    delete:
      tags:
        - admin
      summary: Market varlığı sil (Admin)
      operationId: adminDeleteAsset
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/SymbolParam'
      responses:
        '204':
          description: Silindi
        '403':
          $ref: '#/components/responses/Forbidden'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile kimlik doğrulama (golang-jwt/v5, HS256)

  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      schema:
        type: integer
    WatchlistIdParam:
      name: id
      in: path
      required: true
      schema:
        type: integer
    ItemIdParam:
      name: itemId
      in: path
      required: true
      schema:
        type: integer
    AlertIdParam:
      name: alertId
      in: path
      required: true
      schema:
        type: integer
    PositionIdParam:
      name: positionId
      in: path
      required: true
      schema:
        type: integer
    SymbolParam:
      name: symbol
      in: path
      required: true
      schema:
        type: string
        example: "BTC"

  schemas:
    User:
      type: object
      required:
        - id
        - email
        - fullName
        - virtualBalance
      properties:
        id:
          type: integer
        email:
          type: string
          format: email
          example: "furkan@example.com"
        fullName:
          type: string
          example: "Furkan Alp Günay"
        phone:
          type: string
          example: "+905551234567"
        virtualBalance:
          type: number
          format: float
          description: Sanal cüzdan bakiyesi (TRY)
          example: 100000.00
        role:
          type: string
          example: "user"
        riskLevel:
          type: string
          enum: [LOW, MEDIUM, HIGH]
        investmentTerm:
          type: string
          enum: [SHORT_TERM, MEDIUM_TERM, LONG_TERM]
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    RegisterRequest:
      type: object
      required:
        - email
        - password
        - fullName
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          format: password
          minLength: 8
        fullName:
          type: string
          minLength: 2

    LoginRequest:
      type: object
      required:
        - email
        - password
      properties:
        email:
          type: string
          format: email
        password:
          type: string
          format: password

    UpdateProfileRequest:
      type: object
      properties:
        fullName:
          type: string
          minLength: 2
        phone:
          type: string

    AIPreferencesRequest:
      type: object
      required:
        - riskLevel
        - investmentTerm
      properties:
        riskLevel:
          type: string
          enum: [LOW, MEDIUM, HIGH]
        investmentTerm:
          type: string
          enum: [SHORT_TERM, MEDIUM_TERM, LONG_TERM]

    AuthResponse:
      type: object
      required:
        - token
        - user
      properties:
        token:
          type: string
        user:
          $ref: '#/components/schemas/User'

    Trade:
      type: object
      properties:
        id:
          type: integer
        userId:
          type: integer
        symbol:
          type: string
          example: "BTC"
        side:
          type: string
          enum: [BUY, SELL]
        quantity:
          type: number
          format: float
        price:
          type: number
          format: float
        total:
          type: number
          format: float
        createdAt:
          type: string
          format: date-time

    OrderRequest:
      type: object
      required:
        - symbol
        - side
        - quantity
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
          example: 0.5

    Position:
      type: object
      properties:
        id:
          type: integer
        userId:
          type: integer
        symbol:
          type: string
        quantity:
          type: number
          format: float
        avgEntryPrice:
          type: number
          format: float
        createdAt:
          type: string
          format: date-time

    PositionDetail:
      type: object
      allOf:
        - $ref: '#/components/schemas/Position'
        - type: object
          properties:
            currentPrice:
              type: number
              format: float
            marketValue:
              type: number
              format: float
            pnl:
              type: number
              format: float
            pnlPercent:
              type: number
              format: float

    PortfolioResponse:
      type: object
      properties:
        balance:
          type: number
          format: float
        inPositions:
          type: number
          format: float
        totalValue:
          type: number
          format: float
        pnl:
          type: number
          format: float
        pnlPercent:
          type: number
          format: float
        positions:
          type: array
          items:
            $ref: '#/components/schemas/PositionDetail'

    Watchlist:
      type: object
      properties:
        id:
          type: integer
        userId:
          type: integer
        name:
          type: string
          example: "Kriptolarım"
        items:
          type: array
          items:
            $ref: '#/components/schemas/WatchlistItem'
        createdAt:
          type: string
          format: date-time

    WatchlistItem:
      type: object
      properties:
        id:
          type: integer
        watchlistId:
          type: integer
        symbol:
          type: string
          example: "BTC"
        createdAt:
          type: string
          format: date-time

    WatchlistCreate:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          example: "Kriptolarım"

    Alert:
      type: object
      properties:
        id:
          type: integer
        userId:
          type: integer
        watchlist_id:
          type: integer
        symbol:
          type: string
          example: "BTC"
        target_price:
          type: number
          format: float
        condition:
          type: string
          enum: [ABOVE, BELOW]
        is_active:
          type: boolean
        createdAt:
          type: string
          format: date-time

    AlertCreate:
      type: object
      required:
        - symbol
        - target_price
        - condition
      properties:
        symbol:
          type: string
          example: "BTC"
        target_price:
          type: number
          format: float
        condition:
          type: string
          enum: [ABOVE, BELOW]
        watchlist_id:
          type: integer

    MarketAsset:
      type: object
      properties:
        symbol:
          type: string
          example: "BTC"
        name:
          type: string
          example: "Bitcoin"
        price:
          type: number
          format: float
        change24h:
          type: number
          format: float

    MarketAssetCreate:
      type: object
      required:
        - symbol
        - name
        - price
      properties:
        symbol:
          type: string
        name:
          type: string
        price:
          type: number
          format: float

    MarketAssetUpdate:
      type: object
      properties:
        name:
          type: string
        price:
          type: number
          format: float

    AIAdviceRequest:
      type: object
      required:
        - symbol
      properties:
        symbol:
          type: string
          example: "BTC"

    AIAdviceResponse:
      type: object
      properties:
        symbol:
          type: string
        recommendation:
          type: string
          enum: [BUY, HOLD, SELL]
        analysis:
          type: string

    AIReportResponse:
      type: object
      properties:
        report:
          type: string
        provider:
          type: string
          description: Hangi AI sağlayıcısının yanıt verdiği (gemini, anthropic, rules-engine)

    AIChatRequest:
      type: object
      required:
        - message
      properties:
        message:
          type: string
          example: "BTC hakkında ne düşünüyorsun?"

    AIChatResponse:
      type: object
      properties:
        reply:
          type: string
        provider:
          type: string

    AnnouncementCreate:
      type: object
      required:
        - title
        - content
      properties:
        title:
          type: string
        content:
          type: string

    LeaderboardEntry:
      type: object
      properties:
        rank:
          type: integer
        userId:
          type: integer
        fullName:
          type: string
        totalValue:
          type: number
          format: float
        pnl:
          type: number
          format: float
        pnlPercent:
          type: number
          format: float
        tradeCount:
          type: integer

    UserAchievement:
      type: object
      properties:
        id:
          type: integer
        userId:
          type: integer
        achievementId:
          type: integer
        achievement:
          $ref: '#/components/schemas/Achievement'
        earnedAt:
          type: string
          format: date-time

    Achievement:
      type: object
      properties:
        id:
          type: integer
        code:
          type: string
        name:
          type: string
        description:
          type: string
        icon:
          type: string

    Error:
      type: object
      required:
        - error
      properties:
        error:
          type: string
          example: "Eksik parametre gönderildi."

  responses:
    BadRequest:
      description: Geçersiz istek
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "İstek parametreleri geçersiz"
    
    Unauthorized:
      description: Yetkisiz erişim veya Token süresi dolmuş
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "Kimlik doğrulama başarısız"
    
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "İstenen kaynak bulunamadı"
    
    Forbidden:
      description: Bu işlem için Yönetici (Admin) yetkisi gerekiyor
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error: "Bu işlem için yetkiniz bulunmamaktadır"
```
