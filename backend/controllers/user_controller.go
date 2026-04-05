package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
)

func resolveAndAuthorise(c *fiber.Ctx) (uint, error) {
	claims, ok := c.Locals("claims").(*middleware.Claims)
	if !ok || claims == nil {
		return 0, fiber.NewError(fiber.StatusUnauthorized, "unauthenticated")
	}

	param := c.Params("userId")
	if param == "me" {
		return claims.UserID, nil
	}

	paramID, err := strconv.ParseUint(param, 10, 64)
	if err != nil {
		return 0, fiber.NewError(fiber.StatusBadRequest, "invalid userId")
	}

	if uint(paramID) != claims.UserID {
		return 0, fiber.NewError(fiber.StatusForbidden, "access denied")
	}

	return uint(paramID), nil
}

func GetMe(c *fiber.Ctx) error {
	claims, ok := c.Locals("claims").(*middleware.Claims)
	if !ok || claims == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "unauthenticated")
	}

	var user models.User
	if result := config.DB.First(&user, claims.UserID); result.Error != nil {
		return fiber.NewError(fiber.StatusNotFound, "user not found")
	}

	return c.Status(fiber.StatusOK).JSON(user)
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

	// Accept both camelCase and snake_case field names
	var req struct {
		FullName       string `json:"fullName"`
		FullNameSnake  string `json:"full_name"`
		Phone          string `json:"phone"`
		RiskLevel      string `json:"risk_level"`
		RiskLevelCamel string `json:"riskLevel"`
		InvestmentTerm string `json:"investment_term"`
		InvestTermCamel string `json:"investmentTerm"`
	}
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
	}

	updates := map[string]interface{}{}

	fullName := req.FullName
	if fullName == "" {
		fullName = req.FullNameSnake
	}
	if fullName != "" {
		updates["full_name"] = fullName
	}

	if req.Phone != "" {
		updates["phone"] = req.Phone
	}

	riskLevel := req.RiskLevel
	if riskLevel == "" {
		riskLevel = req.RiskLevelCamel
	}
	if riskLevel != "" {
		validRisk := map[string]bool{"LOW": true, "MEDIUM": true, "HIGH": true}
		if !validRisk[riskLevel] {
			return fiber.NewError(fiber.StatusBadRequest, "risk_level must be LOW, MEDIUM, or HIGH")
		}
		updates["risk_level"] = riskLevel
	}

	investTerm := req.InvestmentTerm
	if investTerm == "" {
		investTerm = req.InvestTermCamel
	}
	if investTerm != "" {
		validTerm := map[string]bool{"SHORT_TERM": true, "MEDIUM_TERM": true, "LONG_TERM": true}
		if !validTerm[investTerm] {
			return fiber.NewError(fiber.StatusBadRequest, "investment_term must be SHORT_TERM, MEDIUM_TERM, or LONG_TERM")
		}
		updates["investment_term"] = investTerm
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
