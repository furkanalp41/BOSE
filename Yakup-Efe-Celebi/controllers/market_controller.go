package controllers

import (
	"encoding/json"
	"strings"

	"bose-efe/config"
	"bose-efe/models"

	"github.com/gofiber/fiber/v2"
)

type marketAssetInput struct {
	Symbol      string `json:"symbol"`
	Name        string `json:"name"`
	Type        string `json:"type"`
	Description string `json:"description"`
}

type marketAssetUpdate struct {
	Description *string `json:"description"`
	IsActive    *bool   `json:"isActive"`
}

// CreateMarketAsset adds a new tradable symbol (admin-only).
func CreateMarketAsset(c *fiber.Ctx) error {
	var body marketAssetInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Symbol = strings.ToUpper(strings.TrimSpace(body.Symbol))
	body.Type = strings.ToUpper(strings.TrimSpace(body.Type))
	if body.Symbol == "" || body.Name == "" || (body.Type != "BIST" && body.Type != "CRYPTO") {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "symbol, name, type (BIST|CRYPTO) zorunludur",
		})
	}
	asset := models.MarketAsset{
		Symbol: body.Symbol, Name: body.Name, Type: body.Type,
		Description: body.Description, IsActive: true,
	}
	if err := config.DB.Create(&asset).Error; err != nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Bu sembol zaten mevcut olabilir",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": true, "asset": asset})
}

// UpdateMarketAsset toggles is_active / edits description (admin-only).
func UpdateMarketAsset(c *fiber.Ctx) error {
	id := c.Params("id")
	var asset models.MarketAsset
	if err := config.DB.First(&asset, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Varlık bulunamadı"})
	}
	var body marketAssetUpdate
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	if body.Description != nil {
		asset.Description = *body.Description
	}
	if body.IsActive != nil {
		asset.IsActive = *body.IsActive
	}
	if err := config.DB.Save(&asset).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Güncelleme başarısız"})
	}
	return c.JSON(fiber.Map{"success": true, "asset": asset})
}

// GetMarketPrices returns the latest cached prices. Reads from Redis
// hash `prices:latest`; falls back to listing market_assets without prices
// if Redis is unavailable.
func GetMarketPrices(c *fiber.Ctx) error {
	filter := strings.ToUpper(c.Query("type"))

	if config.Redis != nil {
		raw, err := config.Redis.HGetAll(config.RedisCtx, "prices:latest").Result()
		if err == nil && len(raw) > 0 {
			ticks := make([]models.PriceTick, 0, len(raw))
			for _, v := range raw {
				var t models.PriceTick
				if err := json.Unmarshal([]byte(v), &t); err == nil {
					if filter == "" || filter == t.Type {
						ticks = append(ticks, t)
					}
				}
			}
			return c.JSON(fiber.Map{"success": true, "data": ticks})
		}
	}

	q := config.DB.Where("is_active = ?", true)
	if filter == "BIST" || filter == "CRYPTO" {
		q = q.Where("type = ?", filter)
	}
	var assets []models.MarketAsset
	q.Find(&assets)
	return c.JSON(fiber.Map{"success": true, "data": assets, "warning": "live price feed unavailable"})
}
