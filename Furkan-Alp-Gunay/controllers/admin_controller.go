package controllers

import (
	"time"

	"bose-backend/config"
	"bose-backend/models"

	"github.com/gofiber/fiber/v2"
)

// GetSystemLogs returns a mock list of recent system activities.
func GetSystemLogs(c *fiber.Ctx) error {
	logs := []fiber.Map{
		{
			"id":        1,
			"action":    "USER_LOGIN",
			"details":   "admin@bose.com giriş yaptı",
			"timestamp": time.Now().Add(-10 * time.Minute).Format(time.RFC3339),
		},
		{
			"id":        2,
			"action":    "TRADE_EXECUTED",
			"details":   "AAPL hissesi için alım emri gerçekleştirildi",
			"timestamp": time.Now().Add(-5 * time.Minute).Format(time.RFC3339),
		},
		{
			"id":        3,
			"action":    "RISK_ASSESSMENT",
			"details":   "Kullanıcı #12 risk seviyesi 'High' olarak güncellendi",
			"timestamp": time.Now().Add(-2 * time.Minute).Format(time.RFC3339),
		},
	}

	return c.JSON(fiber.Map{
		"success": true,
		"data":    logs,
	})
}

// DeleteUser soft-deletes a user by ID using GORM.
func DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")

	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Kullanıcı bulunamadı",
		})
	}

	if err := config.DB.Delete(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Kullanıcı silinirken hata oluştu",
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Kullanıcı başarıyla silindi (soft-delete)",
	})
}
