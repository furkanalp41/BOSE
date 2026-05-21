package config

import (
	"fmt"
	"log"
	"os"

	"bose-cem/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB opens the shared Postgres connection. Cem owns and migrates
// only the orders table; users is referenced read/write but not migrated.
func ConnectDB() {
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_URL bulunamadı")
	}
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("PostgreSQL bağlanılamadı: ", err)
	}
	fmt.Println("🚀 (cem) PostgreSQL bağlantısı kuruldu.")
	if err := db.AutoMigrate(&models.Order{}); err != nil {
		log.Fatal("AutoMigrate hatası: ", err)
	}
	fmt.Println("✅ (cem) orders tablosu migrate edildi.")
	DB = db
}
