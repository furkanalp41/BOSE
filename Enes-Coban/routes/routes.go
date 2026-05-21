package routes

import (
	"bose-enes/controllers"
	"bose-enes/middlewares"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api/v1", middlewares.RequireAuth)

	wl := api.Group("/watchlists")
	wl.Get("/", controllers.GetWatchlists)
	wl.Post("/", controllers.CreateWatchlist)
	wl.Put("/:id", controllers.UpdateWatchlist)
	wl.Delete("/:id", controllers.DeleteWatchlist)
	wl.Post("/:listId/assets", controllers.AddAsset)

	ai := api.Group("/ai")
	ai.Get("/report/status/:assetSymbol", controllers.GetStatusReport)
}
