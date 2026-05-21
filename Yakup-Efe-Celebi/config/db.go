package config

import (
	"fmt"
	"log"
	"os"

	"bose-efe/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB opens the shared Postgres connection. Yakup owns and migrates
// only the market_assets table. Other tables (users, login_logs,
// chat_messages, …) are owned by other services.
func ConnectDB() {
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_URL bulunamadı")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("PostgreSQL bağlanılamadı: ", err)
	}
	fmt.Println("🚀 (efe) PostgreSQL bağlantısı kuruldu.")

	if err := db.AutoMigrate(&models.MarketAsset{}); err != nil {
		log.Fatal("AutoMigrate hatası: ", err)
	}
	fmt.Println("✅ (efe) market_assets tablosu migrate edildi.")
	DB = db
}
