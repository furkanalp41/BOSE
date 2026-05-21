package middlewares

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *fiber.Ctx) error {
	header := c.Get("Authorization")
	if header == "" || !strings.HasPrefix(header, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Auth header eksik"})
	}
	tokenString := strings.TrimPrefix(header, "Bearer ")

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Beklenmeyen imza")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Geçersiz token"})
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Claim okunamadı"})
	}
	c.Locals("user", claims)
	return c.Next()
}

func CurrentUserID(c *fiber.Ctx) (uint, error) {
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "Oturum yok")
	}
	switch v := claims["user_id"].(type) {
	case float64:
		return uint(v), nil
	case int:
		return uint(v), nil
	default:
		return 0, fiber.NewError(fiber.StatusUnauthorized, "user_id okunamadı")
	}
}
