package main

import (
	"log"
	"os"

	"bose-backend/config"
	"bose-backend/models"
	"bose-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// 1. Ortam Değişkenlerini Yükle
	godotenv.Load()

	// 2. Veritabanına Bağlan ve Tabloları Oluştur
	config.ConnectDB()
	config.DB.AutoMigrate(&models.User{}) // User tablosunu Render DB'sinde oluşturur

	// 3. Web Sunucusunu Başlat
	app := fiber.New()
	app.Use(logger.New())

	// 4. Rotaları Ayarla
	routes.SetupRoutes(app)

	// 5. Sunucuyu Dinlemeye Başla
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Bose Backend çalışıyor: http://localhost:%s", port)
	log.Fatal(app.Listen(":" + port))
}
