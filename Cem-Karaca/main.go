package main

import (
	"your_module_name/config"
	"your_module_name/models"
	"your_module_name/routes"
	"log"

	"github.com/gofiber/fiber/v2"
)

func main() {
	// 1. Veritabanına bağlan (Furkan'ın config/db.go'su)
	config.ConnectDB()

	// 2. Tabloları otomatik oluştur (geliştirme aşaması için)
	config.DB.AutoMigrate(&models.MarketAsset{}, &models.Order{})

	// 3. Fiber uygulamasını başlat
	app := fiber.New()

	// 4. Test için sahte auth middleware (Furkan'ın middleware'i gelince değiştirilecek)
	fakeAuth := func(c *fiber.Ctx) error {
		// Geçici: userID'yi 1 olarak set et
		c.Locals("userID", uint(1))
		return c.Next()
	}

	// 5. Route'ları kaydet
	routes.SetupOrderRoutes(app, fakeAuth)

	// 6. Sunucuyu başlat
	log.Println("🚀 Cem'in servisi :3000'de çalışıyor")
	log.Fatal(app.Listen(":3000"))
}
