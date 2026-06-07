package main

import (
	"log"
	"os"

	"bose-furkan/config"
	"bose-furkan/messaging"
	"bose-furkan/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	config.ConnectDB()
	config.ConnectRedis()

	messaging.Connect()            // user.registered publisher
	messaging.StartOrderConsumer() // order.filled -> order_logs audit trail

	app := fiber.New(fiber.Config{
		AppName: "BOSE Furkan service",
	})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"service": "bose-furkan",
			"status":  "ok",
			"version": "v1",
		})
	})

	api := app.Group("/api/v1")
	routes.SetupAuthRoutes(api)
	routes.SetupUserRoutes(api)
	routes.SetupAdminRoutes(api)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	dumpRoutes(app)
	log.Printf("🚀 bose-furkan listening on :%s/api/v1", port)
	log.Fatal(app.Listen(":" + port))
}

// dumpRoutes prints every mounted route at boot. Makes 404s trivially
// diagnosable — if a path isn't in this list, you're hitting a stale
// binary or the wrong service.
func dumpRoutes(app *fiber.App) {
	log.Println("=== Registered routes ===")
	for _, group := range app.Stack() {
		for _, r := range group {
			log.Printf("  %-6s %s", r.Method, r.Path)
		}
	}
	log.Println("=========================")
}
