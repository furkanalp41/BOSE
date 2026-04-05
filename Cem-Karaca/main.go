package main

import (
	"log"
	"os"

	"cem-karaca-bose/config"
	"cem-karaca-bose/models"
	"cem-karaca-bose/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// .env dosyasını yükle
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️  .env dosyası bulunamadı, sistem env değişkenleri kullanılacak.")
	}

	// Veritabanına bağlan
	config.ConnectDB()

	// Tabloları otomatik oluştur
	config.DB.AutoMigrate(
		&models.User{},
		&models.MarketAsset{},
		&models.Order{},
		&models.Position{},
		&models.Announcement{},
	)

	// Fiber başlat
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New())

	// Route'ları bağla
	routes.SetupRoutes(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "BOSE API - Cem Karaca Servisi Çalışıyor 🚀",
			"version": "v1",
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("🚀 Cem Karaca servisi :%s portunda çalışıyor", port)
	log.Fatal(app.Listen(":" + port))
}
