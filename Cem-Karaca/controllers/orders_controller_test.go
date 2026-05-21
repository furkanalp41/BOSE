package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"bose-cem/config"
	"bose-cem/middlewares"
	"bose-cem/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func mintToken(userID uint) string {
	claims := jwt.MapClaims{
		"user_id": float64(userID),
		"email":   "u@bose.dev",
		"role":    "user",
		"exp":     time.Now().Add(time.Hour).Unix(),
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	s, _ := tok.SignedString([]byte("test-secret-bose"))
	return s
}

func setupOrdersApp(t *testing.T) (*fiber.App, *gorm.DB) {
	t.Helper()
	os.Setenv("JWT_SECRET", "test-secret-bose")
	db, err := gorm.Open(sqlite.Open("file:cem-test?mode=memory&cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("sqlite: %v", err)
	}
	if err := db.AutoMigrate(&models.Order{}, &models.User{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	db.Exec("DELETE FROM orders")
	db.Exec("DELETE FROM users")
	db.Create(&models.User{ID: 1, VirtualBalance: 100000})
	config.DB = db

	// Stub the Redis-backed price lookup with a deterministic value.
	PriceLookup = func(symbol string) (float64, error) { return 100, nil }

	app := fiber.New()
	api := app.Group("/api/v1", middlewares.RequireAuth)
	api.Post("/orders/market", CreateMarketOrder)
	api.Post("/orders/limit", CreateLimitOrder)
	api.Get("/orders/open", GetOpenOrders)
	api.Delete("/orders/:id", CancelOrder)
	return app, db
}

func TestMarketBuyHappyPath(t *testing.T) {
	app, db := setupOrdersApp(t)
	tok := mintToken(1)

	body, _ := json.Marshal(map[string]interface{}{
		"symbol": "THYAO", "side": "BUY", "quantity": 10.0,
	})
	req := httptest.NewRequest("POST", "/api/v1/orders/market", bytes.NewReader(body))
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

	var user models.User
	db.First(&user, 1)
	if user.VirtualBalance != 100000-1000 {
		t.Fatalf("balance after BUY = %.2f, want 99000", user.VirtualBalance)
	}
}

func TestMarketBuyInsufficientFunds(t *testing.T) {
	app, _ := setupOrdersApp(t)
	tok := mintToken(1)

	body, _ := json.Marshal(map[string]interface{}{
		"symbol": "BTCUSDT", "side": "BUY", "quantity": 9999.0,
	})
	req := httptest.NewRequest("POST", "/api/v1/orders/market", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("req: %v", err)
	}
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestLimitOrderBlockAndCancelRefund(t *testing.T) {
	app, db := setupOrdersApp(t)
	tok := mintToken(1)

	body, _ := json.Marshal(map[string]interface{}{
		"symbol": "ASELS", "side": "BUY", "quantity": 5.0, "targetPrice": 80.0,
	})
	req := httptest.NewRequest("POST", "/api/v1/orders/limit", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("limit create: %v", err)
	}
	if resp.StatusCode != fiber.StatusCreated {
		raw, _ := io.ReadAll(resp.Body)
		t.Fatalf("status=%d body=%s", resp.StatusCode, raw)
	}
	out, _ := io.ReadAll(resp.Body)
	var parsed map[string]interface{}
	_ = json.Unmarshal(out, &parsed)
	orderObj := parsed["order"].(map[string]interface{})
	orderID := uint64(orderObj["id"].(float64))

	var user models.User
	db.First(&user, 1)
	if user.VirtualBalance != 100000-400 {
		t.Fatalf("blocked balance wrong: %.2f", user.VirtualBalance)
	}

	cancel := httptest.NewRequest("DELETE", "/api/v1/orders/"+itoa(orderID), nil)
	cancel.Header.Set("Authorization", "Bearer "+tok)
	respC, err := app.Test(cancel, -1)
	if err != nil {
		t.Fatalf("cancel: %v", err)
	}
	if respC.StatusCode != fiber.StatusNoContent {
		t.Fatalf("cancel status = %d, want 204", respC.StatusCode)
	}
	db.First(&user, 1)
	if user.VirtualBalance != 100000 {
		t.Fatalf("refund failed, balance = %.2f", user.VirtualBalance)
	}
}

func itoa(n uint64) string {
	b := []byte{}
	if n == 0 {
		return "0"
	}
	for n > 0 {
		b = append([]byte{byte('0' + n%10)}, b...)
		n /= 10
	}
	return string(b)
}
