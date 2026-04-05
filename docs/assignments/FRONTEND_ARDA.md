# Frontend Documentation — Arda

## Domain
**Frontend URL:** https://bose-platform.onrender.com

## Test Videosu
> [YouTube video linki buraya eklenecek]

## Responsibilities
Watchlist UI, alert management, and watchlist analysis page.

## Pages

### WatchlistAnalysis (`/dashboard` — Watchlist tab)
- **File:** `frontend/src/pages/WatchlistAnalysis.jsx`
- Sends watchlist data to AI analysis endpoint.
- Displays per-asset signals (AL/SAT/TUT/IZLE), confidence scores, and target prices.
- Shows overall summary and top pick recommendation.

## Components

### WatchlistManager
- **File:** `frontend/src/components/watchlist/WatchlistManager.jsx`
- Create, view, and delete watchlists.
- Add/remove symbols to/from watchlists.
- Displays live prices next to each tracked asset.

### AlertsManager
- **File:** `frontend/src/components/watchlist/AlertsManager.jsx`
- Create price alerts with target price and condition (ABOVE/BELOW).
- View active alerts and their status.
- Delete alerts. Shows triggered alerts with notification styling.

## User Flow
1. User creates a watchlist (e.g., "Crypto Favorites").
2. Adds symbols like BTC, ETH, SOL.
3. Sets price alerts (e.g., "Alert me when BTC goes ABOVE $70,000").
4. Views triggered alerts in the alerts panel.
5. Can send entire watchlist to AI for analysis.
