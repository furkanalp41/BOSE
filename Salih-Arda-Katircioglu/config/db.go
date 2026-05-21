package config

import (
	"fmt"
	"log"
	"os"

	"bose-salih/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB opens the shared Postgres connection. Salih owns
// price_alerts and chat_messages.
func ConnectDB() {
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_URL bulunamadı")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("PostgreSQL bağlanılamadı: ", err)
	}
	fmt.Println("🚀 (salih) PostgreSQL bağlantısı kuruldu.")
	if err := db.AutoMigrate(&models.PriceAlert{}, &models.ChatMessage{}); err != nil {
		log.Fatal("AutoMigrate hatası: ", err)
	}
	fmt.Println("✅ (salih) price_alerts + chat_messages migrate edildi.")
	DB = db
}
