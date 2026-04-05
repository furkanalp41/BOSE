package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/uraniumz/bose/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB() {
	godotenv.Load()

	dsn := os.Getenv("DB_URL")
	if dsn == "" {
		log.Fatal("DB_URL environment variable is not set")
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	if err := db.AutoMigrate(
		&models.User{},
		&models.Trade{},
		&models.Position{},
		&models.Achievement{},
		&models.UserAchievement{},
		&models.Watchlist{},
		&models.WatchlistItem{},
		&models.Alert{},
	); err != nil {
		log.Fatalf("Database migration failed: %v", err)
	}

	DB = db
	log.Println("Database connected and migrations applied successfully")
}
