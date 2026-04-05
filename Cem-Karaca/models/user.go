package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	FullName       string  `json:"full_name"`
	Email          string  `json:"email" gorm:"uniqueIndex;not null"`
	Password       string  `json:"-" gorm:"not null"`
	VirtualBalance float64 `json:"virtual_balance" gorm:"default:100000.0"`
	Role           string  `json:"role" gorm:"default:'user'"`
	RiskLevel      string  `json:"risk_level" gorm:"default:'Medium'"`
}
