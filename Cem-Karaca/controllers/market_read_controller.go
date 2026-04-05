package controllers

import (
	"cem-karaca-bose/config"
	"cem-karaca-bose/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllAssets: Borsadaki tüm varlıkları listele
// GET /api/v1/market
func GetAllAssets(c *fiber.Ctx) error {
	var assets []models.MarketAsset
	if err := config.DB.Find(&assets).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Market verileri alınamadı",
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(assets),
		"data":    assets,
	})
}

// GetAssetBySymbol: Belirli bir varlığın detayını getir
// GET /api/v1/market/:symbol
func GetAssetBySymbol(c *fiber.Ctx) error {
	symbol := c.Params("symbol")
	var asset models.MarketAsset
	if err := config.DB.Where("symbol = ?", symbol).First(&asset).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Varlık bulunamadı: " + symbol,
		})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    asset,
	})
}

// GetAssetsByType: Kripto veya hisse filtrele
// GET /api/v1/market/type/:type
func GetAssetsByType(c *fiber.Ctx) error {
	assetType := c.Params("type")
	if assetType != "crypto" && assetType != "stock" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Geçerli tipler: 'crypto' veya 'stock'",
		})
	}
	var assets []models.MarketAsset
	config.DB.Where("asset_type = ?", assetType).Find(&assets)
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"type":    assetType,
		"count":   len(assets),
		"data":    assets,
	})
}
