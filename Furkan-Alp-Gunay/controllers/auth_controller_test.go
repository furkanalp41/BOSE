package controllers

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http/httptest"
	"os"
	"testing"

	"bose-furkan/config"
	"bose-furkan/middlewares"
	"bose-furkan/models"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupTestApp wires Furkan's routes against an in-memory SQLite DB.
func setupTestApp(t *testing.T) *fiber.App {
	t.Helper()
	os.Setenv("JWT_SECRET", "test-secret-bose")

	db, err := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	if err != nil {
		t.Fatalf("sqlite open: %v", err)
	}
	if err := db.AutoMigrate(&models.User{}, &models.LoginLog{}); err != nil {
		t.Fatalf("migrate: %v", err)
	}
	config.DB = db

	app := fiber.New()
	api := app.Group("/api/v1")
	auth := api.Group("/auth")
	auth.Post("/register", Register)
	auth.Post("/login", Login)
	users := api.Group("/users", middlewares.RequireAuth)
	users.Get("/:id", GetUserByID)
	return app
}

// TestPasswordHashRoundTrip — unit test for the bcrypt helper used by Login/Register.
func TestPasswordHashRoundTrip(t *testing.T) {
	hash, err := bcrypt.GenerateFromPassword([]byte("secret-123"), bcrypt.DefaultCost)
	if err != nil {
		t.Fatalf("hash: %v", err)
	}
	if string(hash) == "secret-123" {
		t.Fatalf("hash returned the plaintext")
	}
	if err := bcrypt.CompareHashAndPassword(hash, []byte("secret-123")); err != nil {
		t.Fatalf("expected match, got: %v", err)
	}
	if err := bcrypt.CompareHashAndPassword(hash, []byte("wrong-pass")); err == nil {
		t.Fatalf("expected mismatch, got nil")
	}
}

// TestRegisterAndLoginHappyPath — integration test for /auth/register + /auth/login.
func TestRegisterAndLoginHappyPath(t *testing.T) {
	app := setupTestApp(t)

	payload, _ := json.Marshal(map[string]string{
		"full_name": "Test User",
		"email":     "test@bose.dev",
		"password":  "secret-123",
	})
	req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req, -1)
	if err != nil {
		t.Fatalf("register: %v", err)
	}
	if resp.StatusCode != fiber.StatusCreated {
		t.Fatalf("register status = %d, want 201", resp.StatusCode)
	}

	body, _ := io.ReadAll(resp.Body)
	var out map[string]interface{}
	_ = json.Unmarshal(body, &out)
	if out["success"] != true {
		t.Fatalf("register response success != true: %v", out)
	}
	if tok, _ := out["token"].(string); tok == "" {
		t.Fatalf("register response missing token")
	}

	loginPayload, _ := json.Marshal(map[string]string{
		"email": "test@bose.dev", "password": "secret-123",
	})
	req2 := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(loginPayload))
	req2.Header.Set("Content-Type", "application/json")
	resp2, err := app.Test(req2, -1)
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	if resp2.StatusCode != fiber.StatusOK {
		t.Fatalf("login status = %d, want 200", resp2.StatusCode)
	}
}

// TestLoginRejectsWrongPassword — integration test.
func TestLoginRejectsWrongPassword(t *testing.T) {
	app := setupTestApp(t)

	payload, _ := json.Marshal(map[string]string{
		"full_name": "Bad User", "email": "wrong@bose.dev", "password": "correct-pass",
	})
	req := httptest.NewRequest("POST", "/api/v1/auth/register", bytes.NewReader(payload))
	req.Header.Set("Content-Type", "application/json")
	if _, err := app.Test(req, -1); err != nil {
		t.Fatalf("setup register: %v", err)
	}

	bad, _ := json.Marshal(map[string]string{
		"email": "wrong@bose.dev", "password": "WRONG",
	})
	req2 := httptest.NewRequest("POST", "/api/v1/auth/login", bytes.NewReader(bad))
	req2.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req2, -1)
	if err != nil {
		t.Fatalf("login: %v", err)
	}
	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Fatalf("login status = %d, want 401", resp.StatusCode)
	}
}
