package controllers

import (
	"encoding/json"
	"strconv"
	"strings"
	"time"

	"bose-cem/config"
	"bose-cem/messaging"
	"bose-cem/middlewares"
	"bose-cem/models"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type marketOrderInput struct {
	Symbol   string  `json:"symbol"`
	Side     string  `json:"side"`
	Quantity float64 `json:"quantity"`
}

type limitOrderInput struct {
	Symbol      string  `json:"symbol"`
	Side        string  `json:"side"`
	Quantity    float64 `json:"quantity"`
	TargetPrice float64 `json:"targetPrice"`
}

type orderUpdateInput struct {
	Quantity    *float64 `json:"quantity"`
	TargetPrice *float64 `json:"targetPrice"`
}

// PriceLookup is overridable in tests so controllers do not require Redis.
var PriceLookup = lookupLatestPrice

// lookupLatestPrice reads the Redis hash `prices:latest` (populated by the
// Yakup service's streamer). Falls back to a constant default if unavailable.
func lookupLatestPrice(symbol string) (float64, error) {
	if config.Redis == nil {
		return 100, nil
	}
	raw, err := config.Redis.HGet(config.RedisCtx, "prices:latest", symbol).Result()
	if err != nil || raw == "" {
		return 100, nil
	}
	var t struct {
		Price float64 `json:"price"`
	}
	if err := json.Unmarshal([]byte(raw), &t); err != nil {
		return 100, nil
	}
	if t.Price <= 0 {
		return 100, nil
	}
	return t.Price, nil
}

func normalizeSide(s string) string {
	s = strings.ToUpper(strings.TrimSpace(s))
	if s == "BUY" || s == "SELL" {
		return s
	}
	return ""
}

// CreateMarketOrder debits balance (BUY) or credits it (SELL) atomically
// and stores a COMPLETED order, then publishes order.filled.
func CreateMarketOrder(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var body marketOrderInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Symbol = strings.ToUpper(strings.TrimSpace(body.Symbol))
	side := normalizeSide(body.Side)
	if body.Symbol == "" || side == "" || body.Quantity <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "symbol, side (BUY|SELL), pozitif quantity zorunlu",
		})
	}

	price, _ := PriceLookup(body.Symbol)
	cost := price * body.Quantity
	now := time.Now()

	order := models.Order{
		UserID:      userID,
		Symbol:      body.Symbol,
		Side:        side,
		Type:        "MARKET",
		Status:      "COMPLETED",
		Quantity:    body.Quantity,
		FilledPrice: &price,
		FilledAt:    &now,
	}

	err = config.DB.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := tx.First(&user, userID).Error; err != nil {
			return fiber.NewError(fiber.StatusNotFound, "Kullanıcı bulunamadı")
		}
		if side == "BUY" {
			if user.VirtualBalance < cost {
				return fiber.NewError(fiber.StatusBadRequest, "Yetersiz bakiye")
			}
			user.VirtualBalance -= cost
		} else {
			user.VirtualBalance += cost
		}
		if err := tx.Save(&user).Error; err != nil {
			return err
		}
		return tx.Create(&order).Error
	})
	if err != nil {
		status := fiber.StatusInternalServerError
		msg := err.Error()
		if fe, ok := err.(*fiber.Error); ok {
			status = fe.Code
			msg = fe.Message
		}
		return c.Status(status).JSON(fiber.Map{"error": msg})
	}

	_ = messaging.Publish("order.filled", fiber.Map{
		"orderId": order.ID, "userId": userID, "symbol": order.Symbol,
		"side": side, "quantity": order.Quantity, "price": price,
		"ts": now.Format(time.RFC3339),
	})

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": true, "order": order})
}

// CreateLimitOrder blocks balance (BUY) and stores a PENDING order.
// SELL limit orders don't block balance — they're settled later when filled.
func CreateLimitOrder(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	var body limitOrderInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Symbol = strings.ToUpper(strings.TrimSpace(body.Symbol))
	side := normalizeSide(body.Side)
	if body.Symbol == "" || side == "" || body.Quantity <= 0 || body.TargetPrice <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "symbol, side, pozitif quantity ve targetPrice zorunlu",
		})
	}

	cost := body.Quantity * body.TargetPrice
	order := models.Order{
		UserID:      userID,
		Symbol:      body.Symbol,
		Side:        side,
		Type:        "LIMIT",
		Status:      "PENDING",
		Quantity:    body.Quantity,
		TargetPrice: &body.TargetPrice,
	}
	if side == "BUY" {
		order.BlockedFunds = cost
	}

	err = config.DB.Transaction(func(tx *gorm.DB) error {
		if side == "BUY" {
			var user models.User
			if err := tx.First(&user, userID).Error; err != nil {
				return fiber.NewError(fiber.StatusNotFound, "Kullanıcı bulunamadı")
			}
			if user.VirtualBalance < cost {
				return fiber.NewError(fiber.StatusBadRequest, "Bakiye blokesi başarısız (yetersiz)")
			}
			user.VirtualBalance -= cost
			if err := tx.Save(&user).Error; err != nil {
				return err
			}
		}
		return tx.Create(&order).Error
	})
	if err != nil {
		status := fiber.StatusInternalServerError
		msg := err.Error()
		if fe, ok := err.(*fiber.Error); ok {
			status = fe.Code
			msg = fe.Message
		}
		return c.Status(status).JSON(fiber.Map{"error": msg})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": true, "order": order})
}

