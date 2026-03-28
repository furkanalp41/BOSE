package config

import (
	"fmt"
	"log"
	"os"

	"bose-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_URL bulunamadı! Lütfen .env dosyanızı kontrol edin.")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Veritabanına bağlanılamadı! \n", err)
	}

	fmt.Println("🚀 Render PostgreSQL Veritabanına Başarıyla Bağlanıldı!")

	// Tabloları otomatik oluştur / güncelle
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatal("AutoMigrate başarısız oldu: ", err)
	}
	fmt.Println("✅ Veritabanı tabloları başarıyla migrate edildi.")

	DB = db
}
