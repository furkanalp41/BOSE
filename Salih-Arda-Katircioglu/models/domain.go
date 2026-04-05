package models

import (
	"time"
	"gorm.io/gorm"
)

// Borsa (Market) Nesnesi
type MarketItem struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Symbol    string         `gorm:"uniqueIndex" json:"symbol"` // Örn: AAPL, THYAO
	Price     float64        `json:"price"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// İzleme Listesi (Watchlist) Nesnesi
type Watchlist struct {
	ID     uint         `gorm:"primarykey" json:"id"`
	UserID uint         `json:"user_id"` // Hangi kullanıcıya ait olduğu
	Name   string       `json:"name"`
	Items  []MarketItem `gorm:"many2many:watchlist_items;" json:"items"`
}

// Alarm (Alert) Nesnesi
type Alert struct {
	ID           uint    `gorm:"primarykey" json:"id"`
	WatchlistID  uint    `json:"watchlist_id"`
	MarketItemID uint    `json:"market_item_id"`
	TargetPrice  float64 `json:"target_price"`
	Condition    string  `json:"condition"` // "ABOVE" (Üstüne çıkarsa) veya "BELOW" (Altına düşerse)
	IsActive     bool    `json:"is_active" gorm:"default:true"`
}