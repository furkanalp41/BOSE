package main

import (
	"log"
	"os"

	"cem-backend/config"
	"cem-backend/middlewares"
	"cem-backend/models"
	"cem-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// 0. .env dosyasini yukle
	if err := godotenv.Load(); err != nil {
		log.Println("Uyari: .env dosyasi bulunamadi.")
	}

	// 1. Veritabanina baglan
	config.ConnectDB()

	// 2. Tablolari otomatik olustur
	config.DB.AutoMigrate(&models.MarketAsset{}, &models.Order{})

	// 3. Fiber uygulamasini baslat
	app := fiber.New()

	// 4. CORS Middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// 5. Route'lari kaydet (gercek JWT auth middleware ile)
	routes.SetupOrderRoutes(app, middlewares.RequireAuth)

	// 6. Sunucuyu baslat
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Printf("Cem'in servisi :%s'de calisiyor", port)
	log.Fatal(app.Listen(":" + port))
}
