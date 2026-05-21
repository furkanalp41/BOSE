package controllers

import (
	"bose-efe/config"
	"bose-efe/middlewares"
	"bose-efe/models"

	"github.com/gofiber/fiber/v2"
)

// ClearAIHistory permanently deletes every chat_messages row authored by
// the authenticated user. The table is owned by the Salih service;
// Yakup only purges rows.
func ClearAIHistory(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	if err := config.DB.
		Where("user_id = ?", userID).
		Delete(&models.ChatMessage{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Geçmiş temizlenirken hata oluştu",
		})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
