package controllers

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"bose-backend/config"
	"bose-backend/models"
)

func Register(c *fiber.Ctx) error {
	var body models.RegisterDTO
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz veri formatı"})
	}

	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 12)

	user := models.User{
		FullName: body.FullName,
		Email:    body.Email,
		Password: string(hash),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bu e-posta zaten kullanımda olabilir"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Kayıt başarılı",
		"user":    user.GetProfileData(),
	})
}

func Login(c *fiber.Ctx) error {
	var body models.LoginDTO
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz veri formatı"})
	}

	var user models.User
	if err := config.DB.Where("email = ?", body.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "E-posta veya şifre hatalı"})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "E-posta veya şifre hatalı"})
	}

	// JWT Üretimi
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, _ := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Giriş başarılı",
		"token":   tokenString,
		"user":    user.GetProfileData(),
	})
}
