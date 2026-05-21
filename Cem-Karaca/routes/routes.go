package routes

import (
	"bose-cem/controllers"
	"bose-cem/middlewares"

	"github.com/gofiber/fiber/v2"
)

// SetupRoutes wires every Cem-owned endpoint under /api/v1.
func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1", middlewares.RequireAuth)

	orders := api.Group("/orders")
	orders.Post("/market", controllers.CreateMarketOrder)
	orders.Post("/limit", controllers.CreateLimitOrder)
	orders.Get("/open", controllers.GetOpenOrders)
	orders.Put("/:id", controllers.UpdateLimitOrder)
	orders.Delete("/:id", controllers.CancelOrder)

	ai := api.Group("/ai")
	ai.Get("/report/portfolio/:userId", controllers.GetPortfolioReport)
}
