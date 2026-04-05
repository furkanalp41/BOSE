package controllers

import (
	"your_module_name/config"
	"your_module_name/models"

	"github.com/gofiber/fiber/v2"
)

// GetAllAssets: Borsadaki tüm varlıkları listele
// GET /api/market
func GetAllAssets(c *fiber.Ctx) error {
	var assets []models.MarketAsset

	result := config.DB.Find(&assets)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Market verileri alınamadı: " + result.Error.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"count":   len(assets),
		"data":    assets,
	})
}

// GetAssetBySymbol: Belirli bir coin/hissenin detayını getir
// GET /api/market/:symbol
func GetAssetBySymbol(c *fiber.Ctx) error {
	symbol := c.Params("symbol")
	if symbol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Symbol parametresi gerekli",
		})
	}

	var asset models.MarketAsset
	result := config.DB.Where("symbol = ?", symbol).First(&asset)
	if result.Error != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Varlık bulunamadı: " + symbol,
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"data":    asset,
	})
}

// GetAssetsByType: Sadece kripto veya sadece hisse listele
// GET /api/market/type/:type  (type = "crypto" veya "stock")
func GetAssetsByType(c *fiber.Ctx) error {
	assetType := c.Params("type")
	if assetType != "crypto" && assetType != "stock" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Geçerli tipler: 'crypto' veya 'stock'",
		})
	}

	var assets []models.MarketAsset
	result := config.DB.Where("asset_type = ?", assetType).Find(&assets)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Veriler alınamadı",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"type":    assetType,
		"count":   len(assets),
		"data":    assets,
	})
}
