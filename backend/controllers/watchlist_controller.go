package controllers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
)

// CreateWatchlist handles POST /api/v1/watchlist/
// Uses find-or-create so repeated calls with the same name are idempotent.
func CreateWatchlist(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	var body struct {
		Name string `json:"name"`
	}
	if err := c.BodyParser(&body); err != nil || strings.TrimSpace(body.Name) == "" {
		return fiber.NewError(fiber.StatusBadRequest, "name is required")
	}
	name := strings.TrimSpace(body.Name)

	var wl models.Watchlist
	result := config.DB.Where("user_id = ? AND name = ?", claims.UserID, name).First(&wl)
	if result.Error != nil {
		wl = models.Watchlist{UserID: claims.UserID, Name: name}
		if err := config.DB.Create(&wl).Error; err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "failed to create watchlist")
		}
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": wl})
}

// GetWatchlists handles GET /api/v1/watchlist/
func GetWatchlists(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	var watchlists []models.Watchlist
	config.DB.Preload("Items").Where("user_id = ?", claims.UserID).Find(&watchlists)

	return c.JSON(fiber.Map{"data": watchlists})
}

// AddWatchlistItem handles POST /api/v1/watchlist/:id/items
func AddWatchlistItem(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	wlID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid watchlist id")
	}

	var wl models.Watchlist
	if err := config.DB.Where("id = ? AND user_id = ?", wlID, claims.UserID).First(&wl).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "watchlist not found")
	}

	var body struct {
		MarketItemID uint `json:"market_item_id"`
	}
	if err := c.BodyParser(&body); err != nil || body.MarketItemID == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "market_item_id is required")
	}

	// Check for duplicate
	var existing models.WatchlistItem
	if err := config.DB.Where("watchlist_id = ? AND market_item_id = ?", wlID, body.MarketItemID).First(&existing).Error; err == nil {
		return fiber.NewError(fiber.StatusConflict, "item already exists in watchlist")
	}

	item := models.WatchlistItem{
		WatchlistID:  uint(wlID),
		MarketItemID: body.MarketItemID,
	}
	if err := config.DB.Create(&item).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to add item")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": item})
}
