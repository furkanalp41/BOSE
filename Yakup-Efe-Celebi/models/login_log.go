package models

import "time"

// LoginLog mirrors the login_logs table owned and migrated by the Furkan service.
// Defined here read-only — Yakup never AutoMigrates this table.
type LoginLog struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	UserID     uint      `json:"userId"`
	IPAddress  string    `json:"ipAddress"`
	DeviceInfo string    `json:"deviceInfo"`
	LoginTime  time.Time `json:"loginTime"`
}

func (LoginLog) TableName() string { return "login_logs" }
