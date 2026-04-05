package controllers

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/market"
)

// CreateWatchlist handles POST /api/v1/watchlist/
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

	// Reload with items
	config.DB.Preload("Items").First(&wl, wl.ID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": wl})
}

// GetWatchlists handles GET /api/v1/watchlist/
func GetWatchlists(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	var watchlists []models.Watchlist
	config.DB.Preload("Items").Where("user_id = ?", claims.UserID).Find(&watchlists)

	return c.JSON(fiber.Map{"data": watchlists})
}

// AddWatchlistItem returns a handler for POST /api/v1/watchlist/:id/items.
// It validates the symbol against the live market engine before inserting.
func AddWatchlistItem(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
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
			Symbol string `json:"symbol"`
		}
		if err := c.BodyParser(&body); err != nil || strings.TrimSpace(body.Symbol) == "" {
			return fiber.NewError(fiber.StatusBadRequest, "symbol is required")
		}
		symbol := strings.ToUpper(strings.TrimSpace(body.Symbol))

		if !market.ValidSymbol(engine, symbol) {
			return fiber.NewError(fiber.StatusNotFound, "symbol not found in market — check available assets via GET /market/assets")
		}

		// Check for duplicate
		var existing models.WatchlistItem
		if err := config.DB.Where("watchlist_id = ? AND symbol = ?", wlID, symbol).First(&existing).Error; err == nil {
			return fiber.NewError(fiber.StatusConflict, "item already exists in watchlist")
		}

		item := models.WatchlistItem{
			WatchlistID: uint(wlID),
			Symbol:      symbol,
		}
		if err := config.DB.Create(&item).Error; err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "failed to add item")
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": item})
	}
}

// DeleteWatchlist handles DELETE /api/v1/watchlist/:id
func DeleteWatchlist(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	wlID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid watchlist id")
	}

	var wl models.Watchlist
	if err := config.DB.Where("id = ? AND user_id = ?", wlID, claims.UserID).First(&wl).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "watchlist not found")
	}

	// Delete all items first, then the watchlist
	config.DB.Where("watchlist_id = ?", wlID).Delete(&models.WatchlistItem{})
	config.DB.Delete(&wl)

	return c.JSON(fiber.Map{"message": "watchlist deleted"})
}

// DeleteWatchlistItem handles DELETE /api/v1/watchlist/:id/items/:itemId
func DeleteWatchlistItem(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	wlID, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid watchlist id")
	}

	var wl models.Watchlist
	if err := config.DB.Where("id = ? AND user_id = ?", wlID, claims.UserID).First(&wl).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "watchlist not found")
	}

	itemID, err := c.ParamsInt("itemId")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid item id")
	}

	if err := config.DB.Where("id = ? AND watchlist_id = ?", itemID, wlID).Delete(&models.WatchlistItem{}).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to remove item")
	}

	return c.JSON(fiber.Map{"message": "item removed"})
}

// GetAlerts handles GET /api/v1/watchlist/alerts
func GetAlerts(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	var alerts []models.Alert
	config.DB.Where("user_id = ?", claims.UserID).Order("created_at desc").Find(&alerts)

	return c.JSON(fiber.Map{"data": alerts})
}
