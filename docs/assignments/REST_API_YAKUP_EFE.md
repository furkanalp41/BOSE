# REST API Documentation — Yakup Efe

## Domain
**API Base URL:** https://bose-platform.onrender.com/api/v1

## Test Videosu
> [YouTube video linki buraya eklenecek]

## Responsibilities
Market data system, admin asset management, leaderboard & achievements, and user profile updates.

## Endpoints

### Market Data (Public)
| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/v1/market/assets` | — | Get all available assets with live prices, market cap, volume, and 24h change. |
| WS | `/ws/market` | — | WebSocket connection for real-time price streaming (ticks every 2 seconds). |

### Admin Asset Management (Admin Only)
| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/v1/admin/market/assets` | — | List all market assets (admin view). |
| POST | `/api/v1/admin/market/assets` | `{ "symbol": "TSLA", "price": 245.50, "drift": 0.0001, "volatility": 0.0015 }` | Add a new asset to the market engine. |
| PUT | `/api/v1/admin/market/assets/:symbol` | `{ "price": 250.00, "drift": 0.0002, "volatility": 0.0020 }` | Update an asset's simulation parameters. |
| DELETE | `/api/v1/admin/market/assets/:symbol` | — | Remove an asset from the market engine. |

### Leaderboard & Achievements
| Method | Path | Body | Description |
|--------|------|------|-------------|
| GET | `/api/v1/leaderboard/rankings` | — | Get the full leaderboard with portfolio-based rankings. |
| GET | `/api/v1/leaderboard/user/:userId` | — | Get a specific user's rank and stats. |
| GET | `/api/v1/leaderboard/achievements` | — | Get all achievements with earned/unearned status for the current user. |

### User Profile Updates
| Method | Path | Body | Description |
|--------|------|------|-------------|
| PUT | `/api/v1/users/:userId` | `{ "full_name": "string", "risk_level": "HIGH" }` | Update user profile (supports both snake_case and camelCase keys). |

## Price Engine
The PriceEngine uses **Geometric Brownian Motion** to simulate realistic price movements. Each asset has:
- **drift:** Long-term price trend (positive = upward bias)
- **volatility:** Price fluctuation intensity

Prices advance every 2 seconds via a background ticker and are broadcast to all WebSocket clients.

## WebSocket Protocol
- Connect to `ws://host/ws/market`
- On connect, receive an immediate price snapshot.
- Every 2 seconds, receive a `MarketSnapshot`:
```json
{
  "ticks": [
    { "symbol": "BTC", "price": 67450.12, "change": 30.12, "changePct": 0.0447, "timestamp": 1712345678000 }
  ]
}
```
