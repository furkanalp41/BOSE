package controllers

import (
	"bose-backend/config"
	"bose-backend/models"

	"github.com/gofiber/fiber/v2"
)

func GetProfile(c *fiber.Ctx) error {
	// Middleware'den gelen ID'yi alıyoruz
	userID := c.Locals("userID")

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Kullanıcı bulunamadı"})
	}

	return c.Status(fiber.StatusOK).JSON(user.GetProfileData())
}

func UpdateProfile(c *fiber.Ctx) error {
	userID := c.Locals("userID")
	var body models.UpdateUserDTO

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz veri"})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Kullanıcı bulunamadı"})
	}

	// Bilgileri güncelle
	user.FullName = body.FullName
	user.Phone = body.Phone
	config.DB.Save(&user)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Profil güncellendi",
		"user":    user.GetProfileData(),
	})
}

func DeleteUser(c *fiber.Ctx) error {
	userID := c.Locals("userID")

	// GORM DeletedAt kullandığımız için bu işlem veriyi tamamen silmez, "silindi" olarak işaretler (Soft Delete).
	if err := config.DB.Delete(&models.User{}, userID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Kullanıcı silinemedi"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Kullanıcı başarıyla silindi"})
}
