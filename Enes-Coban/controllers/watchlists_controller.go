package controllers

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"bose-enes/config"
	"bose-enes/middlewares"
	"bose-enes/models"

	"github.com/gofiber/fiber/v2"
)

const cacheTTL = 60 * time.Second

type watchlistInput struct {
	Name string `json:"name"`
}

type assetInput struct {
	Symbol string `json:"symbol"`
}

func cacheKey(userID uint) string { return fmt.Sprintf("watchlists:user:%d", userID) }

func invalidate(userID uint) {
	if config.Redis == nil {
		return
	}
	_ = config.Redis.Del(config.RedisCtx, cacheKey(userID)).Err()
}

// GetWatchlists returns every watchlist (with assets) owned by the current user.
// Caches the response for 60s in Redis under the key `watchlists:user:<id>`.
func GetWatchlists(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	if config.Redis != nil {
		if raw, err := config.Redis.Get(config.RedisCtx, cacheKey(userID)).Result(); err == nil && raw != "" {
			return c.Type("application/json").SendString(raw)
		}
	}

	var lists []models.Watchlist
	if err := config.DB.
		Preload("Assets").
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Find(&lists).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Sorgu başarısız"})
	}

	body := fiber.Map{"success": true, "data": lists}
	if config.Redis != nil {
		if raw, err := json.Marshal(body); err == nil {
			_ = config.Redis.Set(config.RedisCtx, cacheKey(userID), raw, cacheTTL).Err()
		}
	}
	return c.JSON(body)
}

// CreateWatchlist creates a new empty watchlist.
func CreateWatchlist(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	var body watchlistInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Name = strings.TrimSpace(body.Name)
	if body.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "name boş olamaz"})
	}
	wl := models.Watchlist{UserID: userID, Name: body.Name}
	if err := config.DB.Create(&wl).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Liste oluşturulamadı"})
	}
	invalidate(userID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": true, "watchlist": wl})
}

// UpdateWatchlist renames an existing watchlist owned by the current user.
func UpdateWatchlist(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	id, perr := strconv.ParseUint(c.Params("id"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}
	var wl models.Watchlist
	if err := config.DB.First(&wl, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Liste bulunamadı"})
	}
	if wl.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Yetkisiz"})
	}
	var body watchlistInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Name = strings.TrimSpace(body.Name)
	if body.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "name boş olamaz"})
	}
	wl.Name = body.Name
	if err := config.DB.Save(&wl).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Güncelleme başarısız"})
	}
	invalidate(userID)
	return c.JSON(fiber.Map{"success": true, "watchlist": wl})
}

// DeleteWatchlist removes a watchlist (and cascades its assets).
func DeleteWatchlist(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	id, perr := strconv.ParseUint(c.Params("id"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}
	var wl models.Watchlist
	if err := config.DB.First(&wl, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Liste bulunamadı"})
	}
	if wl.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Yetkisiz"})
	}
	if err := config.DB.Delete(&wl).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Silme başarısız"})
	}
	invalidate(userID)
	return c.SendStatus(fiber.StatusNoContent)
}

// AddAsset attaches a symbol to a watchlist owned by the current user.
func AddAsset(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	listID, perr := strconv.ParseUint(c.Params("listId"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz listId"})
	}
	var wl models.Watchlist
	if err := config.DB.First(&wl, listID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Liste bulunamadı"})
	}
	if wl.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Yetkisiz"})
	}
	var body assetInput
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz istek"})
	}
	body.Symbol = strings.ToUpper(strings.TrimSpace(body.Symbol))
	if body.Symbol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "symbol boş olamaz"})
	}
	var existing models.WatchlistAsset
	if err := config.DB.
		Where("watchlist_id = ? AND symbol = ?", listID, body.Symbol).
		First(&existing).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"error": "Bu sembol zaten listede"})
	}
	asset := models.WatchlistAsset{WatchlistID: uint(listID), Symbol: body.Symbol}
	if err := config.DB.Create(&asset).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Eklenemedi"})
	}
	invalidate(userID)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": true, "asset": asset})
}
