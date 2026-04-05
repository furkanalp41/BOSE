package controllers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
)

// CreateAlert handles POST /api/v1/watchlist/alerts
func CreateAlert(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	var body struct {
		WatchlistID  uint    `json:"watchlist_id"`
		MarketItemID uint    `json:"market_item_id"`
		TargetPrice  float64 `json:"target_price"`
		Condition    string  `json:"condition"`
	}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	condition := strings.ToUpper(strings.TrimSpace(body.Condition))
	if condition != "ABOVE" && condition != "BELOW" {
		return fiber.NewError(fiber.StatusBadRequest, "condition must be ABOVE or BELOW")
	}
	if body.MarketItemID == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "market_item_id is required")
	}
	if body.TargetPrice <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "target_price must be positive")
	}

	alert := models.Alert{
		UserID:       claims.UserID,
		WatchlistID:  body.WatchlistID,
		MarketItemID: body.MarketItemID,
		TargetPrice:  body.TargetPrice,
		Condition:    condition,
		IsActive:     true,
	}

	if err := config.DB.Create(&alert).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to create alert")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": alert})
}
