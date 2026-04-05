package main

import (
	"bose/models"
	"bose/routes"
	"bose/services"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres" // SQLite yerine PostgreSQL sürücüsünü ekledik
	"gorm.io/gorm"
)

func main() {
	// Render PostgreSQL bağlantı cümlen (DSN)
	dsn := "postgresql://boseadmin:GUM2GNy4CXJFULfgbGWjJ9dLJ5a4XeCH@dpg-d73rh2haae7s73b5pi3g-a.frankfurt-postgres.render.com/bosedb"

	// Veritabanına bağlan
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("PostgreSQL veritabanına bağlanılamadı: ", err)
	}

	log.Println("PostgreSQL veritabanına başarıyla bağlanıldı!")

	// Modelleri veritabanı tablolarına dönüştür (Auto Migrate)
	db.AutoMigrate(&models.MarketItem{}, &models.Watchlist{}, &models.Alert{})

	// Arka Plan Market Servisini Başlat
	services.StartMarketSimulation(db)

	// Gin Sunucusunu Başlat
	r := gin.Default()
	routes.SetupRoutes(r, db)

	r.Run(":8080") // Sunucu 8080 portunda çalışır
}
