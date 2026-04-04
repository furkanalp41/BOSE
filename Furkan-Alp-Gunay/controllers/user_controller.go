package controllers

import (
	"encoding/json"

	"bose-backend/config"
	"bose-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// getUserIDFromToken extracts the user ID from JWT claims stored in context.
func getUserIDFromToken(c *fiber.Ctx) (uint, error) {
	claims, ok := c.Locals("user").(jwt.MapClaims)
	if !ok {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "Kullanıcı bilgileri okunamadı")
	}
	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "Kullanıcı ID'si okunamadı")
	}
	return uint(userIDFloat), nil
}

// GetProfile returns the authenticated user's profile.
func GetProfile(c *fiber.Ctx) error {
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Kullanıcı bulunamadı",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"user":    user,
	})
}

// UpdateProfile updates the authenticated user's profile fields.
func UpdateProfile(c *fiber.Ctx) error {
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Kullanıcı bulunamadı",
		})
	}

	var body struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Geçersiz istek gövdesi",
		})
	}

	if body.FullName != "" {
		user.FullName = body.FullName
	}

	if body.Email != "" && body.Email != user.Email {
		var existing models.User
		if err := config.DB.Where("email = ? AND id != ?", body.Email, userID).First(&existing).Error; err == nil {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"success": false,
				"error":   "Bu email adresi zaten kullanımda",
			})
		}
		user.Email = body.Email
	}

	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Profil güncellenirken hata oluştu",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Profil başarıyla güncellendi",
		"user":    user,
	})
}

// DeleteAccount soft-deletes the authenticated user's account.
func DeleteAccount(c *fiber.Ctx) error {
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	if err := config.DB.Delete(&models.User{}, userID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Hesap silinirken hata oluştu",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Hesap başarıyla silindi",
	})
}

// SaveAIPreferences saves the authenticated user's AI analysis preferences.
func SaveAIPreferences(c *fiber.Ctx) error {
	userID, err := getUserIDFromToken(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"success": false,
			"error":   err.Error(),
		})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"error":   "Kullanıcı bulunamadı",
		})
	}

	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "Geçersiz istek gövdesi",
		})
	}

	if len(body) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"error":   "AI tercihleri boş olamaz",
		})
	}

	prefsJSON, err := json.Marshal(body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Tercihler işlenirken hata oluştu",
		})
	}

	user.AIPreferences = string(prefsJSON)
	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"error":   "Tercihler kaydedilirken hata oluştu",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success":        true,
		"message":        "AI tercihleri başarıyla kaydedildi",
		"ai_preferences": body,
	})
}
