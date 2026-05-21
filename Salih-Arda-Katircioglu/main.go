package main

import (
	"log"
	"os"

	"bose-salih/config"
	"bose-salih/messaging"
	"bose-salih/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	config.ConnectDB()
	config.ConnectRedis()
	messaging.Start()

	app := fiber.New(fiber.Config{AppName: "BOSE Salih service"})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"service": "bose-salih", "status": "ok", "version": "v1"})
	})

	routes.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}
	log.Printf("🚀 bose-salih listening on :%s/api/v1", port)
	log.Fatal(app.Listen(":" + port))
}
