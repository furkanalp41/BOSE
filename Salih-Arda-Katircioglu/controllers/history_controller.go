package controllers

import (
	"strconv"

	"bose-salih/config"
	"bose-salih/middlewares"
	"bose-salih/models"

	"github.com/gofiber/fiber/v2"
)

// GetOrderHistory reads filled and cancelled orders from the orders table
// owned by the Cem service. Filter is enforced by user_id ownership.
func GetOrderHistory(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	page, _ := strconv.Atoi(c.Query("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.Query("limit", "20"))
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	var orders []models.Order
	var total int64
	q := config.DB.Model(&models.Order{}).
		Where("user_id = ? AND status IN ?", userID, []string{"COMPLETED", "CANCELLED"})
	q.Count(&total)
	q.Order("created_at DESC").Limit(limit).Offset(offset).Find(&orders)

	return c.JSON(fiber.Map{
		"success": true,
		"data":    orders,
		"pagination": fiber.Map{
			"page": page, "limit": limit, "totalItems": total,
		},
	})
}
