package routes

import (
	"bose-backend/controllers"

	"github.com/gofiber/fiber/v2"
)

// SetupAuthRoutes registers the /api/auth route group
// for user registration and login (public endpoints).
func SetupAuthRoutes(app *fiber.App) {
	auth := app.Group("/api/auth")

	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)
}
