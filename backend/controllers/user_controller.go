package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
)

func resolveAndAuthorise(c *fiber.Ctx) (uint, error) {
	paramID, err := strconv.ParseUint(c.Params("userId"), 10, 64)
	if err != nil {
		return 0, fiber.NewError(fiber.StatusBadRequest, "invalid userId")
	}

	claims, ok := c.Locals("claims").(*middleware.Claims)
	if !ok || claims == nil {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "unauthenticated")
	}

	if uint(paramID) != claims.UserID {
		return 0, fiber.NewError(fiber.StatusForbidden, "access denied")
	}

	return uint(paramID), nil
}

func GetUser(c *fiber.Ctx) error {
	userID, err := resolveAndAuthorise(c)
	if err != nil {
		return err
	}

	var user models.User
	if result := config.DB.First(&user, userID); result.Error != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

func UpdateUser(c *fiber.Ctx) error {
	userID, err := resolveAndAuthorise(c)
	if err != nil {
		return err
	}

	var req models.UpdateProfileRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	updates := map[string]interface{}{}
	if req.FullName != "" {
		updates["full_name"] = req.FullName
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}

	if len(updates) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "no updatable fields provided")
	}

	if result := config.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updates); result.Error != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to update user")
	}

	var updated models.User
	config.DB.First(&updated, userID)
	return c.Status(fiber.StatusOK).JSON(updated)
}

func DeleteUser(c *fiber.Ctx) error {
	userID, err := resolveAndAuthorise(c)
	if err != nil {
		return err
	}

	var user models.User
	if result := config.DB.First(&user, userID); result.Error != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}

	if result := config.DB.Unscoped().Delete(&models.User{}, userID); result.Error != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to delete user")
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func UpdateAIPreferences(c *fiber.Ctx) error {
	userID, err := resolveAndAuthorise(c)
	if err != nil {
		return err
	}

	var req models.AIPreferencesRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	validRisk := map[string]bool{"LOW": true, "MEDIUM": true, "HIGH": true}
	validTerm := map[string]bool{"SHORT_TERM": true, "MEDIUM_TERM": true, "LONG_TERM": true}

	if !validRisk[req.RiskLevel] {
		return fiber.NewError(fiber.StatusBadRequest, "riskLevel must be LOW, MEDIUM, or HIGH")
	}
	if !validTerm[req.InvestmentTerm] {
		return fiber.NewError(fiber.StatusBadRequest, "investmentTerm must be SHORT_TERM, MEDIUM_TERM, or LONG_TERM")
	}

	updates := map[string]interface{}{
		"risk_level":      req.RiskLevel,
		"investment_term": req.InvestmentTerm,
	}

	if result := config.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updates); result.Error != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "failed to save AI preferences")
	}

	var updated models.User
	config.DB.First(&updated, userID)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "AI preferences updated",
		"user":    updated,
	})
}
