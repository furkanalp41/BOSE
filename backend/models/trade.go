package models

import (
	"time"
)

// Trade records a single executed order (buy or sell).
type Trade struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index:idx_trades_user_created,priority:1;not null" json:"userId"`
	Symbol    string    `gorm:"index:idx_trades_symbol;not null" json:"symbol"`
	Side      string    `gorm:"type:varchar(4);not null" json:"side"` // BUY or SELL
	Quantity  float64   `gorm:"type:decimal(18,8);not null" json:"quantity"`
	Price     float64   `gorm:"type:decimal(18,2);not null" json:"price"`
	Total     float64   `gorm:"type:decimal(18,2);not null" json:"total"`
	CreatedAt time.Time `gorm:"index:idx_trades_user_created,priority:2" json:"createdAt"`
}

// Position tracks a user's current holding of an asset.
type Position struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `gorm:"index:idx_positions_user_symbol,priority:1;not null" json:"userId"`
	Symbol        string    `gorm:"index:idx_positions_user_symbol,priority:2;not null" json:"symbol"`
	Quantity      float64   `gorm:"type:decimal(18,8);not null" json:"quantity"`
	AvgEntryPrice float64   `gorm:"type:decimal(18,2);not null" json:"avgEntryPrice"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

// ── Request DTOs ─────────────────────────────────────────────────────────────

type OrderRequest struct {
	Symbol   string  `json:"symbol"   validate:"required"`
	Side     string  `json:"side"     validate:"required,oneof=BUY SELL"`
	Quantity float64 `json:"quantity" validate:"required,gt=0"`
}

// ── Response DTOs ────────────────────────────────────────────────────────────

type PortfolioResponse struct {
	Balance       float64          `json:"balance"`
	InPositions   float64          `json:"inPositions"`
	TotalValue    float64          `json:"totalValue"`
	PnL           float64          `json:"pnl"`
	PnLPercent    float64          `json:"pnlPercent"`
	Positions     []PositionDetail `json:"positions"`
}

type PositionDetail struct {
	Position
	CurrentPrice float64 `json:"currentPrice"`
	MarketValue  float64 `json:"marketValue"`
	PnL          float64 `json:"pnl"`
	PnLPercent   float64 `json:"pnlPercent"`
}
