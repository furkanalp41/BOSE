package models

import "time"

// Order is the canonical record for both market and limit orders.
// Owned and migrated by the Cem service.
type Order struct {
	ID           uint       `gorm:"primaryKey;autoIncrement" json:"id"`
	UserID       uint       `gorm:"index;not null" json:"userId"`
	Symbol       string     `gorm:"size:32;not null;index" json:"symbol"`
	Side         string     `gorm:"size:8;not null" json:"side"`    // BUY | SELL
	Type         string     `gorm:"size:8;not null" json:"type"`    // MARKET | LIMIT
	Status       string     `gorm:"size:16;not null;index" json:"status"` // PENDING | COMPLETED | CANCELLED
	Quantity     float64    `gorm:"type:decimal(18,6);not null" json:"quantity"`
	TargetPrice  *float64   `gorm:"type:decimal(18,6)" json:"targetPrice"`
	FilledPrice  *float64   `gorm:"type:decimal(18,6)" json:"filledPrice"`
	BlockedFunds float64    `gorm:"type:decimal(18,6);default:0" json:"-"`
	CreatedAt    time.Time  `json:"createdAt"`
	FilledAt     *time.Time `json:"filledAt"`
	CancelledAt  *time.Time `json:"cancelledAt"`
}

func (Order) TableName() string { return "orders" }

// User mirrors the users table owned by the Furkan service.
// Defined here as a read/write reference so Cem can adjust balances
// during order execution; never AutoMigrated by Cem.
type User struct {
	ID             uint    `gorm:"primaryKey" json:"id"`
	VirtualBalance float64 `gorm:"column:virtual_balance" json:"virtualBalance"`
}

func (User) TableName() string { return "users" }
