package models

import "time"

type LoginLog struct {
	ID         uint      `json:"id" gorm:"primaryKey;autoIncrement"`
	UserID     uint      `json:"user_id" gorm:"index;not null"`
	IPAddress  string    `json:"ip_address" gorm:"size:64"`
	DeviceInfo string    `json:"device_info" gorm:"size:255"`
	LoginTime  time.Time `json:"login_time" gorm:"autoCreateTime"`
}

func (LoginLog) TableName() string { return "login_logs" }
