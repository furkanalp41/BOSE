package main

import (
	"log"
	"os"
	"bose-backend/config"
	"bose-backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// .env dosyasını oku
	err := godotenv.Load()
	if err != nil {
		log.Println("Uyarı: .env dosyası bulunamadı.")
	}

	// 1. Veritabanına Bağlan
	config.ConnectDB()

	// 2. Fiber Uygulamasını Başlat
	app := fiber.New()

	// 3. Admin Rotalarını Kaydet
	routes.SetupAdminRoutes(app)

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("BOSE API Çalışıyor! Veritabanı Bağlantısı Aktif.")
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Fatal(app.Listen(":" + port))
}
