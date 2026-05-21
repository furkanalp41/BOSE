package controllers

import (
	"encoding/json"
	"strconv"

	"bose-furkan/config"
	"bose-furkan/middlewares"
	"bose-furkan/models"

	"github.com/gofiber/fiber/v2"
)

// authorize returns the target user ID parsed from :id, after enforcing
// that the JWT's user_id matches it (a user can only operate on themself).
func authorize(c *fiber.Ctx) (uint, error) {
	authUserID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return 0, err
	}
	raw := c.Params("id")
	target, err := strconv.ParseUint(raw, 10, 64)
	if err != nil {
		return 0, fiber.NewError(fiber.StatusBadRequest, "Geçersiz kullanıcı id")
	}
	if uint(target) != authUserID {
		return 0, fiber.NewError(fiber.StatusForbidden, "Başka bir kullanıcının verisine erişemezsiniz")
	}
	return authUserID, nil
}

// GetUserByID returns the authenticated user's profile.
func GetUserByID(c *fiber.Ctx) error {
	userID, err := authorize(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false, "error": "Kullanıcı bulunamadı",
		})
	}
	return c.JSON(fiber.Map{"success": true, "user": user})
}

// UpdateUser updates the user's editable profile fields.
func UpdateUser(c *fiber.Ctx) error {
	userID, err := authorize(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false, "error": "Kullanıcı bulunamadı",
		})
	}

	var body struct {
		FullName string `json:"full_name"`
		Email    string `json:"email"`
		Phone    string `json:"phone"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "error": "Geçersiz istek gövdesi",
		})
	}

	if body.FullName != "" {
		user.FullName = body.FullName
	}
	if body.Phone != "" {
		user.Phone = body.Phone
	}
	if body.Email != "" && body.Email != user.Email {
		var existing models.User
		if err := config.DB.Where("email = ? AND id != ?", body.Email, userID).First(&existing).Error; err == nil {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"success": false, "error": "Bu email adresi zaten kullanımda",
			})
		}
		user.Email = body.Email
	}

	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "error": "Profil güncellenirken hata oluştu",
		})
	}
	return c.JSON(fiber.Map{
		"success": true, "message": "Profil güncellendi", "user": user,
	})
}

// DeleteUser soft-deletes the authenticated user.
func DeleteUser(c *fiber.Ctx) error {
	userID, err := authorize(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	if err := config.DB.Delete(&models.User{}, userID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "error": "Hesap silinirken hata oluştu",
		})
	}
	return c.JSON(fiber.Map{"success": true, "message": "Hesap silindi"})
}

// SaveAIPreferences stores arbitrary JSON preferences (risk, term, …)
// on the user record.
func SaveAIPreferences(c *fiber.Ctx) error {
	userID, err := authorize(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false, "error": "Kullanıcı bulunamadı",
		})
	}

	var body map[string]interface{}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "error": "Geçersiz istek gövdesi",
		})
	}
	if len(body) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "error": "AI tercihleri boş olamaz",
		})
	}

	prefsJSON, err := json.Marshal(body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "error": "Tercihler işlenirken hata oluştu",
		})
	}
	user.AIPreferences = string(prefsJSON)
	if level, ok := body["risk_level"].(string); ok && level != "" {
		user.RiskLevel = level
	}

	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "error": "Tercihler kaydedilirken hata oluştu",
		})
	}
	return c.JSON(fiber.Map{
		"success":        true,
		"message":        "AI tercihleri kaydedildi",
		"ai_preferences": body,
	})
}
