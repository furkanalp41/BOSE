# Frontend Documentation — Yakup Efe

## Responsibilities
Market data display, real-time price streaming UI, leaderboard, and portfolio chart.

## Components

### Market UI

#### AssetCard
- **File:** `frontend/src/components/market/AssetCard.jsx`
- Displays a single asset with symbol, name, price, and 24h change.
- Color-coded (green/red) based on positive/negative price change.

#### AssetChart
- **File:** `frontend/src/components/market/AssetChart.jsx`
- Price chart for a selected asset showing recent price history.

#### DetailPanel
- **File:** `frontend/src/components/market/DetailPanel.jsx`
- Expanded view of a selected asset with market cap, volume, and category.
- Provides quick actions (Add to Watchlist, Trade).

#### StatusBar
- **File:** `frontend/src/components/market/StatusBar.jsx`
- Connection status indicator for WebSocket (connected/disconnected).

#### TickerTape
- **File:** `frontend/src/components/market/TickerTape.jsx`
- Scrolling ticker tape showing all asset prices in real-time.

### Leaderboard UI

#### RankTable
- **File:** `frontend/src/components/leaderboard/RankTable.jsx`
- Sorted table of users by portfolio value.
- Highlights current user's position.

#### BadgeDisplay
- **File:** `frontend/src/components/leaderboard/BadgeDisplay.jsx`
- Shows earned and available achievements with icons and descriptions.

### Dashboard

#### PortfolioChart
- **File:** `frontend/src/components/dashboard/PortfolioChart.jsx`
- Visual chart of portfolio allocation across asset categories.

## Real-Time Data Flow
1. On page load, `GET /api/v1/market/assets` fetches the initial asset list.
2. WebSocket connection is established to `/ws/market`.
3. Every 2 seconds, price ticks arrive and update all asset displays in real-time.
4. If the WebSocket disconnects, the StatusBar shows a warning and attempts reconnection.
