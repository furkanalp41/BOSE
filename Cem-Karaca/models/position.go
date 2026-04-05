package models

import "time"

// Position: Kullanıcının elinde tuttuğu açık pozisyon
type Position struct {
	ID            uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID        uint      `gorm:"not null;index" json:"user_id"`
	Symbol        string    `gorm:"type:varchar(20);not null;index" json:"symbol"`
	Quantity      float64   `gorm:"not null" json:"quantity"`
	AvgEntryPrice float64   `gorm:"not null" json:"avg_entry_price"`
	IsOpen        bool      `gorm:"default:true" json:"is_open"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func (Position) TableName() string {
	return "positions"
}

// PositionWithPnL: Anlık hesaplama eklenmiş pozisyon (DB'ye yazılmaz)
type PositionWithPnL struct {
	Position
	CurrentPrice float64 `json:"current_price"`
	MarketValue  float64 `json:"market_value"`
	PnL          float64 `json:"pnl"`
	PnLPercent   float64 `json:"pnl_percent"`
}
