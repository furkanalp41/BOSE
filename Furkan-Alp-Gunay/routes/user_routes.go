package routes

import (
	"bose-furkan/controllers"
	"bose-furkan/middlewares"

	"github.com/gofiber/fiber/v2"
)

// SetupUserRoutes registers /api/v1/users/* (JWT required).
func SetupUserRoutes(api fiber.Router) {
	users := api.Group("/users", middlewares.RequireAuth)
	users.Get("/:id", controllers.GetUserByID)
	users.Put("/:id", controllers.UpdateUser)
	users.Delete("/:id", controllers.DeleteUser)
	users.Post("/:id/ai-preferences", controllers.SaveAIPreferences)
}
