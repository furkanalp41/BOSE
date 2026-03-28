package controllers

import (
	"bose/config"
	"bose/models"

	"github.com/gofiber/fiber/v2"
)

// PlaceOrder: Yeni alım veya satım emri ver
// POST /api/orders
func PlaceOrder(c *fiber.Ctx) error {
	// 1. Kullanıcı kimliğini JWT'den al (Furkan'ın middleware'i set edecek)
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkisiz erişim",
		})
	}

	// 2. Request body'yi parse et
	var input models.CreateOrderInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Geçersiz istek formatı",
		})
	}

	// 3. Temel validasyon
	if input.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Miktar 0'dan büyük olmalı",
		})
	}
	if input.Symbol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Symbol gerekli",
		})
	}

	// 4. Market'ten güncel fiyatı al
	var asset models.MarketAsset
	if err := config.DB.Where("symbol = ?", input.Symbol).First(&asset).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Varlık bulunamadı: " + input.Symbol,
		})
	}

	totalPrice := asset.CurrentPrice * input.Quantity

	// 5. Emri oluştur
	order := models.Order{
		UserID:     userID,
		Symbol:     input.Symbol,
		OrderType:  input.OrderType,
		Quantity:   input.Quantity,
		Price:      asset.CurrentPrice,
		TotalPrice: totalPrice,
		Status:     models.OrderStatusFilled, // Anlık işlem: direkt gerçekleşti
	}

	if err := config.DB.Create(&order).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Emir oluşturulamadı",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Emir başarıyla gerçekleşti",
		"data":    order,
	})
}

// GetMyOrders: Kullanıcının tüm emirlerini listele
// GET /api/orders
func GetMyOrders(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkisiz erişim",
		})
	}

	var orders []models.Order
	if err := config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Emirler alınamadı",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(orders),
		"data":    orders,
	})
}

// GetMyBuyOrders: Sadece alım emirlerini listele
// GET /api/orders/buy
func GetMyBuyOrders(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkisiz erişim",
		})
	}

	var orders []models.Order
	config.DB.Where("user_id = ? AND order_type = ?", userID, models.OrderTypeBuy).
		Order("created_at DESC").Find(&orders)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(orders),
		"data":    orders,
	})
}

// GetMySellOrders: Sadece satım emirlerini listele
// GET /api/orders/sell
func GetMySellOrders(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkisiz erişim",
		})
	}

	var orders []models.Order
	config.DB.Where("user_id = ? AND order_type = ?", userID, models.OrderTypeSell).
		Order("created_at DESC").Find(&orders)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(orders),
		"data":    orders,
	})
}

// CancelOrder: Bekleyen bir emri iptal et
// DELETE /api/orders/:id
func CancelOrder(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Yetkisiz erişim",
		})
	}

	orderID := c.Params("id")

	var order models.Order
	if err := config.DB.Where("id = ? AND user_id = ?", orderID, userID).First(&order).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Emir bulunamadı veya size ait değil",
		})
	}

	// Sadece bekleyen emirler iptal edilebilir
	if order.Status != models.OrderStatusPending {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Sadece 'pending' durumundaki emirler iptal edilebilir",
		})
	}

	config.DB.Model(&order).Update("status", models.OrderStatusCancelled)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Emir iptal edildi",
		"data":    order,
	})
}
