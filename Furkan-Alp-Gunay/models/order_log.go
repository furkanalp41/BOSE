package models

import "time"

// OrderLog is an audit trail of filled orders, written by the Furkan service's
// order.filled RabbitMQ consumer. OrderID is unique so a redelivered event
// does not create duplicate rows.
type OrderLog struct {
	ID        uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	OrderID   uint      `json:"order_id" gorm:"uniqueIndex;not null"`
	UserID    uint      `json:"user_id" gorm:"index;not null"`
	Symbol    string    `json:"symbol" gorm:"size:32"`
	Side      string    `json:"side" gorm:"size:8"`
	Quantity  float64   `json:"quantity" gorm:"type:decimal(18,6)"`
	Price     float64   `json:"price" gorm:"type:decimal(18,6)"`
	CreatedAt time.Time `json:"created_at" gorm:"autoCreateTime"`
}

func (OrderLog) TableName() string { return "order_logs" }
