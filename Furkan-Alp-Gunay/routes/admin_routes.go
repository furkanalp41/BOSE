package routes

import (
	"bose-backend/controllers"
	"bose-backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

// SetupAdminRoutes registers the /api/admin route group
// with authentication and admin authorization middlewares.
func SetupAdminRoutes(app *fiber.App) {
	admin := app.Group("/api/admin", middlewares.RequireAuth, middlewares.RequireAdmin)

	admin.Get("/logs", controllers.GetSystemLogs)
	admin.Delete("/users/:id", controllers.DeleteUser)
}
