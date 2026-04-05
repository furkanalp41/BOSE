# Enes Çoban'ın REST API Metotları

**API Test Videosu:** [Link buraya eklenecek](#)

### 1. AI Yatırım Tavsiyesi

* **Endpoint:** `POST /ai/advice`

Authentication: Bearer Token gerekli

Response: 200 OK - Kural tabanlı yatırım tavsiyesi ve model_used bilgisi döndürüldü.

2. AI Portföy Analizi
Endpoint: POST /ai/reports/portfolio

Authentication: Bearer Token gerekli

Response: 200 OK - AI portföy analizi (analysis, model_used, scores) döndürüldü. ProviderChain: Gemini → Claude → Rules Engine.

3. AI Watchlist Sinyal Analizi
Endpoint: POST /ai/reports/watchlist

Request Body:
```json
{
  "items": [
    {"name": "BTC", "price": 67000},
    {"name": "ETH", "price": 3500}
  ]
}
```

Authentication: Bearer Token gerekli

Response: 200 OK - AL/SAT/TUT/İZLE sinyalleri ve confidence skorları döndürüldü.

4. AI İşlem Davranış Analizi
Endpoint: POST /ai/reports/transactions

Authentication: Bearer Token gerekli

Response: 200 OK - İşlem davranış pattern'leri ve iyileştirme önerileri döndürüldü.

5. AI Chatbot
Endpoint: POST /ai/chat

Request Body:
```json
{
  "message": "BTC hakkında ne düşünüyorsun?"
}
```

Authentication: Bearer Token gerekli

Response: 200 OK - AI asistanın cevabı (response, model_used) döndürüldü. Timeout: 60 saniye.
