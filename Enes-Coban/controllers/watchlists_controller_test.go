package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"os"
	"testing"
	"time"

	"bose-enes/config"
	"bose-enes/middlewares"
	"bose-enes/models"

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

func setupWatchlistApp(t *testing.T) *fiber.App {
	t.Helper()
	os.Setenv("JWT_SECRET", "test-secret-bose")
	db, err := gorm.Open(sqlite.Open("file:enes-test?mode=memory&cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("sqlite: %v", err)
	}
	if err := db.AutoMigrate(&models.Watchlist{}, &models.WatchlistAsset{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	db.Exec("DELETE FROM watchlist_assets")
	db.Exec("DELETE FROM watchlists")
	config.DB = db

	app := fiber.New()
	api := app.Group("/api/v1", middlewares.RequireAuth)
	api.Post("/watchlists", CreateWatchlist)
	api.Get("/watchlists", GetWatchlists)
	api.Put("/watchlists/:id", UpdateWatchlist)
	api.Delete("/watchlists/:id", DeleteWatchlist)
	api.Post("/watchlists/:listId/assets", AddAsset)
	api.Get("/ai/report/status/:assetSymbol", GetStatusReport)
	return app
}

func TestCreateRenameDeleteWatchlist(t *testing.T) {
	app := setupWatchlistApp(t)
	tok := mintToken(1)

	body, _ := json.Marshal(map[string]string{"name": "Kriptolarım"})
	req := httptest.NewRequest("POST", "/api/v1/watchlists", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+tok)
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("create: %v", err)
	}
	if resp.StatusCode != fiber.StatusCreated {
		raw, _ := io.ReadAll(resp.Body)
		t.Fatalf("status=%d body=%s", resp.StatusCode, raw)
	}
	raw, _ := io.ReadAll(resp.Body)
	var out map[string]interface{}
	_ = json.Unmarshal(raw, &out)
	id := uint64(out["watchlist"].(map[string]interface{})["id"].(float64))

	// Rename.
	rename, _ := json.Marshal(map[string]string{"name": "BIST Favorilerim"})
	reqU := httptest.NewRequest("PUT", "/api/v1/watchlists/"+itoa(id), bytes.NewReader(rename))
	reqU.Header.Set("Content-Type", "application/json")
	reqU.Header.Set("Authorization", "Bearer "+tok)
	respU, err := app.Test(reqU, -1)
	if err != nil {
		t.Fatalf("rename: %v", err)
	}
	if respU.StatusCode != fiber.StatusOK {
		t.Fatalf("rename status=%d", respU.StatusCode)
	}

	// Add asset.
	add, _ := json.Marshal(map[string]string{"symbol": "thyao"})
	reqA := httptest.NewRequest("POST", "/api/v1/watchlists/"+itoa(id)+"/assets", bytes.NewReader(add))
	reqA.Header.Set("Content-Type", "application/json")
	reqA.Header.Set("Authorization", "Bearer "+tok)
	respA, err := app.Test(reqA, -1)
	if err != nil {
		t.Fatalf("add asset: %v", err)
	}
	if respA.StatusCode != fiber.StatusCreated {
		raw, _ := io.ReadAll(respA.Body)
		t.Fatalf("status=%d body=%s", respA.StatusCode, raw)
	}

	// Delete.
	reqD := httptest.NewRequest("DELETE", "/api/v1/watchlists/"+itoa(id), nil)
	reqD.Header.Set("Authorization", "Bearer "+tok)
	respD, err := app.Test(reqD, -1)
	if err != nil {
		t.Fatalf("delete: %v", err)
	}
	if respD.StatusCode != fiber.StatusNoContent {
		t.Fatalf("delete status=%d", respD.StatusCode)
	}
}

func TestAIStatusReportIsDeterministic(t *testing.T) {
	app := setupWatchlistApp(t)
	tok := mintToken(1)

	reqA := httptest.NewRequest("GET", "/api/v1/ai/report/status/THYAO", nil)
	reqA.Header.Set("Authorization", "Bearer "+tok)
	respA, err := app.Test(reqA, -1)
	if err != nil {
		t.Fatalf("ai: %v", err)
	}
	rawA, _ := io.ReadAll(respA.Body)
	var outA map[string]interface{}
	_ = json.Unmarshal(rawA, &outA)
	recA := outA["recommendation"].(string)

	reqB := httptest.NewRequest("GET", "/api/v1/ai/report/status/THYAO", nil)
	reqB.Header.Set("Authorization", "Bearer "+tok)
	respB, _ := app.Test(reqB, -1)
	rawB, _ := io.ReadAll(respB.Body)
	var outB map[string]interface{}
	_ = json.Unmarshal(rawB, &outB)
	if recA != outB["recommendation"].(string) {
		t.Fatalf("recommendations not deterministic: %s vs %s", recA, outB["recommendation"])
	}
}

func itoa(n uint64) string {
	if n == 0 {
		return "0"
	}
	out := []byte{}
	for n > 0 {
		out = append([]byte{byte('0' + n%10)}, out...)
		n /= 10
	}
	return string(out)
}
