package controllers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"bose-salih/config"
	"bose-salih/middlewares"
	"bose-salih/models"

	"github.com/gofiber/fiber/v2"
)

const alertsTTL = 60 * time.Second

type alertInput struct {
	Symbol      string  `json:"symbol"`
	TargetPrice float64 `json:"targetPrice"`
	Condition   string  `json:"condition"`
}

type alertUpdate struct {
	TargetPrice *float64 `json:"targetPrice"`
	IsActive    *bool    `json:"isActive"`
	Condition   *string  `json:"condition"`
}

func normalizeCondition(cond string) string {
	cond = strings.ToUpper(strings.TrimSpace(cond))
	if cond == "GREATER_THAN" || cond == "LESS_THAN" {
		return cond
	}
	return ""
}

// CreateAlert registers a new price alert for the authenticated user.
func CreateAlert(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	var body alertInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Symbol = strings.ToUpper(strings.TrimSpace(body.Symbol))
	cond := normalizeCondition(body.Condition)
	if body.Symbol == "" || body.TargetPrice <= 0 || cond == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "symbol, pozitif targetPrice, condition (GREATER_THAN|LESS_THAN) zorunlu",
		})
	}
	alert := models.PriceAlert{
		UserID: userID, Symbol: body.Symbol,
		TargetPrice: body.TargetPrice, Condition: cond, IsActive: true,
	}
	if err := config.DB.Create(&alert).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Alarm oluşturulamadı"})
	}
	invalidateAlertCache(body.Symbol)
	invalidateUserAlerts(userID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": true, "alert": alert})
}

// UpdateAlert mutates targetPrice / isActive / condition.
func UpdateAlert(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	id, perr := strconv.ParseUint(c.Params("id"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}
	var alert models.PriceAlert
	if err := config.DB.First(&alert, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Alarm bulunamadı"})
	}
	if alert.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Yetkisiz"})
	}
	var body alertUpdate
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	if body.TargetPrice != nil {
		if *body.TargetPrice <= 0 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "targetPrice pozitif olmalı"})
		}
		alert.TargetPrice = *body.TargetPrice
	}
	if body.IsActive != nil {
		alert.IsActive = *body.IsActive
	}
	if body.Condition != nil {
		cond := normalizeCondition(*body.Condition)
		if cond == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz condition"})
		}
		alert.Condition = cond
	}
	if err := config.DB.Save(&alert).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Güncelleme başarısız"})
	}
	invalidateAlertCache(alert.Symbol)
	invalidateUserAlerts(userID)
	return c.JSON(fiber.Map{"success": true, "alert": alert})
}

// DeleteAlert removes an alert owned by the current user.
func DeleteAlert(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	id, perr := strconv.ParseUint(c.Params("id"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}
	var alert models.PriceAlert
	if err := config.DB.First(&alert, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Alarm bulunamadı"})
	}
	if alert.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Yetkisiz"})
	}
	if err := config.DB.Delete(&alert).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Silme başarısız"})
	}
	invalidateAlertCache(alert.Symbol)
	invalidateUserAlerts(userID)
	return c.SendStatus(fiber.StatusNoContent)
}

// ListAlerts returns the current user's alerts. Cache-aside: the per-user list
// is served from Redis (key alerts:user:<id>, TTL alertsTTL) and recomputed from
// Postgres on a miss; every mutation invalidates the key.
func ListAlerts(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	if config.Redis != nil {
		if raw, err := config.Redis.Get(config.RedisCtx, userAlertsKey(userID)).Result(); err == nil && raw != "" {
			return c.Type("application/json").SendString(raw)
		}
	}

	var alerts []models.PriceAlert
	config.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&alerts)

	body := fiber.Map{"success": true, "data": alerts}
	if config.Redis != nil {
		if raw, err := json.Marshal(body); err == nil {
			_ = config.Redis.Set(config.RedisCtx, userAlertsKey(userID), raw, alertsTTL).Err()
		}
	}
	return c.JSON(body)
}

func userAlertsKey(userID uint) string { return fmt.Sprintf("alerts:user:%d", userID) }

// invalidateUserAlerts drops a user's cached alert list after a mutation.
func invalidateUserAlerts(userID uint) {
	if config.Redis == nil {
		return
	}
	_ = config.Redis.Del(config.RedisCtx, userAlertsKey(userID)).Err()
}

func invalidateAlertCache(symbol string) {
	if config.Redis == nil {
		return
	}
	_ = config.Redis.Del(config.RedisCtx, "alerts:active:"+symbol).Err()
}