// GetOpenOrders lists every PENDING order belonging to the current user.
func GetOpenOrders(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	var orders []models.Order
	if err := config.DB.
		Where("user_id = ? AND status = ?", userID, "PENDING").
		Order("created_at DESC").
		Find(&orders).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Sorgu başarısız"})
	}
	return c.JSON(fiber.Map{"success": true, "data": orders})
}

// UpdateLimitOrder edits quantity and/or targetPrice on a PENDING limit order.
// BUY orders re-balance the blocked-funds reservation.
func UpdateLimitOrder(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	id, perr := strconv.ParseUint(c.Params("id"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}

	var body orderUpdateInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	if body.Quantity == nil && body.TargetPrice == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Güncellenecek alan yok"})
	}

	err = config.DB.Transaction(func(tx *gorm.DB) error {
		var order models.Order
		if err := tx.First(&order, id).Error; err != nil {
			return fiber.NewError(fiber.StatusNotFound, "Emir bulunamadı")
		}
		if order.UserID != userID {
			return fiber.NewError(fiber.StatusForbidden, "Bu emir size ait değil")
		}
		if order.Status != "PENDING" || order.Type != "LIMIT" {
			return fiber.NewError(fiber.StatusBadRequest, "Sadece açık limit emirler güncellenebilir")
		}

		newQty := order.Quantity
		newPrice := *order.TargetPrice
		if body.Quantity != nil {
			if *body.Quantity <= 0 {
				return fiber.NewError(fiber.StatusBadRequest, "quantity pozitif olmalı")
			}
			newQty = *body.Quantity
		}
		if body.TargetPrice != nil {
			if *body.TargetPrice <= 0 {
				return fiber.NewError(fiber.StatusBadRequest, "targetPrice pozitif olmalı")
			}
			newPrice = *body.TargetPrice
		}

		if order.Side == "BUY" {
			newBlock := newQty * newPrice
			diff := newBlock - order.BlockedFunds
			if diff != 0 {
				var user models.User
				if err := tx.First(&user, userID).Error; err != nil {
					return err
				}
				if diff > 0 && user.VirtualBalance < diff {
					return fiber.NewError(fiber.StatusBadRequest, "Yeni blokaj için bakiye yetersiz")
				}
				user.VirtualBalance -= diff
				if err := tx.Save(&user).Error; err != nil {
					return err
				}
				order.BlockedFunds = newBlock
			}
		}
		order.Quantity = newQty
		order.TargetPrice = &newPrice
		return tx.Save(&order).Error
	})
	if err != nil {
		status := fiber.StatusInternalServerError
		msg := err.Error()
		if fe, ok := err.(*fiber.Error); ok {
			status = fe.Code
			msg = fe.Message
		}
		return c.Status(status).JSON(fiber.Map{"error": msg})
	}

	var order models.Order
	config.DB.First(&order, id)
	return c.JSON(fiber.Map{"success": true, "order": order})
}

// CancelOrder cancels a PENDING limit order and refunds any blocked funds.
func CancelOrder(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	id, perr := strconv.ParseUint(c.Params("id"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}

	err = config.DB.Transaction(func(tx *gorm.DB) error {
		var order models.Order
		if err := tx.First(&order, id).Error; err != nil {
			return fiber.NewError(fiber.StatusNotFound, "Emir bulunamadı")
		}
		if order.UserID != userID {
			return fiber.NewError(fiber.StatusForbidden, "Yetkisiz")
		}
		if order.Status != "PENDING" {
			return fiber.NewError(fiber.StatusBadRequest, "Sadece bekleyen emir iptal edilebilir")
		}
		if order.Side == "BUY" && order.BlockedFunds > 0 {
			var user models.User
			if err := tx.First(&user, userID).Error; err != nil {
				return err
			}
			user.VirtualBalance += order.BlockedFunds
			if err := tx.Save(&user).Error; err != nil {
				return err
			}
			order.BlockedFunds = 0
		}
		now := time.Now()
		order.Status = "CANCELLED"
		order.CancelledAt = &now
		return tx.Save(&order).Error
	})
	if err != nil {
		status := fiber.StatusInternalServerError
		msg := err.Error()
		if fe, ok := err.(*fiber.Error); ok {
			status = fe.Code
			msg = fe.Message
		}
		return c.Status(status).JSON(fiber.Map{"error": msg})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
