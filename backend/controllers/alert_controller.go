package controllers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
	alertsvc "github.com/uraniumz/bose/services/alert"
)

// CreateAlert handles POST /api/v1/watchlist/alerts
func CreateAlert(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	var body struct {
		WatchlistID uint    `json:"watchlist_id"`
		Symbol      string  `json:"symbol"`
		TargetPrice float64 `json:"target_price"`
		Condition   string  `json:"condition"`
	}
	if err := c.BodyParser(&body); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	condition := strings.ToUpper(strings.TrimSpace(body.Condition))
	if condition != "ABOVE" && condition != "BELOW" {
		return fiber.NewError(fiber.StatusBadRequest, "condition must be ABOVE or BELOW")
	}
	symbol := strings.ToUpper(strings.TrimSpace(body.Symbol))
	if symbol == "" {
		return fiber.NewError(fiber.StatusBadRequest, "symbol is required")
	}
	if body.TargetPrice <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "target_price must be positive")
	}

	alert := models.Alert{
		UserID:      claims.UserID,
		WatchlistID: body.WatchlistID,
		Symbol:      symbol,
		TargetPrice: body.TargetPrice,
		Condition:   condition,
		IsActive:    true,
	}

	if err := config.DB.Create(&alert).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to create alert")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": alert})
}

// DeleteAlert handles DELETE /api/v1/watchlist/alerts/:alertId
func DeleteAlert(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	alertID, err := c.ParamsInt("alertId")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid alert id")
	}

	result := config.DB.Where("id = ? AND user_id = ?", alertID, claims.UserID).Delete(&models.Alert{})
	if result.RowsAffected == 0 {
		return fiber.NewError(fiber.StatusNotFound, "alert not found")
	}

	return c.JSON(fiber.Map{"message": "alert deleted"})
}

// GetTriggeredAlerts handles GET /api/v1/watchlist/alerts/triggered
func GetTriggeredAlerts(checker *alertsvc.AlertChecker) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)
		triggered := checker.GetTriggered(claims.UserID)

		if triggered == nil {
			triggered = []alertsvc.TriggeredAlert{}
		}

		return c.JSON(fiber.Map{"data": triggered})
	}
}
