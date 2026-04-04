package middlewares

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// RequireAuth validates the JWT token from the Authorization header.
// Extracts user_id from claims and sets it as c.Locals("userID") (uint)
// so existing controllers continue to work without changes.
// Token format is compatible with Furkan's auth_controller.go token generation.
func RequireAuth(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkilendirme basligi eksik veya gecersiz",
		})
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	secret := os.Getenv("JWT_SECRET")
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Beklenmeyen imzalama yontemi")
		}
		return []byte(secret), nil
	})
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Gecersiz veya suresi dolmus token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Token claim'leri okunamadi",
		})
	}

	// Extract user_id and set as uint in Locals("userID")
	// to match the existing controller expectations
	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Kullanici ID'si token'da bulunamadi",
		})
	}

	c.Locals("userID", uint(userIDFloat))
	return c.Next()
}
