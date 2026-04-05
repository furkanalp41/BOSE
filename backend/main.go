package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/routes"
	"github.com/uraniumz/bose/services/ai"
	alertsvc "github.com/uraniumz/bose/services/alert"
	"github.com/uraniumz/bose/services/leaderboard"
	"github.com/uraniumz/bose/services/market"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Initialize database
	config.ConnectDB()

	// Seed achievements
	leaderboard.SeedAchievements(config.DB)

	// Initialize market engine and WebSocket hub
	engine := market.NewPriceEngine()
	hub := market.NewHub()

	// Initialize AI provider chain (Gemini → Anthropic → rules engine fallback)
	providers := ai.NewProviderChain()

	// Initialize and start alert checker daemon
	alertChecker := alertsvc.NewAlertChecker(engine)
	alertCtx, alertCancel := context.WithCancel(context.Background())
	defer alertCancel()
	go alertChecker.Start(alertCtx)

	// Background ticker: advance prices every 2 seconds and broadcast
	go func() {
		ticker := time.NewTicker(2 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			ticks := engine.Tick()
			snap := market.MarketSnapshot{Ticks: ticks}
			data, err := json.Marshal(snap)
			if err != nil {
				log.Printf("marshal error: %v", err)
				continue
			}
			hub.Broadcast(data)
		}
	}()

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "BOSE Trading Platform API v1.0",
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Global Middleware
	app.Use(recover.New())
	app.Use(logger.New(logger.Config{
		Format: "[${time}] ${status} ${method} ${path} - ${latency}\n",
	}))
	// CORS: dev + production origins
	corsOrigins := "http://localhost:5173,http://localhost:3000,https://frontend-bose.vercel.app"
	if extra := os.Getenv("CORS_ORIGINS"); extra != "" {
		corsOrigins += "," + extra
	}
	app.Use(cors.New(cors.Config{
		AllowOrigins: corsOrigins,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// API Docs (Swagger-style)
	app.Get("/docs", func(c *fiber.Ctx) error {
		return c.SendFile("./static/swagger.html")
	})

	// Routes
	routes.SetupRoutes(app, engine, hub, providers, alertChecker)

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"service": "BOSE Trading API",
			"time":    time.Now().UnixMilli(),
		})
	})

	// ── Single-Domain: Serve React build ──────────────────────────────────
	// Serves the Vite production build. Checks two common locations:
	// - ../frontend/dist  (local development: running from backend/)
	// - ./frontend/dist   (Docker / production: running from /app)
	distPath := "../frontend/dist"
	if _, err := os.Stat(distPath); os.IsNotExist(err) {
		distPath = "./frontend/dist"
	}
	if info, err := os.Stat(distPath); err == nil && info.IsDir() {
		app.Static("/", distPath)
		app.Get("/*", func(c *fiber.Ctx) error {
			return c.SendFile(distPath + "/index.html")
		})
		log.Printf("Serving frontend from %s", distPath)
	} else {
		log.Println("No frontend build found — API-only mode")
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("BOSE API server starting on port %s", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
