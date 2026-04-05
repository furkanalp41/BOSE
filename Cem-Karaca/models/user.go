package models

import (
    "gorm.io/gorm"
)

type User struct {
    gorm.Model
    FullName       string  `json:"full_name"`
    Email          string  `json:"email" gorm:"unique"`
    Password       string  `json:"-"`
    VirtualBalance float64 `json:"virtual_balance" gorm:"default:100000"`
    Role           string  `json:"role" gorm:"default:'user'"`
    RiskLevel      string  `json:"risk_level" gorm:"default:'Medium'"`
}
