package config

import (
	"fmt"
	"log"
	"os"

	"bose-furkan/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB opens the shared Postgres connection used by every BOSE service.
// Only this service runs the User + LoginLog AutoMigrate; other services
// reference these tables read/write but do not own the schema.
func ConnectDB() {
	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_URL bulunamadı. .env dosyasını kontrol edin.")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Veritabanına bağlanılamadı: ", err)
	}

	fmt.Println("🚀 PostgreSQL bağlantısı kuruldu.")

	if err := db.AutoMigrate(&models.User{}, &models.LoginLog{}); err != nil {
		log.Fatal("AutoMigrate hatası: ", err)
	}
	fmt.Println("✅ users + login_logs tabloları migrate edildi.")

	DB = db
}
