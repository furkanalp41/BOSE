package routes

import (
	"bose-salih/controllers"
	"bose-salih/middlewares"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1", middlewares.RequireAuth)

	alerts := api.Group("/alerts")
	alerts.Get("/", controllers.ListAlerts)
	alerts.Post("/", controllers.CreateAlert)
	alerts.Put("/:id", controllers.UpdateAlert)
	alerts.Delete("/:id", controllers.DeleteAlert)

	orders := api.Group("/orders")
	orders.Get("/history", controllers.GetOrderHistory)

	wl := api.Group("/watchlists/:listId/assets")
	wl.Delete("/:assetSymbol", controllers.RemoveAssetFromWatchlist)

	chat := api.Group("/ai")
	chat.Post("/chat", controllers.SendChatMessage)
	chat.Get("/chat", controllers.GetChatHistory)
}
