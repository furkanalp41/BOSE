package models

import "time"

type OrderType string

const (
	OrderTypeBuy  OrderType = "BUY"
	OrderTypeSell OrderType = "SELL"
)

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusFilled    OrderStatus = "filled"
	OrderStatusCancelled OrderStatus = "cancelled"
)

type Order struct {
	ID         uint        `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID     uint        `gorm:"not null;index" json:"user_id"`
	Symbol     string      `gorm:"type:varchar(20);not null;index" json:"symbol"`
	OrderType  OrderType   `gorm:"type:varchar(10);not null" json:"order_type"`
	Quantity   float64     `gorm:"not null" json:"quantity"`
	Price      float64     `gorm:"not null" json:"price"`
	TotalPrice float64     `gorm:"not null" json:"total_price"`
	Status     OrderStatus `gorm:"type:varchar(20);default:'pending'" json:"status"`
	CreatedAt  time.Time   `json:"created_at"`
	UpdatedAt  time.Time   `json:"updated_at"`
}

func (Order) TableName() string {
	return "orders"
}

type CreateOrderInput struct {
	Symbol   string  `json:"symbol"`
	Side     string  `json:"side"` // "BUY" veya "SELL"
	Quantity float64 `json:"quantity"`
}
