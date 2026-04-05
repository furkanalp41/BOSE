package controllers

import (
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/market"
)

// In-memory announcement store (sufficient for dev/staging)
var (
	announcements   []fiber.Map
	announcementsMu sync.Mutex
)

// AdminRequired is middleware that checks the user has admin role.
func AdminRequired(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)
	if claims.Role != "admin" {
		return fiber.NewError(fiber.StatusForbidden, "admin access required")
	}
	return c.Next()
}

// GetAdminLogs handles GET /api/v1/admin/logs
func GetAdminLogs(c *fiber.Ctx) error {
	var trades []models.Trade
	config.DB.Order("created_at desc").Limit(50).Find(&trades)

	var logs []fiber.Map
	for _, t := range trades {
		logs = append(logs, fiber.Map{
			"id":        t.ID,
			"action":    "TRADE_EXECUTED",
			"details":   fmt.Sprintf("User %d: %s %.4f %s @ $%.2f", t.UserID, t.Side, t.Quantity, t.Symbol, t.Price),
			"timestamp": t.CreatedAt,
		})
	}

	return c.JSON(fiber.Map{"data": logs})
}

// AdminDeleteUser handles DELETE /api/v1/admin/users/:id
func AdminDeleteUser(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}

	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}

	// Delete related records
	config.DB.Where("user_id = ?", id).Delete(&models.Trade{})
	config.DB.Where("user_id = ?", id).Delete(&models.Position{})
	config.DB.Where("user_id = ?", id).Delete(&models.Watchlist{})
	config.DB.Where("user_id = ?", id).Delete(&models.Alert{})
	config.DB.Where("user_id = ?", id).Delete(&models.UserAchievement{})
	config.DB.Delete(&user)

	return c.JSON(fiber.Map{"message": fmt.Sprintf("User %d deleted successfully", id)})
}

// AdminUpdateRole handles PUT /api/v1/admin/users/:id/role
func AdminUpdateRole(c *fiber.Ctx) error {
	id, err := c.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid user id")
	}

	var body struct {
		Role string `json:"role"`
	}
	if err := c.BodyParser(&body); err != nil || (body.Role != "user" && body.Role != "admin") {
		return fiber.NewError(fiber.StatusBadRequest, "role must be 'user' or 'admin'")
	}

	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}

	config.DB.Model(&user).Update("role", body.Role)

	return c.JSON(fiber.Map{"message": fmt.Sprintf("User %d role updated to %s", id, body.Role)})
}

// ── Admin Asset Management ─────────────────────────────────────────────────

// AdminGetAssets handles GET /api/v1/admin/market/assets
func AdminGetAssets(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		assets := market.BuildAssetCatalogue(engine)
		return c.JSON(fiber.Map{"data": assets})
	}
}

// AdminCreateAsset handles POST /api/v1/admin/market/assets
func AdminCreateAsset(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var body struct {
			Symbol     string  `json:"symbol"`
			Price      float64 `json:"price"`
			Drift      float64 `json:"drift"`
			Volatility float64 `json:"volatility"`
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}
		body.Symbol = strings.ToUpper(strings.TrimSpace(body.Symbol))
		if body.Symbol == "" || body.Price <= 0 {
			return fiber.NewError(fiber.StatusBadRequest, "symbol and a positive price are required")
		}
		if body.Volatility == 0 {
			body.Volatility = 0.0015
		}
		if !engine.AddSymbol(body.Symbol, body.Price, body.Drift, body.Volatility) {
			return fiber.NewError(fiber.StatusConflict, "symbol already exists")
		}
		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": fmt.Sprintf("asset %s created at $%.2f", body.Symbol, body.Price),
		})
	}
}

// AdminUpdateAsset handles PUT /api/v1/admin/market/assets/:symbol
func AdminUpdateAsset(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		symbol := strings.ToUpper(c.Params("symbol"))
		var body struct {
			Price      float64 `json:"price"`
			Drift      float64 `json:"drift"`
			Volatility float64 `json:"volatility"`
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}
		if !engine.UpdateSymbol(symbol, body.Price, body.Drift, body.Volatility) {
			return fiber.NewError(fiber.StatusNotFound, "symbol not found")
		}
		return c.JSON(fiber.Map{"message": fmt.Sprintf("asset %s updated", symbol)})
	}
}

// AdminDeleteAsset handles DELETE /api/v1/admin/market/assets/:symbol
func AdminDeleteAsset(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		symbol := strings.ToUpper(c.Params("symbol"))
		if !engine.RemoveSymbol(symbol) {
			return fiber.NewError(fiber.StatusNotFound, "symbol not found")
		}
		return c.JSON(fiber.Map{"message": fmt.Sprintf("asset %s removed", symbol)})
	}
}

// CreateAnnouncement handles POST /api/v1/admin/announcements
func CreateAnnouncement(c *fiber.Ctx) error {
	var body struct {
		Message string `json:"message"`
	}
	if err := c.BodyParser(&body); err != nil || body.Message == "" {
		return fiber.NewError(fiber.StatusBadRequest, "message is required")
	}

	entry := fiber.Map{
		"announcement": body.Message,
		"created_at":   time.Now(),
	}

	announcementsMu.Lock()
	announcements = append([]fiber.Map{entry}, announcements...)
	announcementsMu.Unlock()

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"data": entry})
}
