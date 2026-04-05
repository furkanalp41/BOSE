package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/market"
	"github.com/uraniumz/bose/services/trading"
)

// PlaceOrder handles POST /api/v1/trading/order
func PlaceOrder(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)

		var req models.OrderRequest
		if err := c.BodyParser(&req); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}

		if req.Symbol == "" || req.Quantity <= 0 {
			return fiber.NewError(fiber.StatusBadRequest, "symbol and quantity > 0 are required")
		}
		if req.Side != "BUY" && req.Side != "SELL" {
			return fiber.NewError(fiber.StatusBadRequest, "side must be BUY or SELL")
		}
		if !market.ValidSymbol(engine, req.Symbol) {
			return fiber.NewError(fiber.StatusBadRequest, "unknown symbol: "+req.Symbol)
		}

		trade, err := trading.ExecuteOrder(config.DB, engine, claims.UserID, req)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}

		// Check for new achievements in the background
		go trading.CheckAndAwardAchievements(config.DB, claims.UserID)

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"message": "order executed",
			"trade":   trade,
		})
	}
}

// GetPositions handles GET /api/v1/trading/positions
func GetPositions(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)

		portfolio, err := trading.GetPortfolio(config.DB, engine, claims.UserID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		return c.JSON(portfolio.Positions)
	}
}

// ClosePosition handles POST /api/v1/trading/positions/:positionId/close
func ClosePosition(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)

		posID, err := c.ParamsInt("positionId")
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid positionId")
		}

		trade, err := trading.ClosePosition(config.DB, engine, uint(posID), claims.UserID)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, err.Error())
		}

		go trading.CheckAndAwardAchievements(config.DB, claims.UserID)

		return c.JSON(fiber.Map{
			"message": "position closed",
			"trade":   trade,
		})
	}
}

// GetTradeHistory handles GET /api/v1/trading/history
func GetTradeHistory(c *fiber.Ctx) error {
	claims := c.Locals("claims").(*middleware.Claims)

	var trades []models.Trade
	config.DB.Where("user_id = ?", claims.UserID).Order("created_at desc").Limit(50).Find(&trades)

	return c.JSON(trades)
}

// GetPortfolio handles GET /api/v1/trading/portfolio
func GetPortfolio(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)

		portfolio, err := trading.GetPortfolio(config.DB, engine, claims.UserID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		return c.JSON(portfolio)
	}
}
