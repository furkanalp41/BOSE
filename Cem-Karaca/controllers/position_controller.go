package controllers

import (
	"cem-karaca-bose/config"
	"cem-karaca-bose/models"

	"github.com/gofiber/fiber/v2"
)

// GetOpenPositions: Kullanıcının tüm açık pozisyonlarını PnL ile listele
// GET /api/v1/trading/positions
func GetOpenPositions(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Yetkisiz erişim"})
	}

	var positions []models.Position
	config.DB.Where("user_id = ? AND is_open = true", userID).Find(&positions)

	result := []models.PositionWithPnL{}
	for _, pos := range positions {
		var asset models.MarketAsset
		config.DB.Where("symbol = ?", pos.Symbol).First(&asset)

		marketValue := asset.CurrentPrice * pos.Quantity
		pnl := marketValue - (pos.AvgEntryPrice * pos.Quantity)
		pnlPercent := 0.0
		if pos.AvgEntryPrice > 0 {
			pnlPercent = ((asset.CurrentPrice - pos.AvgEntryPrice) / pos.AvgEntryPrice) * 100
		}

		result = append(result, models.PositionWithPnL{
			Position:     pos,
			CurrentPrice: asset.CurrentPrice,
			MarketValue:  marketValue,
			PnL:          pnl,
			PnLPercent:   pnlPercent,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(result),
		"data":    result,
	})
}

// ClosePosition: Belirtilen pozisyonu güncel fiyattan kapat
// POST /api/v1/trading/positions/:positionId/close
func ClosePosition(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Yetkisiz erişim"})
	}

	positionID := c.Params("positionId")

	var pos models.Position
	if err := config.DB.Where("id = ? AND user_id = ? AND is_open = true", positionID, userID).First(&pos).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Pozisyon bulunamadı veya zaten kapalı",
		})
	}

	var asset models.MarketAsset
	config.DB.Where("symbol = ?", pos.Symbol).First(&asset)

	totalReturn := asset.CurrentPrice * pos.Quantity
	pnl := totalReturn - (pos.AvgEntryPrice * pos.Quantity)

	// Bakiyeye geri ekle
	var user models.User
	config.DB.First(&user, userID)
	config.DB.Model(&user).Update("virtual_balance", user.VirtualBalance+totalReturn)

	// Pozisyonu kapat
	config.DB.Model(&pos).Update("is_open", false)

	// Satış emri olarak kaydet
	order := models.Order{
		UserID:     userID,
		Symbol:     pos.Symbol,
		OrderType:  models.OrderTypeSell,
		Quantity:   pos.Quantity,
		Price:      asset.CurrentPrice,
		TotalPrice: totalReturn,
		Status:     models.OrderStatusFilled,
	}
	config.DB.Create(&order)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success":     true,
		"message":     "Pozisyon başarıyla kapatıldı",
		"symbol":      pos.Symbol,
		"quantity":    pos.Quantity,
		"close_price": asset.CurrentPrice,
		"total":       totalReturn,
		"pnl":         pnl,
		"new_balance": user.VirtualBalance + totalReturn,
	})
}

// GetPortfolio: Kullanıcının portföy özetini getir
// GET /api/v1/trading/portfolio
func GetPortfolio(c *fiber.Ctx) error {
	userID, ok := c.Locals("userID").(uint)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Yetkisiz erişim"})
	}

	var user models.User
	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Kullanıcı bulunamadı"})
	}

	var positions []models.Position
	config.DB.Where("user_id = ? AND is_open = true", userID).Find(&positions)

	positionsWithPnL := []models.PositionWithPnL{}
	totalInPositions := 0.0
	totalPnL := 0.0

	for _, pos := range positions {
		var asset models.MarketAsset
		config.DB.Where("symbol = ?", pos.Symbol).First(&asset)

		marketValue := asset.CurrentPrice * pos.Quantity
		pnl := marketValue - (pos.AvgEntryPrice * pos.Quantity)
		pnlPercent := 0.0
		if pos.AvgEntryPrice > 0 {
			pnlPercent = ((asset.CurrentPrice - pos.AvgEntryPrice) / pos.AvgEntryPrice) * 100
		}

		totalInPositions += marketValue
		totalPnL += pnl

		positionsWithPnL = append(positionsWithPnL, models.PositionWithPnL{
			Position:     pos,
			CurrentPrice: asset.CurrentPrice,
			MarketValue:  marketValue,
			PnL:          pnl,
			PnLPercent:   pnlPercent,
		})
	}

	totalValue := user.VirtualBalance + totalInPositions
	pnlPercent := 0.0
	if totalInPositions > 0 {
		pnlPercent = (totalPnL / totalInPositions) * 100
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success":      true,
		"balance":      user.VirtualBalance,
		"in_positions": totalInPositions,
		"total_value":  totalValue,
		"pnl":          totalPnL,
		"pnl_percent":  pnlPercent,
		"positions":    positionsWithPnL,
	})
}
