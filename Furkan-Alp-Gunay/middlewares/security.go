package middlewares

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"os"
	"strings"
	"time"

	"bose-furkan/config"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// cacheKey returns a stable Redis key for a raw JWT string.
// We hash to avoid storing the full token verbatim.
func cacheKey(token string) string {
	sum := sha256.Sum256([]byte(token))
	return "session:" + hex.EncodeToString(sum[:])
}

// RequireAuth validates the JWT and stores parsed claims in c.Locals("user").
// On a cache hit (Redis) it skips re-parsing; otherwise it parses,
// caches the claims for up to 5 minutes (bounded by exp), and proceeds.
func RequireAuth(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkilendirme başlığı eksik veya geçersiz",
		})
	}
	tokenString := strings.TrimPrefix(authHeader, "Bearer ")

	if config.Redis != nil {
		if raw, err := config.Redis.Get(config.RedisCtx, cacheKey(tokenString)).Result(); err == nil && raw != "" {
			claims := jwt.MapClaims{}
			if err := json.Unmarshal([]byte(raw), &claims); err == nil {
				if exp, ok := claims["exp"].(float64); ok && time.Now().Unix() < int64(exp) {
					c.Locals("user", claims)
					return c.Next()
				}
			}
		}
	}

	secret := os.Getenv("JWT_SECRET")
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Beklenmeyen imzalama yöntemi")
		}
		return []byte(secret), nil
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

	if config.Redis != nil {
		if raw, err := json.Marshal(claims); err == nil {
			ttl := 5 * time.Minute
			if exp, ok := claims["exp"].(float64); ok {
				remaining := time.Until(time.Unix(int64(exp), 0))
				if remaining > 0 && remaining < ttl {
					ttl = remaining
				}
			}
			_ = config.Redis.Set(config.RedisCtx, cacheKey(tokenString), raw, ttl).Err()
		}
	}

	c.Locals("user", claims)
	return c.Next()
}

// RequireAdmin enforces the admin role. Must run after RequireAuth.
func RequireAdmin(c *fiber.Ctx) error {
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Kullanıcı bilgileri bulunamadı",
		})
	}
	if role, _ := claims["role"].(string); role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Bu işlem için admin yetkisi gereklidir",
		})
	}
	return c.Next()
}

// CurrentUserID extracts the authenticated user's ID from c.Locals("user").
// Returns 0 + error if the context is not authenticated.
func CurrentUserID(c *fiber.Ctx) (uint, error) {
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "Kullanıcı oturumu bulunamadı")
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
