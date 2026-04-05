# REST API Documentation — Arda

## Domain
**API Base URL:** https://bose-platform.onrender.com/api/v1

## Test Videosu
> [YouTube video linki buraya eklenecek]

## Responsibilities
Watchlist management, price alerts, and alert monitoring system.

## Endpoints

### Watchlist
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/v1/watchlist` | `{ "name": "My Watchlist" }` | Create a new watchlist. |
| GET | `/api/v1/watchlist` | — | List all watchlists for the authenticated user. |
| DELETE | `/api/v1/watchlist/:id` | — | Delete a watchlist and its items. |
| POST | `/api/v1/watchlist/:id/items` | `{ "symbol": "BTC" }` | Add an asset to a watchlist. |
| DELETE | `/api/v1/watchlist/:id/items/:itemId` | — | Remove an item from a watchlist. |

### Alerts
| Method | Path | Body | Description |
|--------|------|------|-------------|
| POST | `/api/v1/watchlist/alerts` | `{ "symbol": "BTC", "target_price": 70000, "condition": "ABOVE\|BELOW" }` | Create a price alert. |
| GET | `/api/v1/watchlist/alerts` | — | List all active alerts. |
| DELETE | `/api/v1/watchlist/alerts/:alertId` | — | Delete an alert. |
| GET | `/api/v1/watchlist/alerts/triggered` | — | Get alerts that have been triggered by price movements. |

## Alert Checker Daemon
A background goroutine (`services/alert/checker.go`) periodically compares current prices from the PriceEngine against active alerts. When a price crosses the target threshold, the alert is marked as triggered.

## Models
- **Watchlist:** `id`, `userId`, `name`, `items[]`, `createdAt`, `updatedAt`
- **WatchlistItem:** `id`, `watchlistId`, `symbol`, `createdAt`
- **Alert:** `id`, `userId`, `watchlistId`, `symbol`, `targetPrice`, `condition`, `isActive`, `createdAt`
