package models

import "time"

// Watchlist is owned and migrated by the Enes service.
type Watchlist struct {
	ID        uint             `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID    uint             `gorm:"index;not null" json:"userId"`
	Name      string           `gorm:"size:128;not null" json:"name"`
	Assets    []WatchlistAsset `gorm:"foreignKey:WatchlistID;constraint:OnDelete:CASCADE" json:"assets,omitempty"`
	CreatedAt time.Time        `json:"createdAt"`
	UpdatedAt time.Time        `json:"updatedAt"`
}

func (Watchlist) TableName() string { return "watchlists" }

// WatchlistAsset is owned and migrated by the Enes service.
type WatchlistAsset struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	WatchlistID uint      `gorm:"index;not null" json:"watchlistId"`
	Symbol      string    `gorm:"size:32;not null" json:"symbol"`
	CreatedAt   time.Time `json:"createdAt"`
}

func (WatchlistAsset) TableName() string { return "watchlist_assets" }
