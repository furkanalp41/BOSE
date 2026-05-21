package middlewares

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// RequireAuth parses the JWT issued by the Furkan auth service.
// JWT_SECRET must be identical across every BOSE service.
func RequireAuth(c *fiber.Ctx) error {
	header := c.Get("Authorization")
	if header == "" || !strings.HasPrefix(header, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkilendirme başlığı eksik",
		})
	}
	tokenString := strings.TrimPrefix(header, "Bearer ")

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Beklenmeyen imza yöntemi")
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Geçersiz veya süresi dolmuş token",
		})
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Token claim'leri okunamadı",
		})
	}
	c.Locals("user", claims)
	return c.Next()
}

func RequireAdmin(c *fiber.Ctx) error {
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Kullanıcı bilgileri bulunamadı",
		})
	}
	if role, _ := claims["role"].(string); role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Admin yetkisi gereklidir",
		})
	}
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
	case int64:
		return uint(v), nil
	default:
		return 0, fiber.NewError(fiber.StatusUnauthorized, "user_id okunamadı")
	}
}
