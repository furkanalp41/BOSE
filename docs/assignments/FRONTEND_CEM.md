# Frontend Documentation — Cem

## Domain
**Frontend URL:** https://bose-platform.onrender.com

## Test Videosu
> [YouTube video linki buraya eklenecek]

## Responsibilities
Trading interface: order form, position list, order summary, and trade history.

## Components

### OrderForm
- **File:** `frontend/src/components/trading/OrderForm.jsx`
- Buy/Sell toggle, symbol selector, quantity input.
- Calculates estimated total based on live price.
- Submits to `POST /api/v1/trading/order`.

### OrderSummary
- **File:** `frontend/src/components/trading/OrderSummary.jsx`
- Displays order confirmation details before and after execution.
- Shows symbol, side, quantity, price, and total cost.

### PositionsList
- **File:** `frontend/src/components/trading/PositionsList.jsx`
- Table of all open positions with current market value and unrealized P&L.
- Close button triggers `POST /api/v1/trading/positions/:id/close`.

### TradeHistory
- **File:** `frontend/src/components/trading/TradeHistory.jsx`
- Chronological list of executed trades.
- Displays side (BUY/SELL), symbol, quantity, price, total, and date.

## User Flow
1. User selects an asset from the market page or types a symbol.
2. Enters quantity and selects BUY or SELL.
3. OrderSummary shows estimated cost.
4. On confirmation, order is placed and positions list updates.
5. User can close positions from the PositionsList component.
