package leaderboard

import (
	"math"
	"sort"

	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/market"
	"gorm.io/gorm"
)

const initialBalance = 100_000.00

// GetRankings computes the leaderboard sorted by total portfolio value.
func GetRankings(db *gorm.DB, engine *market.PriceEngine) []models.LeaderboardEntry {
	var users []models.User
	db.Find(&users)

	prices := engine.CurrentPrices()

	entries := make([]models.LeaderboardEntry, 0, len(users))

	for _, u := range users {
		var positions []models.Position
		db.Where("user_id = ?", u.ID).Find(&positions)

		var inPositions float64
		for _, p := range positions {
			inPositions += prices[p.Symbol] * p.Quantity
		}

		totalValue := u.VirtualBalance + inPositions
		pnl := totalValue - initialBalance
		pnlPct := 0.0
		if initialBalance > 0 {
			pnlPct = (pnl / initialBalance) * 100
		}

		var tradeCount int64
		db.Model(&models.Trade{}).Where("user_id = ?", u.ID).Count(&tradeCount)

		entries = append(entries, models.LeaderboardEntry{
			UserID:     u.ID,
			FullName:   u.FullName,
			TotalValue: math.Round(totalValue*100) / 100,
			PnL:        math.Round(pnl*100) / 100,
			PnLPercent: math.Round(pnlPct*100) / 100,
			TradeCount: tradeCount,
		})
	}

	sort.Slice(entries, func(i, j int) bool {
		return entries[i].TotalValue > entries[j].TotalValue
	})

	for i := range entries {
		entries[i].Rank = i + 1
	}

	return entries
}

// GetUserRank returns a single user's leaderboard position.
func GetUserRank(db *gorm.DB, engine *market.PriceEngine, userID uint) *models.LeaderboardEntry {
	rankings := GetRankings(db, engine)
	for _, e := range rankings {
		if e.UserID == userID {
			return &e
		}
	}
	return nil
}

// GetUserAchievements returns all achievements for a user.
func GetUserAchievements(db *gorm.DB, userID uint) ([]models.UserAchievement, []models.Achievement) {
	var earned []models.UserAchievement
	db.Preload("Achievement").Where("user_id = ?", userID).Find(&earned)

	var all []models.Achievement
	db.Find(&all)

	return earned, all
}

// SeedAchievements creates the initial set of achievements if they don't exist.
func SeedAchievements(db *gorm.DB) {
	achievements := []models.Achievement{
		{Code: "first_trade", Name: "First Trade", Description: "Execute your first trade", Icon: "rocket"},
		{Code: "trader_10", Name: "Active Trader", Description: "Complete 10 trades", Icon: "chart"},
		{Code: "trader_50", Name: "Veteran Trader", Description: "Complete 50 trades", Icon: "trophy"},
		{Code: "trader_100", Name: "Trading Master", Description: "Complete 100 trades", Icon: "crown"},
		{Code: "profitable", Name: "In The Green", Description: "Achieve a positive P&L", Icon: "money"},
		{Code: "diversified", Name: "Diversified", Description: "Hold positions in 3+ assets", Icon: "pie"},
	}

	for _, a := range achievements {
		db.Where("code = ?", a.Code).FirstOrCreate(&a)
	}
}
