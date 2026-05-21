package controllers

import (
	"strings"

	"bose-salih/config"
	"bose-salih/middlewares"
	"bose-salih/models"

	"github.com/gofiber/fiber/v2"
)

type chatInput struct {
	Message string `json:"message"`
}

// SendChatMessage stores the user's message + a canned AI reply.
// The reply is deterministic so demos are reproducible; no LLM call.
func SendChatMessage(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	var body chatInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Message = strings.TrimSpace(body.Message)
	if body.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Mesaj boş olamaz"})
	}

	userMsg := models.ChatMessage{UserID: userID, Role: "USER", Content: body.Message}
	if err := config.DB.Create(&userMsg).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Mesaj kaydedilemedi"})
	}

	aiReply := buildReply(body.Message)
	aiMsg := models.ChatMessage{UserID: userID, Role: "AI", Content: aiReply}
	if err := config.DB.Create(&aiMsg).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "AI yanıtı kaydedilemedi"})
	}

	return c.JSON(fiber.Map{"success": true, "message": aiMsg})
}

// GetChatHistory returns the current user's conversation history in order.
func GetChatHistory(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	var msgs []models.ChatMessage
	config.DB.Where("user_id = ?", userID).Order("created_at ASC").Limit(200).Find(&msgs)
	return c.JSON(fiber.Map{"success": true, "data": msgs})
}

func buildReply(prompt string) string {
	low := strings.ToLower(prompt)
	switch {
	case strings.Contains(low, "btc") || strings.Contains(low, "bitcoin"):
		return "BTC için kısa vadeli yön tarafsız. Bu bir simülasyondur, yatırım tavsiyesi değildir."
	case strings.Contains(low, "thyao"):
		return "THYAO teknik göstergeleri yatay seyirde. Bu bir simülasyondur, yatırım tavsiyesi değildir."
	case strings.Contains(low, "risk"):
		return "Risk seviyenizi profil sayfasından güncelleyebilirsiniz. Bu bir simülasyondur."
	default:
		return "Soruyu daha spesifik bir sembol veya konuyla sorabilirsiniz. Bu bir simülasyondur."
	}
}
