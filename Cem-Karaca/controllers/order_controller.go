package controllers

import (
	"cem-karaca-bose/config"
	"cem-karaca-bose/models"

	"github.com/gofiber/fiber/v2"
)

// PlaceOrder: Yeni alım veya satım emri ver
// POST /api/v1/trading/order
func PlaceOrder(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkisiz erişim",
		})
	}

	var input models.CreateOrderInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Geçersiz istek formatı",
		})
	}

	if input.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Miktar 0'dan büyük olmalı"})
	}
	if input.Symbol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Symbol gerekli"})
	}
	if input.Side != "BUY" && input.Side != "SELL" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Side 'BUY' veya 'SELL' olmalı"})
	}

	var asset models.MarketAsset
	if err := config.DB.Where("symbol = ?", input.Symbol).First(&asset).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Varlık bulunamadı: " + input.Symbol})
	}

	totalPrice := asset.CurrentPrice * input.Quantity

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Kullanıcı bulunamadı"})
	}

	if input.Side == "BUY" {
		if user.VirtualBalance < totalPrice {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":    "Yetersiz bakiye",
				"balance":  user.VirtualBalance,
				"required": totalPrice,
			})
		}
		config.DB.Model(&user).Update("virtual_balance", user.VirtualBalance-totalPrice)

		var pos models.Position
		err := config.DB.Where("user_id = ? AND symbol = ? AND is_open = true", userID, input.Symbol).First(&pos).Error
		if err != nil {
			pos = models.Position{
				UserID:        userID,
				Symbol:        input.Symbol,
				Quantity:      input.Quantity,
				AvgEntryPrice: asset.CurrentPrice,
				IsOpen:        true,
			}
			config.DB.Create(&pos)
		} else {
			totalQty := pos.Quantity + input.Quantity
			avgPrice := (pos.AvgEntryPrice*pos.Quantity + asset.CurrentPrice*input.Quantity) / totalQty
			config.DB.Model(&pos).Updates(map[string]interface{}{
				"quantity":        totalQty,
				"avg_entry_price": avgPrice,
			})
		}
	} else {
		var pos models.Position
		if err := config.DB.Where("user_id = ? AND symbol = ? AND is_open = true", userID, input.Symbol).First(&pos).Error; err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bu sembol için açık pozisyonunuz yok"})
		}
		if pos.Quantity < input.Quantity {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error":     "Yeterli miktarda pozisyonunuz yok",
				"available": pos.Quantity,
			})
		}
		config.DB.Model(&user).Update("virtual_balance", user.VirtualBalance+totalPrice)
		newQty := pos.Quantity - input.Quantity
		if newQty == 0 {
			config.DB.Model(&pos).Update("is_open", false)
		} else {
			config.DB.Model(&pos).Update("quantity", newQty)
		}
	}

	order := models.Order{
		UserID:     userID,
		Symbol:     input.Symbol,
		OrderType:  models.OrderType(input.Side),
		Quantity:   input.Quantity,
		Price:      asset.CurrentPrice,
		TotalPrice: totalPrice,
		Status:     models.OrderStatusFilled,
	}
	config.DB.Create(&order)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success":     true,
		"message":     "Emir başarıyla gerçekleşti",
		"id":          order.ID,
		"userId":      userID,
		"symbol":      order.Symbol,
		"side":        input.Side,
		"quantity":    order.Quantity,
		"price":       order.Price,
		"total":       order.TotalPrice,
		"new_balance": user.VirtualBalance,
		"created_at":  order.CreatedAt,
	})
}

// GetTradingHistory: Kullanıcının işlem geçmişini listele
// GET /api/v1/trading/history
func GetTradingHistory(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Yetkisiz erişim"})
	}

	var orders []models.Order
	config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&orders)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(orders),
		"data":    orders,
	})
}
