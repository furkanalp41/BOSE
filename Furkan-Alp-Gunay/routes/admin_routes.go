package routes

import (
	"bose-furkan/controllers"
	"bose-furkan/middlewares"

	"github.com/gofiber/fiber/v2"
)

// SetupAdminRoutes registers /api/v1/admin/* (admin role required).
func SetupAdminRoutes(api fiber.Router) {
	admin := api.Group("/admin", middlewares.RequireAuth, middlewares.RequireAdmin)
	admin.Get("/logs", controllers.GetSystemLogs)
	admin.Delete("/users/:id", controllers.AdminDeleteUser)
	admin.Put("/users/:id/role", controllers.UpdateUserRole)
	admin.Post("/announcements", controllers.CreateSystemAlert)
}
