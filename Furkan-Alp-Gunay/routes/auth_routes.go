package routes

import (
	"bose-furkan/controllers"

	"github.com/gofiber/fiber/v2"
)

// SetupAuthRoutes registers /api/v1/auth/* (public).
func SetupAuthRoutes(api fiber.Router) {
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)
}
