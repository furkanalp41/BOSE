package ai

import (
	"fmt"
	"math"
	"sort"

	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/market"
	"gorm.io/gorm"
)

// Advice represents a structured AI recommendation.
type Advice struct {
	Summary       string            `json:"summary"`
	Recommendations []Recommendation `json:"recommendations"`
	RiskProfile   string            `json:"riskProfile"`
	Horizon       string            `json:"horizon"`
	Confidence    float64           `json:"confidence"`
}

// Recommendation is a single asset suggestion.
type Recommendation struct {
	Symbol     string  `json:"symbol"`
	Name       string  `json:"name"`
	Action     string  `json:"action"` // BUY, SELL, HOLD
	Reason     string  `json:"reason"`
	Allocation float64 `json:"allocation"` // suggested % of portfolio
}

// GenerateAdvice produces a rules-based investment recommendation.
func GenerateAdvice(db *gorm.DB, engine *market.PriceEngine, userID uint) (*Advice, error) {
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return nil, fmt.Errorf("user not found")
	}

	var positions []models.Position
	db.Where("user_id = ?", userID).Find(&positions)

	assets := market.BuildAssetCatalogue(engine)
	prices := engine.CurrentPrices()

	// Build a map of current holdings
	holdings := make(map[string]float64)
	for _, p := range positions {
		holdings[p.Symbol] = p.Quantity * prices[p.Symbol]
	}

	// Categorize assets by volatility and category
	type scoredAsset struct {
		asset market.Asset
		score float64
	}

	var scored []scoredAsset
	for _, a := range assets {
		score := CalculateScore(a, user.RiskLevel, user.InvestmentTerm)
		scored = append(scored, scoredAsset{asset: a, score: score})
	}

	sort.Slice(scored, func(i, j int) bool {
		return scored[i].score > scored[j].score
	})

	// Generate recommendations based on risk profile
	maxRecs := 3
	var recs []Recommendation
	totalAlloc := 0.0

	for _, sa := range scored {
		if len(recs) >= maxRecs {
			break
		}

		holdingValue := holdings[sa.asset.Symbol]
		portfolioTotal := user.VirtualBalance
		for _, v := range holdings {
			portfolioTotal += v
		}
		holdingPct := 0.0
		if portfolioTotal > 0 {
			holdingPct = (holdingValue / portfolioTotal) * 100
		}

		action, reason, alloc := DecideAction(sa.asset, sa.score, holdingPct, user.RiskLevel, user.InvestmentTerm)
		if alloc > 0 {
			totalAlloc += alloc
			recs = append(recs, Recommendation{
				Symbol:     sa.asset.Symbol,
				Name:       sa.asset.Name,
				Action:     action,
				Reason:     reason,
				Allocation: math.Round(alloc*10) / 10,
			})
		}
	}

	confidence := calculateConfidence(user.RiskLevel, len(positions))

	summary := generateSummary(user.RiskLevel, user.InvestmentTerm, recs)

	return &Advice{
		Summary:         summary,
		Recommendations: recs,
		RiskProfile:     user.RiskLevel,
		Horizon:         user.InvestmentTerm,
		Confidence:      confidence,
	}, nil
}

func CalculateScore(a market.Asset, riskLevel, term string) float64 {
	score := 50.0

	switch riskLevel {
	case "LOW":
		// Prefer large-cap, low volatility
		if a.Category == "nasdaq" {
			score += 20
		}
		if a.Category == "bist" {
			score += 10
		}
		if a.MarketCap > 1e12 {
			score += 15
		}
		if a.Change24h > 0 && a.Change24h < 2 {
			score += 10
		}
	case "MEDIUM":
		// Balanced approach
		if a.Change24h > 0 {
			score += 15
		}
		if a.MarketCap > 100e9 {
			score += 10
		}
		score += math.Abs(a.Change24h) * 2
	case "HIGH":
		// Prefer volatile assets with momentum
		if a.Category == "crypto" {
			score += 20
		}
		score += math.Abs(a.Change24h) * 5
		if a.Change24h > 2 {
			score += 15
		}
	}

	switch term {
	case "SHORT_TERM":
		score += math.Abs(a.Change24h) * 3
	case "LONG_TERM":
		if a.MarketCap > 500e9 {
			score += 15
		}
	}

	return score
}

func DecideAction(a market.Asset, score, holdingPct float64, riskLevel, term string) (string, string, float64) {
	if holdingPct > 30 {
		return "HOLD", fmt.Sprintf("You already have significant exposure to %s. Consider diversifying.", a.Symbol), 0
	}

	if score > 80 {
		alloc := 25.0
		if riskLevel == "LOW" {
			alloc = 15.0
		} else if riskLevel == "HIGH" {
			alloc = 35.0
		}

		reason := ""
		switch {
		case a.Change24h > 2:
			reason = fmt.Sprintf("%s shows strong bullish momentum (+%.1f%% today). Good entry for %s strategy.", a.Name, a.Change24h, formatTerm(term))
		case a.MarketCap > 1e12:
			reason = fmt.Sprintf("%s is a blue-chip asset with $%.0fT market cap. Stable choice for capital preservation.", a.Name, a.MarketCap/1e12)
		default:
			reason = fmt.Sprintf("%s has favorable metrics for your %s risk profile.", a.Name, riskLevel)
		}

		return "BUY", reason, alloc
	}

	if score > 60 {
		return "BUY", fmt.Sprintf("%s offers moderate opportunity. Consider a small allocation.", a.Name), 10.0
	}

	return "HOLD", fmt.Sprintf("%s doesn't strongly match your current strategy. Monitor for changes.", a.Name), 0
}

func calculateConfidence(riskLevel string, positionCount int) float64 {
	base := 70.0
	switch riskLevel {
	case "LOW":
		base = 80.0
	case "HIGH":
		base = 60.0
	}
	if positionCount > 0 {
		base += 5.0 // more data = better suggestions
	}
	if base > 95 {
		base = 95
	}
	return base
}

func generateSummary(riskLevel, term string, recs []Recommendation) string {
	if len(recs) == 0 {
		return "Based on current market conditions, I recommend holding your current positions and waiting for better entry points."
	}

	riskDesc := map[string]string{
		"LOW":    "conservative",
		"MEDIUM": "balanced",
		"HIGH":   "aggressive",
	}
	termDesc := map[string]string{
		"SHORT_TERM":  "short-term",
		"MEDIUM_TERM": "medium-term",
		"LONG_TERM":   "long-term",
	}

	buyCount := 0
	for _, r := range recs {
		if r.Action == "BUY" {
			buyCount++
		}
	}

	return fmt.Sprintf(
		"Based on your %s risk profile and %s investment horizon, I've identified %d opportunities. The market conditions suggest %s positioning with focus on %s assets.",
		riskDesc[riskLevel],
		termDesc[term],
		buyCount,
		riskDesc[riskLevel],
		getCategoryFocus(riskLevel),
	)
}

func getCategoryFocus(riskLevel string) string {
	switch riskLevel {
	case "LOW":
		return "large-cap stock"
	case "HIGH":
		return "cryptocurrency"
	default:
		return "diversified"
	}
}

func formatTerm(term string) string {
	switch term {
	case "SHORT_TERM":
		return "short-term"
	case "LONG_TERM":
		return "long-term"
	default:
		return "medium-term"
	}
}
