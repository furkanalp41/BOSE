package routes

import (
	"bose-backend/controllers"
	"bose-backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

// SetupUserRoutes registers the /api/users route group
// with JWT authentication middleware.
func SetupUserRoutes(app *fiber.App) {
	users := app.Group("/api/users", middlewares.RequireAuth)

	users.Get("/profile", controllers.GetProfile)
	users.Put("/profile", controllers.UpdateProfile)
	users.Delete("/profile", controllers.DeleteAccount)
	users.Put("/ai-preferences", controllers.SaveAIPreferences)
}
