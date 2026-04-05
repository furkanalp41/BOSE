# REST API Documentation — Cem

## Domain
**API Base URL:** https://bose-platform.onrender.com/api/v1

## Test Videosu
> [YouTube video linki buraya eklenecek]

## Responsibilities
Trading engine: order placement, position management, trade history, and portfolio calculation.

## Endpoints

### Trading
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/v1/trading/order` | `{ "symbol": "BTC", "side": "BUY\|SELL", "quantity": 0.5 }` | Place a buy or sell order at the current market price. |
| GET | `/api/v1/trading/positions` | — | List all open positions for the authenticated user. |
| POST | `/api/v1/trading/positions/:positionId/close` | — | Close a specific open position at current market price. |
| GET | `/api/v1/trading/history` | — | Get the last 50 trades (newest first). |
| GET | `/api/v1/trading/portfolio` | — | Get aggregated portfolio summary with P&L. |

## Order Execution Flow
1. Validate symbol exists via `market.ValidSymbol()`.
2. Fetch current price from the PriceEngine.
3. Execute order through `trading.ExecuteOrder()` — deducts balance, creates trade record, updates position.
4. Achievement checks are triggered asynchronously after each trade.

## Models
- **Trade:** `id`, `userId`, `symbol`, `side`, `quantity`, `price`, `total`, `createdAt`
- **Position:** `id`, `userId`, `symbol`, `quantity`, `avgEntryPrice`, `createdAt`, `updatedAt`

## Error Handling
| Status | Meaning |
|--------|---------|
| 400 | Invalid symbol or request body |
| 402 | Insufficient balance |
| 404 | Position not found |
| 500 | Internal execution error |
