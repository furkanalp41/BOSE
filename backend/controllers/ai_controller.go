package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/services/ai"
	"github.com/uraniumz/bose/services/market"
)

// GetAdvice handles POST /api/v1/ai/advice
func GetAdvice(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)

		advice, err := ai.GenerateAdvice(config.DB, engine, claims.UserID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		return c.JSON(advice)
	}
}
