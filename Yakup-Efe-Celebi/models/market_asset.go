package models

import "time"

// MarketAsset is the canonical record of a tradable symbol (BIST stock or crypto pair).
// Owned (migrated) by the Yakup service.
type MarketAsset struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Symbol      string    `gorm:"uniqueIndex;size:32;not null" json:"symbol"`
	Name        string    `gorm:"size:128;not null" json:"name"`
	Type        string    `gorm:"size:16;not null" json:"type"` // BIST | CRYPTO
	Description string    `gorm:"type:text" json:"description"`
	IsActive    bool      `gorm:"default:true" json:"isActive"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func (MarketAsset) TableName() string { return "market_assets" }

// PriceTick is the live, in-memory price payload streamed to clients
// and published to RabbitMQ. Not persisted to Postgres.
type PriceTick struct {
	Symbol    string    `json:"symbol"`
	Price     float64   `json:"price"`
	Change24h float64   `json:"change24h"`
	Type      string    `json:"type"`
	TS        time.Time `json:"ts"`
}
