package main

import (
	"log"
	"your_module_name/config"
	"your_module_name/models"
	"your_module_name/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// 0. .env dosyasını yükle
	if err := godotenv.Load(); err != nil {
		log.Fatal(".env dosyası yüklenemedi: ", err)
	}

	// 1. Veritabanına bağlan
	config.ConnectDB()

	// 2. Tabloları otomatik oluştur
	config.DB.AutoMigrate(&models.MarketAsset{}, &models.Order{})

	// 3. Fiber uygulamasını başlat
	app := fiber.New()

	// 4. Test için sahte auth middleware
	fakeAuth := func(c *fiber.Ctx) error {
		c.Locals("userID", uint(1))
		return c.Next()
	}

	// 5. Route'ları kaydet
	routes.SetupOrderRoutes(app, fakeAuth)

	// 6. Sunucuyu başlat
	log.Println("🚀 Cem'in servisi :3000'de çalışıyor")
	log.Fatal(app.Listen(":3000"))
}
