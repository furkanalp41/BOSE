package routes

import (
	"bose-backend/controllers"
	"bose-backend/middlewares"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App) {
	api := app.Group("/api")

	// Auth (Herkes erişebilir)
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	// Users (Sadece giriş yapmış - JWT sahibi kullanıcılar erişebilir)
	users := api.Group("/users", middlewares.Protected())
	users.Get("/me", controllers.GetProfile)
	users.Put("/me", controllers.UpdateProfile)
	users.Delete("/me", controllers.DeleteUser)
}
