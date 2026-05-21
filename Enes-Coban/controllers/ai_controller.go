package controllers

import (
	"hash/fnv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// GetStatusReport returns a deterministic BUY/HOLD/SELL recommendation for
// the given symbol. The output is stable per symbol (hashed) so demos are
// reproducible. No LLM call.
func GetStatusReport(c *fiber.Ctx) error {
	symbol := strings.ToUpper(strings.TrimSpace(c.Params("assetSymbol")))
	if symbol == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "assetSymbol zorunlu"})
	}

	h := fnv.New32a()
	_, _ = h.Write([]byte(symbol))
	bucket := h.Sum32() % 3

	var (
		recommendation string
		sentiment      int
		text           string
	)
	switch bucket {
	case 0:
		recommendation = "BUY"
		sentiment = 70 + int(h.Sum32()%20)
		text = symbol + " teknik göstergeleri yukarı yönlü bir momentum işaret ediyor. Bu bir simülasyondur."
	case 1:
		recommendation = "HOLD"
		sentiment = 45 + int(h.Sum32()%15)
		text = symbol + " yatay bant içinde işlem görüyor, beklemek mantıklı görünüyor. Bu bir simülasyondur."
	default:
		recommendation = "SELL"
		sentiment = 20 + int(h.Sum32()%20)
		text = symbol + " aşırı alım bölgesinde, kısa vadeli düzeltme beklenebilir. Bu bir simülasyondur."
	}

	return c.JSON(fiber.Map{
		"success":        true,
		"symbol":         symbol,
		"recommendation": recommendation,
		"sentimentScore": sentiment,
		"analysisText":   text,
	})
}
