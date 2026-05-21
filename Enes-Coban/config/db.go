package config

import (
	"fmt"
	"log"
	"os"

	"bose-enes/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_URL bulunamadı")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("PostgreSQL bağlanılamadı: ", err)
	}
	fmt.Println("🚀 (enes) PostgreSQL bağlantısı kuruldu.")
	if err := db.AutoMigrate(&models.Watchlist{}, &models.WatchlistAsset{}); err != nil {
		log.Fatal("AutoMigrate hatası: ", err)
	}
	fmt.Println("✅ (enes) watchlists + watchlist_assets migrate edildi.")
	DB = db
}
