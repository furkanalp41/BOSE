package models

import "time"

// Watchlist groups tracked assets for a user.
type Watchlist struct {
	ID        uint            `gorm:"primaryKey" json:"id"`
	UserID    uint            `gorm:"index;not null" json:"userId"`
	Name      string          `gorm:"not null" json:"name"`
	Items     []WatchlistItem `gorm:"foreignKey:WatchlistID" json:"items"`
	CreatedAt time.Time       `json:"createdAt"`
	UpdatedAt time.Time       `json:"updatedAt"`
}

// WatchlistItem links a market asset (by symbol) to a watchlist.
type WatchlistItem struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	WatchlistID uint      `gorm:"index:idx_wl_items_wl_symbol,priority:1;not null" json:"watchlistId"`
	Symbol      string    `gorm:"type:varchar(20);index:idx_wl_items_wl_symbol,priority:2;not null;default:'UNKNOWN'" json:"symbol"`
	CreatedAt   time.Time `json:"createdAt"`
}

// Alert tracks a price target for a market asset.
type Alert struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"index;not null" json:"userId"`
	WatchlistID uint      `json:"watchlist_id"`
	Symbol      string    `gorm:"type:varchar(20);not null;default:'UNKNOWN'" json:"symbol"`
	TargetPrice float64   `gorm:"type:decimal(18,2);not null" json:"target_price"`
	Condition   string    `gorm:"type:varchar(10);not null" json:"condition"`
	IsActive    bool      `gorm:"default:true" json:"is_active"`
	CreatedAt   time.Time `json:"createdAt"`
}
