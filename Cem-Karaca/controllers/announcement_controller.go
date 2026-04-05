package controllers

import (
	"cem-karaca-bose/config"
	"cem-karaca-bose/models"

	"github.com/gofiber/fiber/v2"
)

// CreateAnnouncement: Admin duyurusu oluştur
// POST /api/v1/admin/announcements
func CreateAnnouncement(c *fiber.Ctx) error {
	var input models.CreateAnnouncementInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Geçersiz istek formatı",
		})
	}

	if input.Title == "" || input.Content == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "title ve content alanları zorunludur",
		})
	}

	announcement := models.Announcement{
		Title:   input.Title,
		Content: input.Content,
	}

	if err := config.DB.Create(&announcement).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Duyuru oluşturulamadı",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Duyuru başarıyla oluşturuldu",
		"data":    announcement,
	})
}
