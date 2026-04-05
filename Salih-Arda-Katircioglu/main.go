package main

import (
	"log"
	"os"

	"bose/config"
	"bose/models"
	"bose/routes"
	"bose/services"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// .env dosyasini yukle
	if err := godotenv.Load(); err != nil {
		log.Println("Uyari: .env dosyasi bulunamadi.")
	}

	// Veritabanina baglan (DSN artik .env'den okunuyor)
	config.ConnectDB()

	// Modelleri veritabani tablolarina donustur (Auto Migrate)
	config.DB.AutoMigrate(&models.MarketItem{}, &models.Watchlist{}, &models.Alert{})

	// Arka Plan Market Servisini Baslat
	services.StartMarketSimulation(config.DB)

	// Gin Sunucusunu Baslat
	r := gin.Default()

	// CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	routes.SetupRoutes(r, config.DB)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("Arda'nin servisi :%s'de calisiyor", port)
	r.Run(":" + port)
}
