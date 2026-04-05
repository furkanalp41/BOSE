package routes

import (
	"cem-karaca-bose/controllers"
	"cem-karaca-bose/middlewares"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	// ── MARKET (public) ──────────────────────────────────────────
	market := api.Group("/market")
	market.Get("/", controllers.GetAllAssets)
	market.Get("/type/:type", controllers.GetAssetsByType)
	market.Get("/:symbol", controllers.GetAssetBySymbol)

	// ── TRADING (JWT gerekli) ─────────────────────────────────────
	trading := api.Group("/trading", middlewares.RequireAuth)
	trading.Post("/order", controllers.PlaceOrder)            // Gereksinim 11
	trading.Get("/positions", controllers.GetOpenPositions)   // Gereksinim 12
	trading.Post("/positions/:positionId/close", controllers.ClosePosition) // Gereksinim 13
	trading.Get("/history", controllers.GetTradingHistory)    // Gereksinim 14
	trading.Get("/portfolio", controllers.GetPortfolio)       // Gereksinim 15

	// ── ADMIN (JWT + Admin yetkisi) ───────────────────────────────
	admin := api.Group("/admin", middlewares.RequireAuth, middlewares.RequireAdmin)
	admin.Post("/announcements", controllers.CreateAnnouncement) // Gereksinim 16
}
