package main

import (
	"log"
	"os"

	"bose-cem/config"
	"bose-cem/messaging"
	"bose-cem/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	config.ConnectDB()
	config.ConnectRedis()
	messaging.Connect()

	app := fiber.New(fiber.Config{AppName: "BOSE Cem service"})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"service": "bose-cem", "status": "ok", "version": "v1"})
	})

	routes.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	log.Printf("🚀 bose-cem listening on :%s/api/v1", port)
	log.Fatal(app.Listen(":" + port))
}
