package controllers

import (
	"encoding/json"
	"io"
	"net/http/httptest"
	"strings"
	"testing"

	"bose-efe/config"
	"bose-efe/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestApp(t *testing.T) *fiber.App {
	t.Helper()
	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared&_pragma=foreign_keys(1)"), &gorm.Config{})
	if err != nil {
		t.Fatalf("sqlite open: %v", err)
	}
	if err := db.AutoMigrate(&models.MarketAsset{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	// Reset shared state between tests.
	db.Exec("DELETE FROM market_assets")
	config.DB = db

	app := fiber.New()
	api := app.Group("/api/v1")
	api.Get("/market/prices", GetMarketPrices)
	api.Post("/market/assets", CreateMarketAsset)
	api.Put("/market/assets/:id", UpdateMarketAsset)
	return app
}

func TestCreateMarketAssetRejectsBadType(t *testing.T) {
	app := setupTestApp(t)
	req := httptest.NewRequest("POST", "/api/v1/market/assets",
		strings.NewReader(`{"symbol":"X","name":"Y","type":"BOGUS"}`))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("req: %v", err)
	}
	if resp.StatusCode != fiber.StatusBadRequest {
		t.Fatalf("status = %d, want 400", resp.StatusCode)
	}
}

func TestCreateAndUpdateMarketAsset(t *testing.T) {
	app := setupTestApp(t)

	create := httptest.NewRequest("POST", "/api/v1/market/assets",
		strings.NewReader(`{"symbol":"thyao","name":"Türk Hava Yolları","type":"bist"}`))
	create.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(create, -1)
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("status = %d, want 201", resp.StatusCode)
	}
	body, _ := io.ReadAll(resp.Body)
	var out map[string]interface{}
	_ = json.Unmarshal(body, &out)
	asset := out["asset"].(map[string]interface{})
	if asset["symbol"] != "THYAO" {
		t.Fatalf("symbol uppercase failed: %v", asset["symbol"])
	}

	// Toggle off.
	update := httptest.NewRequest("PUT", "/api/v1/market/assets/1",
		strings.NewReader(`{"isActive":false}`))
	update.Header.Set("Content-Type", "application/json")
	respU, err := app.Test(update, -1)
	if err != nil {
		t.Fatalf("update: %v", err)
	}
	if respU.StatusCode != fiber.StatusOK {
		t.Fatalf("update status = %d, want 200", respU.StatusCode)
	}

	// Verify inactive assets are excluded from the no-redis price fallback.
	get := httptest.NewRequest("GET", "/api/v1/market/prices", nil)
	respG, err := app.Test(get, -1)
	if err != nil {
		t.Fatalf("get prices: %v", err)
	}
	bodyG, _ := io.ReadAll(respG.Body)
	var outG map[string]interface{}
	_ = json.Unmarshal(bodyG, &outG)
	if data, ok := outG["data"].([]interface{}); !ok || len(data) != 0 {
		t.Fatalf("inactive asset leaked into prices: %v", outG["data"])
	}
}
