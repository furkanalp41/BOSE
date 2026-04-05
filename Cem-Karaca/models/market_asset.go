package models

import "time"

// MarketAsset: Borsada işlem gören bir varlık (coin veya hisse)
type MarketAsset struct {
	ID          uint      `gorm:"primaryKey;autoIncrement" json:"id"`
	Symbol      string    `gorm:"type:varchar(20);uniqueIndex;not null" json:"symbol"` // Örn: "BTC", "ETH"
	Name        string    `gorm:"type:varchar(100);not null" json:"name"`              // Örn: "Bitcoin"
	AssetType   string    `gorm:"type:varchar(20);not null" json:"asset_type"`         // "crypto" veya "stock"
	CurrentPrice float64  `gorm:"not null" json:"current_price"`                       // Güncel fiyat
	Change24h   float64   `json:"change_24h"`                                          // 24 saatlik değişim (%)
	Volume24h   float64   `json:"volume_24h"`                                          // 24 saatlik hacim
	MarketCap   float64   `json:"market_cap"`                                          // Piyasa değeri
	UpdatedAt   time.Time `json:"updated_at"`
}

func (MarketAsset) TableName() string {
	return "market_assets"
}
