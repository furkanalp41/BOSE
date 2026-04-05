package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/services/leaderboard"
	"github.com/uraniumz/bose/services/market"
)

// GetRankings handles GET /api/v1/leaderboard/rankings
func GetRankings(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		rankings := leaderboard.GetRankings(config.DB, engine)
		return c.JSON(fiber.Map{
			"status":   "ok",
			"rankings": rankings,
		})
	}
}

// GetUserRank handles GET /api/v1/leaderboard/user/:userId
func GetUserRank(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		userID, err := strconv.ParseUint(c.Params("userId"), 10, 64)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid userId")
		}

		entry := leaderboard.GetUserRank(config.DB, engine, uint(userID))
		if entry == nil {
			return fiber.NewError(fiber.StatusNotFound, "user not found in rankings")
		}

		return c.JSON(entry)
	}
}

// GetAchievements handles GET /api/v1/leaderboard/achievements
func GetAchievements(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	earned, all := leaderboard.GetUserAchievements(config.DB, claims.UserID)

	earnedMap := make(map[uint]bool)
	for _, e := range earned {
		earnedMap[e.AchievementID] = true
	}

	type achievementStatus struct {
		ID          uint   `json:"id"`
		Code        string `json:"code"`
		Name        string `json:"name"`
		Description string `json:"description"`
		Icon        string `json:"icon"`
		Earned      bool   `json:"earned"`
		EarnedAt    string `json:"earnedAt,omitempty"`
	}

	var result []achievementStatus
	for _, a := range all {
		status := achievementStatus{
			ID:          a.ID,
			Code:        a.Code,
			Name:        a.Name,
			Description: a.Description,
			Icon:        a.Icon,
			Earned:      earnedMap[a.ID],
		}
		for _, e := range earned {
			if e.AchievementID == a.ID {
				status.EarnedAt = e.EarnedAt.Format("2006-01-02")
				break
			}
		}
		result = append(result, status)
	}

	return c.JSON(result)
}
