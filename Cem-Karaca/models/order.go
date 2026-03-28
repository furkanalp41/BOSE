package models

import (
	"time"
)

// OrderType: Alım mı satım mı?
type OrderType string

const (
	OrderTypeBuy  OrderType = "buy"
	OrderTypeSell OrderType = "sell"
)

// OrderStatus: Emrin durumu
type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"   // Bekliyor
	OrderStatusFilled    OrderStatus = "filled"    // Gerçekleşti
	OrderStatusCancelled OrderStatus = "cancelled" // İptal edildi
)

// Order: Borsa alım/satım emri nesnesi
type Order struct {
	ID         uint        `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     uint        `gorm:"not null;index" json:"user_id"`               // Emri veren kullanıcı
	Symbol     string      `gorm:"type:varchar(20);not null;index" json:"symbol"` // Örn: "BTC", "ETH", "AAPL"
	OrderType  OrderType   `gorm:"type:varchar(10);not null" json:"order_type"`   // "buy" veya "sell"
	Quantity   float64     `gorm:"not null" json:"quantity"`                      // Kaç adet
	Price      float64     `gorm:"not null" json:"price"`                         // Birim fiyat
	TotalPrice float64     `gorm:"not null" json:"total_price"`                   // Quantity * Price
	Status     OrderStatus `gorm:"type:varchar(20);default:'pending'" json:"status"`
	CreatedAt  time.Time   `json:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at"`
}

// TableName: GORM'a tablo ismini söylüyoruz
func (Order) TableName() string {
	return "orders"
}

// CreateOrderInput: Kullanıcıdan gelen istek body'si
type CreateOrderInput struct {
	Symbol    string    `json:"symbol" validate:"required"`
	OrderType OrderType `json:"order_type" validate:"required,oneof=buy sell"`
	Quantity  float64   `json:"quantity" validate:"required,gt=0"`
}
