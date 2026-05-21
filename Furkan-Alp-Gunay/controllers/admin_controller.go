package controllers

import (
	"time"

	"bose-furkan/config"
	"bose-furkan/models"

	"github.com/gofiber/fiber/v2"
)

// GetSystemLogs returns a list of recent system activities.
// Sources both the LoginLog audit trail (real data) and a small set of
// derived events. Useful for the admin dashboard demo.
func GetSystemLogs(c *fiber.Ctx) error {
	var loginLogs []models.LoginLog
	config.DB.Order("login_time DESC").Limit(50).Find(&loginLogs)

	out := make([]fiber.Map, 0, len(loginLogs))
	for _, lg := range loginLogs {
		out = append(out, fiber.Map{
			"id":        lg.ID,
			"action":    "USER_LOGIN",
			"user_id":   lg.UserID,
			"ip":        lg.IPAddress,
			"device":    lg.DeviceInfo,
			"timestamp": lg.LoginTime.Format(time.RFC3339),
		})
	}

	return c.JSON(fiber.Map{"success": true, "data": out})
}

// AdminDeleteUser soft-deletes a user by ID (admin-only).
func AdminDeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Kullanıcı bulunamadı"})
	}
	if err := config.DB.Delete(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Kullanıcı silinirken hata oluştu",
		})
	}
	return c.JSON(fiber.Map{"success": true, "message": "Kullanıcı silindi"})
}

// UpdateUserRole sets the role field on a user record.
func UpdateUserRole(c *fiber.Ctx) error {
	id := c.Params("id")
	var body struct {
		Role string `json:"role"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek gövdesi"})
	}
	if body.Role == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Rol alanı boş olamaz"})
	}

	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Kullanıcı bulunamadı"})
	}
	user.Role = body.Role
	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Rol güncellenirken hata oluştu",
		})
	}
	return c.JSON(fiber.Map{
		"success": true, "message": "Kullanıcı rolü güncellendi",
		"data": fiber.Map{"user_id": user.ID, "role": user.Role},
	})
}

// CreateSystemAlert accepts an admin announcement and echoes it back
// (no persistence — this endpoint is a placeholder hook for future broadcast).
func CreateSystemAlert(c *fiber.Ctx) error {
	var body struct {
		Message string `json:"message"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek gövdesi"})
	}
	if body.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Mesaj alanı boş olamaz"})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true, "message": "Sistem duyurusu oluşturuldu",
		"data": fiber.Map{
			"announcement": body.Message,
			"created_at":   time.Now().Format(time.RFC3339),
		},
	})
}
