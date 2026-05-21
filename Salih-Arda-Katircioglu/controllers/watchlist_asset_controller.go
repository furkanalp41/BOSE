package controllers

import (
	"strconv"
	"strings"

	"bose-salih/config"
	"bose-salih/middlewares"
	"bose-salih/models"

	"github.com/gofiber/fiber/v2"
)

// RemoveAssetFromWatchlist deletes one symbol from a watchlist owned by
// the current user. Reads watchlists/watchlist_assets owned by the Enes
// service; the schema is shared via Postgres.
func RemoveAssetFromWatchlist(c *fiber.Ctx) error {
	userID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	listID, perr := strconv.ParseUint(c.Params("listId"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz listId"})
	}
	symbol := strings.ToUpper(strings.TrimSpace(c.Params("assetSymbol")))
	if symbol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "assetSymbol zorunlu"})
	}

	var wl models.Watchlist
	if err := config.DB.First(&wl, listID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Liste bulunamadı"})
	}
	if wl.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Bu liste size ait değil"})
	}

	result := config.DB.
		Where("watchlist_id = ? AND symbol = ?", listID, symbol).
		Delete(&models.WatchlistAsset{})
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Silinemedi"})
	}
	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Sembol listede yok"})
	}
	return c.SendStatus(fiber.StatusNoContent)
}
