package controllers

import (
	"strconv"

	"bose-efe/config"
	"bose-efe/middlewares"
	"bose-efe/models"

	"github.com/gofiber/fiber/v2"
)

// GetUserLogs returns the login history for a user.
// The table is owned and written by the Furkan service; Yakup only reads it.
// The authenticated user can only fetch their own logs unless they are admin.
func GetUserLogs(c *fiber.Ctx) error {
	authUserID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	target, err := strconv.ParseUint(c.Params("id"), 10, 64)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}
	if uint(target) != authUserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Yetkisiz erişim"})
	}

	var logs []models.LoginLog
	if err := config.DB.
		Where("user_id = ?", target).
		Order("login_time DESC").
		Limit(50).
		Find(&logs).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Loglar okunamadı"})
	}
	return c.JSON(fiber.Map{"success": true, "data": logs})
}
