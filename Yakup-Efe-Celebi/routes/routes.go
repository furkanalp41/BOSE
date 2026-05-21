package routes

import (
	"bose-efe/controllers"
	"bose-efe/middlewares"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

// SetupRoutes wires every endpoint owned by the Yakup service under /api/v1.
func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1")

	// Market — prices are public; mutations require admin.
	market := api.Group("/market")
	market.Get("/prices", controllers.GetMarketPrices)
	market.Post("/assets", middlewares.RequireAuth, middlewares.RequireAdmin, controllers.CreateMarketAsset)
	market.Put("/assets/:id", middlewares.RequireAuth, middlewares.RequireAdmin, controllers.UpdateMarketAsset)

	// WebSocket — single stream endpoint, no auth gate (read-only public ticks).
	market.Use("/stream", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	market.Get("/stream", websocket.New(controllers.HandleMarketStream))

	// Admin health probe — exposed publicly so dashboards can poll it.
	api.Get("/admin/health", controllers.GetSystemHealth)

	// User login logs — JWT required, owner-only.
	api.Get("/users/:id/logs", middlewares.RequireAuth, controllers.GetUserLogs)

	// AI history purge — JWT required, current user only.
	api.Delete("/ai/history", middlewares.RequireAuth, controllers.ClearAIHistory)
}
