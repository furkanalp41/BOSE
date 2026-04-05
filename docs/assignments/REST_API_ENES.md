# REST API Documentation — Enes

## Domain
**API Base URL:** https://bose-platform.onrender.com/api/v1

## Test Videosu
> [YouTube video linki buraya eklenecek]

## Responsibilities
AI-powered analysis: portfolio analysis, transaction analysis, AI chat advisor, and recommendation engine.

## Endpoints

### AI Reports
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/v1/ai/advice` | — | Get AI-generated investment advice based on user profile and positions. |
| POST | `/api/v1/ai/reports/portfolio` | — | Full portfolio analysis with holdings, P&L, risk score, and AI commentary. |
| POST | `/api/v1/ai/reports/watchlist` | `{ "watchlist_id": 1 }` or `{ "items": [{"name":"BTC","price":67000}] }` | Analyze a watchlist with buy/sell signals per asset. |
| POST | `/api/v1/ai/reports/transactions` | — | Behavioral analysis of trading history with pattern detection. |

### AI Chat
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/v1/ai/chat` | `{ "message": "string" }` or `{ "messages": [{"role":"user","content":"string"}] }` | Chat with the AI advisor about markets and portfolio. |

## AI Provider Chain
The system uses a fallback chain: **Gemini** (primary) → **Anthropic** (secondary) → **Rules Engine** (built-in fallback). If no API keys are configured, the rules engine provides deterministic analysis.

## Response Structure (Portfolio)
```json
{
  "alignment_score": 75,
  "overall_risk": "medium",
  "portfolio_risk_score": 5.5,
  "diversification_score": 66,
  "analysis_content": "AI-generated analysis text...",
  "recommendations": ["BUY BTC: Strong momentum..."],
  "holdings": [{ "symbol": "BTC", "quantity": 0.5, "pnl": 120.50 }],
  "model_used": "gemini-2.0-flash"
}
```

## Response Structure (Chat)
```json
{
  "reply": "Based on current market conditions...",
  "referenced_symbols": ["BTC", "ETH"],
  "suggested_actions": [{ "action_type": "buy", "symbol": "BTC" }],
  "follow_up_questions": ["What's your view on my portfolio?"],
  "model_used": "gemini-2.0-flash"
}
```
