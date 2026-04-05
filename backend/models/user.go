package models

import (
	"time"
)

// User is the core entity stored in the `users` table.
type User struct {
	ID uint `gorm:"primaryKey;autoIncrement" json:"id"`

	FullName string `gorm:"not null"           json:"fullName"`
	Email    string `gorm:"uniqueIndex;not null" json:"email"`
	Phone    string `gorm:"default:''"          json:"phone"`

	Password string `gorm:"not null" json:"-"`

	VirtualBalance float64 `gorm:"type:decimal(18,2);default:100000.00" json:"virtualBalance"`

	Role           string `gorm:"type:varchar(20);default:'user'" json:"role"`
	RiskLevel      string `gorm:"type:varchar(20);default:'MEDIUM'" json:"riskLevel"`
	InvestmentTerm string `gorm:"type:varchar(20);default:'MEDIUM_TERM'" json:"investmentTerm"`

	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// ── Request DTOs ─────────────────────────────────────────────────────────────

type RegisterRequest struct {
	FullName string `json:"fullName" validate:"required,min=2,max=100"`
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type UpdateProfileRequest struct {
	FullName string `json:"fullName" validate:"omitempty,min=2,max=100"`
	Phone    string `json:"phone"    validate:"omitempty,max=20"`
}

type AIPreferencesRequest struct {
	RiskLevel      string `json:"riskLevel"      validate:"required,oneof=LOW MEDIUM HIGH"`
	InvestmentTerm string `json:"investmentTerm" validate:"required,oneof=SHORT_TERM MEDIUM_TERM LONG_TERM"`
}

// ── Response DTOs ────────────────────────────────────────────────────────────

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
