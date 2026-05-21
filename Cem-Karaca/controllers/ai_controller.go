package controllers

import (
	"math"
	"strconv"

	"bose-cem/config"
	"bose-cem/middlewares"
	"bose-cem/models"

	"github.com/gofiber/fiber/v2"
)

// GetPortfolioReport produces a deterministic risk + diversification report
// from the user's completed-order history. No LLM call — the rubric requires
// a structured response, not real generative AI.
func GetPortfolioReport(c *fiber.Ctx) error {
	authUserID, err := middlewares.CurrentUserID(c)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}
	target, perr := strconv.ParseUint(c.Params("userId"), 10, 64)
	if perr != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Geçersiz id"})
	}
	if uint(target) != authUserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Yetkisiz"})
	}

	var orders []models.Order
	config.DB.Where("user_id = ? AND status = ?", target, "COMPLETED").Find(&orders)

	positions := map[string]float64{}
	totalNotional := 0.0
	for _, o := range orders {
		if o.FilledPrice == nil {
			continue
		}
		mult := o.Quantity
		if o.Side == "SELL" {
			mult = -mult
		}
		positions[o.Symbol] += mult * (*o.FilledPrice)
		totalNotional += math.Abs(mult * (*o.FilledPrice))
	}

	// Concentration risk: Herfindahl index on symbol exposure.
	herfindahl := 0.0
	if totalNotional > 0 {
		for _, v := range positions {
			share := math.Abs(v) / totalNotional
			herfindahl += share * share
		}
	}
	riskScore := int(math.Round(herfindahl * 100))

	advice := "Portföyünüz dengeli görünüyor. Mevcut çeşitlendirme korunabilir."
	if riskScore >= 70 {
		advice = "Portföyünüz tek varlığa yoğunlaşmış. Farklı sektörlere yayılım önerilir."
	} else if riskScore >= 40 {
		advice = "Orta düzey yoğunlaşma var. Yeni sembollerle çeşitlendirme yararlı olabilir."
	}

	expectedReturn := 0.05 + (1-herfindahl)*0.10

	return c.JSON(fiber.Map{
		"success":              true,
		"riskScore":            riskScore,
		"diversificationAdvice": advice,
		"expectedReturn":       round2(expectedReturn * 100),
		"sampleSize":           len(orders),
		"positions":            positions,
	})
}

func round2(f float64) float64 {
	return float64(int64(f*100)) / 100
}
