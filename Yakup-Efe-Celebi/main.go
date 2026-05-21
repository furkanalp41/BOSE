package main

import (
	"log"
	"os"

	"bose-efe/config"
	"bose-efe/messaging"
	"bose-efe/routes"
	"bose-efe/streamer"

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
	streamer.Seed()
	streamer.Start()

	app := fiber.New(fiber.Config{
		AppName: "BOSE Efe service",
	})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"service": "bose-efe",
			"status":  "ok",
			"version": "v1",
		})
	})

	routes.SetupRoutes(app)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8084"
	}
	log.Printf("🚀 bose-efe listening on :%s/api/v1", port)
	log.Fatal(app.Listen(":" + port))
}
