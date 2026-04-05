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

	// Drop stale columns left over from previous schema.
	// GORM AutoMigrate never removes columns, so we do it explicitly.
	db.Exec("ALTER TABLE watchlist_items DROP COLUMN IF EXISTS market_item_id")
	db.Exec("ALTER TABLE alerts DROP COLUMN IF EXISTS market_item_id")

	// Backfill NULL symbols so the NOT NULL constraint can be applied by AutoMigrate.
	db.Exec("UPDATE watchlist_items SET symbol = 'UNKNOWN' WHERE symbol IS NULL OR symbol = ''")
	db.Exec("UPDATE alerts SET symbol = 'UNKNOWN' WHERE symbol IS NULL OR symbol = ''")

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
