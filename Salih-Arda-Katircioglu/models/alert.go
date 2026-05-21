package models

import "time"

// PriceAlert is owned and migrated by the Salih service.
type PriceAlert struct {
	ID          uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID      uint       `gorm:"index;not null" json:"userId"`
	Symbol      string     `gorm:"size:32;not null;index" json:"symbol"`
	TargetPrice float64    `gorm:"type:decimal(18,6);not null" json:"targetPrice"`
	Condition   string     `gorm:"size:16;not null" json:"condition"` // GREATER_THAN | LESS_THAN
	IsActive    bool       `gorm:"default:true" json:"isActive"`
	TriggeredAt *time.Time `json:"triggeredAt"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

func (PriceAlert) TableName() string { return "price_alerts" }

// ChatMessage is owned and migrated by the Salih service.
type ChatMessage struct {
	ID        uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint      `gorm:"index;not null" json:"userId"`
	Role      string    `gorm:"size:8;not null" json:"role"` // USER | AI
	Content   string    `gorm:"type:text;not null" json:"content"`
	CreatedAt time.Time `json:"createdAt"`
}

func (ChatMessage) TableName() string { return "chat_messages" }

// Order mirrors the table owned by the Cem service (read-only here).
type Order struct {
	ID          uint       `json:"id" gorm:"primaryKey"`
	UserID      uint       `json:"userId"`
	Symbol      string     `json:"symbol"`
	Side        string     `json:"side"`
	Type        string     `json:"type"`
	Status      string     `json:"status"`
	Quantity    float64    `json:"quantity"`
	TargetPrice *float64   `json:"targetPrice"`
	FilledPrice *float64   `json:"filledPrice"`
	CreatedAt   time.Time  `json:"createdAt"`
	FilledAt    *time.Time `json:"filledAt"`
	CancelledAt *time.Time `json:"cancelledAt"`
}

func (Order) TableName() string { return "orders" }

// WatchlistAsset mirrors Enes's watchlist_assets table — Salih only writes
// DELETE through it for the "remove asset from list" endpoint.
type WatchlistAsset struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	WatchlistID uint   `json:"watchlistId"`
	Symbol      string `json:"symbol"`
}

func (WatchlistAsset) TableName() string { return "watchlist_assets" }

// Watchlist mirrors Enes's watchlists table — read-only ownership check.
type Watchlist struct {
	ID     uint `json:"id" gorm:"primaryKey"`
	UserID uint `json:"userId"`
}

func (Watchlist) TableName() string { return "watchlists" }
