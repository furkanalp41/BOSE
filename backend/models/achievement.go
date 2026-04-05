package models

import (
	"time"
)

// Achievement defines a badge that users can earn.
type Achievement struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Code        string `gorm:"uniqueIndex;not null" json:"code"`
	Name        string `gorm:"not null" json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

// UserAchievement tracks which achievements a user has earned.
type UserAchievement struct {
	ID            uint      `gorm:"primaryKey" json:"id"`
	UserID        uint      `gorm:"index;not null" json:"userId"`
	AchievementID uint      `gorm:"index;not null" json:"achievementId"`
	Achievement   Achievement `gorm:"foreignKey:AchievementID" json:"achievement"`
	EarnedAt      time.Time `json:"earnedAt"`
}

// ── Response DTOs ────────────────────────────────────────────────────────────

type LeaderboardEntry struct {
	Rank           int     `json:"rank"`
	UserID         uint    `json:"userId"`
	FullName       string  `json:"fullName"`
	TotalValue     float64 `json:"totalValue"`
	PnL            float64 `json:"pnl"`
	PnLPercent     float64 `json:"pnlPercent"`
	TradeCount     int64   `json:"tradeCount"`
}
