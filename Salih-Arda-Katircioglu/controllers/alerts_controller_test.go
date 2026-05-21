package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"bose-salih/config"
	"bose-salih/middlewares"
	"bose-salih/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func mintToken(userID uint) string {
	claims := jwt.MapClaims{
		"user_id": float64(userID),
		"role":    "user",
		"exp":     time.Now().Add(time.Hour).Unix(),
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	s, _ := tok.SignedString([]byte("test-secret-bose"))
	return s
}

func setupAlertsApp(t *testing.T) *fiber.App {
	t.Helper()
	os.Setenv("JWT_SECRET", "test-secret-bose")
	db, err := gorm.Open(sqlite.Open("file:salih-test?mode=memory&cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("sqlite: %v", err)
	}
	if err := db.AutoMigrate(&models.PriceAlert{}, &models.ChatMessage{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	db.Exec("DELETE FROM price_alerts")
	db.Exec("DELETE FROM chat_messages")
	config.DB = db

	app := fiber.New()
	api := app.Group("/api/v1", middlewares.RequireAuth)
	api.Post("/alerts", CreateAlert)
	api.Get("/alerts", ListAlerts)
	api.Delete("/alerts/:id", DeleteAlert)
	api.Post("/ai/chat", SendChatMessage)
	return app
}

func TestCreateAlertHappyPath(t *testing.T) {
	app := setupAlertsApp(t)
	tok := mintToken(1)
	body, _ := json.Marshal(map[string]interface{}{
		"symbol": "BTCUSDT", "targetPrice": 70000, "condition": "GREATER_THAN",
	})
	req := httptest.NewRequest("POST", "/api/v1/alerts", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("req: %v", err)
	}
	if resp.StatusCode != fiber.StatusCreated {
		raw, _ := io.ReadAll(resp.Body)
		t.Fatalf("status=%d body=%s", resp.StatusCode, raw)
	}
}

func TestCreateAlertRejectsBadCondition(t *testing.T) {
	app := setupAlertsApp(t)
	tok := mintToken(1)
	body, _ := json.Marshal(map[string]interface{}{
		"symbol": "ETH", "targetPrice": 100, "condition": "NOPE",
	})
	req := httptest.NewRequest("POST", "/api/v1/alerts", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("req: %v", err)
	}
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status=%d, want 400", resp.StatusCode)
	}
}

func TestChatStoresPair(t *testing.T) {
	app := setupAlertsApp(t)
	tok := mintToken(1)
	body, _ := json.Marshal(map[string]string{"message": "BTC ne durumda?"})
	req := httptest.NewRequest("POST", "/api/v1/ai/chat", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("req: %v", err)
	}
	if resp.StatusCode != fiber.StatusOK {
		raw, _ := io.ReadAll(resp.Body)
		t.Fatalf("status=%d body=%s", resp.StatusCode, raw)
	}
	var count int64
	config.DB.Model(&models.ChatMessage{}).Where("user_id = ?", 1).Count(&count)
	if count != 2 {
		t.Fatalf("expected 2 messages (USER+AI), got %d", count)
	}
}
