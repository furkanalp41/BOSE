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
    - Kullanıcı profili, bakiye ve güvenlik logları yönetimi
    - İzleme listesi (Watchlist) operasyonları
    - Gerçek zamanlı piyasa verileri ve varlık yönetimi
    - Alım/Satım emir işlemleri (Piyasa ve Limit)
    - Yapay zeka destekli durum, portföy analizi ve akıllı sohbet
    - Fiyat alarmları ve bildirimler
    - JWT tabanlı kimlik doğrulama
  version: 1.0.0
  contact:
    name: UraniumZ API Destek Ekibi
    email: api-support@simulasyon.com
    url: [https://api.simulasyon.com/support](https://api.simulasyon.com/support)
  license:
    name: MIT
    url: [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT)

servers:
  - url: [https://api.simulasyon.com/v1](https://api.simulasyon.com/v1)
    description: Production server
  - url: [https://staging-api.simulasyon.com/v1](https://staging-api.simulasyon.com/v1)
    description: Staging server
  - url: http://localhost:8080/v1
    description: Development server

tags:
  - name: auth
    description: Kimlik doğrulama işlemleri (Kayıt, Giriş)
  - name: users
    description: Kullanıcı profili, bakiye ve log işlemleri
  - name: watchlists
    description: Kullanıcıya özel izleme listesi işlemleri
  - name: orders
    description: Alım, satım ve emir (Market/Limit) işlemleri
  - name: alerts
    description: Fiyat alarmı ve bildirim kuralı işlemleri
  - name: ai
    description: Yapay zeka analiz, rapor ve sohbet işlemleri
  - name: market
    description: Piyasa verileri ve varlık (Hisse/Kripto) işlemleri
  - name: admin
    description: Sistem sağlık ve yönetim işlemleri

paths:
  /auth/register:
    post:
      tags:
        - auth
      summary: Yeni kullanıcı kaydı
      description: Sisteme yeni bir kullanıcı kaydeder ve başlangıç sanal bakiyesini tanımlar.
      operationId: registerUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserRegistration'
      responses:
        '201':
          description: Kullanıcı başarıyla oluşturuldu
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
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
              $ref: '#/components/schemas/LoginCredentials'
      responses:
        '200':
          description: Giriş başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthToken'
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
      description: Kullanıcı bilgilerini günceller.
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

  /users/{userId}/logs:
    get:
      tags:
        - users
      summary: Giriş hareketlerini listele
      description: Kullanıcının son giriş loglarını siber güvenlik için getirir.
      operationId: getUserLogs
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
                type: array
                items:
                  $ref: '#/components/schemas/LogEntry'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /users/{userId}/ai-preferences:
    post:
      tags:
        - users
      summary: AI tercihlerini kaydet
      description: Yapay zeka yatırım risk tercihlerini kaydeder.
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
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlists:
    get:
      tags:
        - watchlists
      summary: İzleme listelerini getir
      description: Kullanıcının tüm izleme listelerini ve varlık anlık fiyatlarını listeler.
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
        - watchlists
      summary: Yeni liste oluştur
      description: Yeni bir izleme listesi klasörü oluşturur.
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

  /watchlists/{listId}:
    put:
      tags:
        - watchlists
      summary: Liste adını güncelle
      operationId: updateWatchlist
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/ListIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/WatchlistUpdate'
      responses:
        '200':
          description: Güncellendi
        '401':
          $ref: '#/components/responses/Unauthorized'

    delete:
      tags:
        - watchlists
      summary: Listeyi sil
      operationId: deleteWatchlist
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/ListIdParam'
      responses:
        '204':
          description: Silindi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlists/{listId}/assets:
    post:
      tags:
        - watchlists
      summary: Listeye varlık ekle
      operationId: addAssetToWatchlist
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/ListIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                symbol:
                  type: string
                  example: "BTCUSDT"
      responses:
        '201':
          description: Eklendi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /watchlists/{listId}/assets/{assetSymbol}:
    delete:
      tags:
        - watchlists
      summary: Listeden varlık çıkar
      operationId: removeAssetFromWatchlist
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/ListIdParam'
        - $ref: '#/components/parameters/AssetSymbolParam'
      responses:
        '204':
          description: Çıkarıldı
        '401':
          $ref: '#/components/responses/Unauthorized'

  /orders/market:
    post:
      tags:
        - orders
      summary: Piyasa emri oluştur
      description: Anlık fiyattan alım veya satım yapar.
      operationId: createMarketOrder
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MarketOrderCreate'
      responses:
        '201':
          description: Emir gerçekleşti
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /orders/limit:
    post:
      tags:
        - orders
      summary: Limit emir oluştur
      description: Belirli bir fiyattan gerçekleşmek üzere bekleyen emir oluşturur.
      operationId: createLimitOrder
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LimitOrderCreate'
      responses:
        '201':
          description: Emir kaydedildi ve bakiye bloke edildi
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
        '400':
          $ref: '#/components/responses/BadRequest'

  /orders/open:
    get:
      tags:
        - orders
      summary: Açık emirleri listele
      description: Henüz gerçekleşmemiş limit emirleri getirir.
      operationId: getOpenOrders
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
                  $ref: '#/components/schemas/Order'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /orders/history:
    get:
      tags:
        - orders
      summary: İşlem geçmişi
      description: Gerçekleşmiş ve iptal edilmiş tüm emirleri kronolojik listeler.
      operationId: getOrderHistory
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/PageParam'
        - $ref: '#/components/parameters/LimitParam'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/OrderList'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /orders/{orderId}:
    put:
      tags:
        - orders
      summary: Limit emir güncelle
      operationId: updateLimitOrder
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/OrderIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/OrderUpdate'
      responses:
        '200':
          description: Güncellendi
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'

    delete:
      tags:
        - orders
      summary: Bekleyen emri iptal et
      description: Emri iptal eder ve bloke bakiyeyi iade eder.
      operationId: cancelOrder
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/OrderIdParam'
      responses:
        '204':
          description: İptal edildi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /alerts:
    post:
      tags:
        - alerts
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

  /alerts/{alertId}:
    put:
      tags:
        - alerts
      summary: Alarmı güncelle
      operationId: updateAlert
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/AlertIdParam'
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AlertUpdate'
      responses:
        '200':
          description: Güncellendi
        '401':
          $ref: '#/components/responses/Unauthorized'

    delete:
      tags:
        - alerts
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

  /ai/report/status/{assetSymbol}:
    get:
      tags:
        - ai
      summary: AI Varlık Durum Raporu
      description: Yapay zekanın hisse/kripto için AL/SAT/TUT tavsiyesi ve analizi.
      operationId: getAIStatusReport
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/AssetSymbolParam'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIStatusReport'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/report/portfolio/{userId}:
    get:
      tags:
        - ai
      summary: AI Portföy Raporu
      description: Portföy risk analizi ve AI strateji önerisi.
      operationId: getAIPortfolioReport
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
                $ref: '#/components/schemas/AIPortfolioReport'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/chat:
    post:
      tags:
        - ai
      summary: AI Chatbot
      description: Yapay zeka asistanı ile etkileşim kurar.
      operationId: sendAIChatMessage
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AIChatMessage'
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIChatMessage'
        '401':
          $ref: '#/components/responses/Unauthorized'

  /ai/history:
    delete:
      tags:
        - ai
      summary: AI geçmişini temizle
      description: Kullanıcının tüm AI sohbet ve analiz geçmişini siler.
      operationId: clearAIHistory
      security:
        - bearerAuth: []
      responses:
        '204':
          description: Temizlendi
        '401':
          $ref: '#/components/responses/Unauthorized'

  /market/prices:
    get:
      tags:
        - market
      summary: Piyasa verilerini listele
      description: Redis üzerinden akan anlık BİST ve Kripto fiyatlarını döndürür.
      operationId: getMarketPrices
      parameters:
        - name: type
          in: query
          description: Varlık tipi
          schema:
            type: string
            enum: [BIST, CRYPTO]
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/MarketDataList'

  /market/assets:
    post:
      tags:
        - market
      summary: Yeni market varlığı ekle (Admin)
      operationId: createMarketAsset
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

  /market/assets/{assetId}:
    put:
      tags:
        - market
      summary: Varlık bilgilerini güncelle (Admin)
      operationId: updateMarketAsset
      security:
        - bearerAuth: []
      parameters:
        - $ref: '#/components/parameters/AssetIdParam'
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

  /admin/health:
    get:
      tags:
        - admin
      summary: Sistem durumunu kontrol et
      description: Docker, Kafka ve Redis servis sağlık raporu.
      operationId: getSystemHealth
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Başarılı
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/HealthStatus'
        '403':
          $ref: '#/components/responses/Forbidden'

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token ile kimlik doğrulama

  parameters:
    UserIdParam:
      name: userId
      in: path
      required: true
      schema:
        type: string
        format: uuid
    ListIdParam:
      name: listId
      in: path
      required: true
      schema:
        type: string
        format: uuid
    AssetSymbolParam:
      name: assetSymbol
      in: path
      required: true
      schema:
        type: string
        example: "THYAO"
    OrderIdParam:
      name: orderId
      in: path
      required: true
      schema:
        type: string
        format: uuid
    AlertIdParam:
      name: alertId
      in: path
      required: true
      schema:
        type: string
        format: uuid
    AssetIdParam:
      name: assetId
      in: path
      required: true
      schema:
        type: string
        format: uuid
    PageParam:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1
    LimitParam:
      name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

  schemas:
    User:
      type: object
      required:
        - id
        - email
        - fullName
        - balance
      properties:
        id:
          type: string
          format: uuid
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
        balance:
          type: number
          format: float
          description: Sanal cüzdan bakiyesi (TRY)
          example: 100000.00
        createdAt:
          type: string
          format: date-time

    UserRegistration:
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
          minLength: 3

    UserUpdate:
      type: object
      properties:
        fullName:
          type: string
          minLength: 3
        phone:
          type: string

    LoginCredentials:
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

    AuthToken:
      type: object
      required:
        - token
        - expiresIn
        - user
      properties:
        token:
          type: string
        expiresIn:
          type: integer
          example: 3600
        user:
          $ref: '#/components/schemas/User'

    LogEntry:
      type: object
      properties:
        ipAddress:
          type: string
          example: "192.168.1.1"
        deviceInfo:
          type: string
          example: "Chrome / Windows 11"
        loginTime:
          type: string
          format: date-time

    AIPreference:
      type: object
      properties:
        riskLevel:
          type: string
          enum: [LOW, MEDIUM, HIGH]
        investmentTerm:
          type: string
          enum: [SHORT_TERM, MEDIUM_TERM, LONG_TERM]

    Watchlist:
      type: object
      properties:
        id:
          type: string
          format: uuid
        name:
          type: string
          example: "Kriptolarım"
        assets:
          type: array
          items:
            $ref: '#/components/schemas/MarketAsset'

    WatchlistCreate:
      type: object
      required:
        - name
      properties:
        name:
          type: string
          example: "Kriptolarım"

    WatchlistUpdate:
      type: object
      properties:
        name:
          type: string

    Order:
      type: object
      properties:
        id:
          type: string
          format: uuid
        symbol:
          type: string
          example: "BTCUSDT"
        side:
          type: string
          enum: [BUY, SELL]
        type:
          type: string
          enum: [MARKET, LIMIT]
        quantity:
          type: number
          format: float
        targetPrice:
          type: number
          format: float
        status:
          type: string
          enum: [PENDING, COMPLETED, CANCELLED]
        createdAt:
          type: string
          format: date-time

    MarketOrderCreate:
      type: object
      required:
        - symbol
        - side
        - quantity
      properties:
        symbol:
          type: string
        side:
          type: string
          enum: [BUY, SELL]
        quantity:
          type: number
          format: float

    LimitOrderCreate:
      type: object
      required:
        - symbol
        - side
        - quantity
        - targetPrice
      properties:
        symbol:
          type: string
        side:
          type: string
          enum: [BUY, SELL]
        quantity:
          type: number
          format: float
        targetPrice:
          type: number
          format: float

    OrderUpdate:
      type: object
      properties:
        quantity:
          type: number
          format: float
        targetPrice:
          type: number
          format: float

    OrderList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Order'
        pagination:
          $ref: '#/components/schemas/Pagination'

    AlertCreate:
      type: object
      required:
        - symbol
        - targetPrice
        - condition
      properties:
        symbol:
          type: string
          example: "THYAO"
        targetPrice:
          type: number
          format: float
        condition:
          type: string
          enum: [GREATER_THAN, LESS_THAN]

    AlertUpdate:
      type: object
      properties:
        targetPrice:
          type: number
          format: float
        isActive:
          type: boolean

    MarketAsset:
      type: object
      properties:
        symbol:
          type: string
          example: "ASELS"
        name:
          type: string
          example: "Aselsan"
        type:
          type: string
          enum: [BIST, CRYPTO]
        currentPrice:
          type: number
          format: float
        change24h:
          type: number
          format: float
        isActive:
          type: boolean

    MarketAssetCreate:
      type: object
      required:
        - symbol
        - name
        - type
      properties:
        symbol:
          type: string
        name:
          type: string
        type:
          type: string
          enum: [BIST, CRYPTO]

    MarketAssetUpdate:
      type: object
      properties:
        description:
          type: string
        isActive:
          type: boolean

    MarketDataList:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/MarketAsset'
        pagination:
          $ref: '#/components/schemas/Pagination'

    AIStatusReport:
      type: object
      properties:
        symbol:
          type: string
        recommendation:
          type: string
          enum: [BUY, HOLD, SELL]
        sentimentScore:
          type: integer
          example: 85
        analysisText:
          type: string
          example: "Teknik göstergeler aşırı alım bölgesinde, kısa vadeli düzeltme beklenebilir."

    AIPortfolioReport:
      type: object
      properties:
        riskScore:
          type: integer
          example: 40
        diversificationAdvice:
          type: string
          example: "Portföyünüz teknoloji ağırlıklı, emtia ekleyerek riski dağıtabilirsiniz."
        expectedReturn:
          type: number
          format: float

    AIChatMessage:
      type: object
      required:
        - message
      properties:
        message:
          type: string
        sender:
          type: string
          enum: [USER, AI]
        timestamp:
          type: string
          format: date-time

    HealthStatus:
      type: object
      properties:
        status:
          type: string
          enum: [UP, DOWN]
        services:
          type: object
          properties:
            database:
              type: string
              example: "UP"
            kafka:
              type: string
              example: "UP"
            redis:
              type: string
              example: "UP"

    Pagination:
      type: object
      properties:
        page:
          type: integer
          example: 1
        limit:
          type: integer
          example: 20
        totalItems:
          type: integer
          example: 45

    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          example: "VALIDATION_ERROR"
        message:
          type: string
          example: "Eksik parametre gönderildi."
        details:
          type: array
          items:
            type: object
            properties:
              field:
                type: string
              message:
                type: string

  responses:
    BadRequest:
      description: Geçersiz istek
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "BAD_REQUEST"
            message: "İstek parametreleri geçersiz"
    
    Unauthorized:
      description: Yetkisiz erişim veya Token süresi dolmuş
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "UNAUTHORIZED"
            message: "Kimlik doğrulama başarısız"
    
    NotFound:
      description: Kaynak bulunamadı
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "NOT_FOUND"
            message: "İstenen kaynak bulunamadı"
    
    Forbidden:
      description: Bu işlem için Yönetici (Admin) yetkisi gerekiyor
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            code: "FORBIDDEN"
            message: "Bu işlem için yetkiniz bulunmamaktadır"
