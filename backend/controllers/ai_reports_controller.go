package controllers

import (
	"fmt"
	"math"
	"sort"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/ai"
	"github.com/uraniumz/bose/services/market"
)

// ── Portfolio Analysis ──────────────────────────────────────────────────────

func AnalyzePortfolio(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)
		requestID := fmt.Sprintf("pa-%d-%d", claims.UserID, time.Now().UnixMilli())

		advice, err := ai.GenerateAdvice(config.DB, engine, claims.UserID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		// Compute portfolio stats
		var positions []models.Position
		config.DB.Where("user_id = ?", claims.UserID).Find(&positions)

		categories := map[string]bool{}
		assets := market.BuildAssetCatalogue(engine)
		assetMap := map[string]market.Asset{}
		for _, a := range assets {
			assetMap[a.Symbol] = a
		}
		for _, p := range positions {
			if a, ok := assetMap[p.Symbol]; ok {
				categories[a.Category] = true
			}
		}

		divScore := len(categories) * 33
		if divScore > 100 {
			divScore = 100
		}

		riskScoreMap := map[string]float64{"LOW": 3.0, "MEDIUM": 5.5, "HIGH": 8.0}
		riskScore := riskScoreMap[advice.RiskProfile]
		if riskScore == 0 {
			riskScore = 5.0
		}

		var recs []string
		for _, r := range advice.Recommendations {
			recs = append(recs, fmt.Sprintf("%s %s: %s (Allocation: %.0f%%)", r.Action, r.Symbol, r.Reason, r.Allocation))
		}

		return c.JSON(fiber.Map{
			"alignment_score":      int(advice.Confidence),
			"overall_risk":         strings.ToLower(advice.RiskProfile),
			"portfolio_risk_score": riskScore,
			"diversification_score": divScore,
			"analysis_content":     advice.Summary,
			"recommendations":      recs,
			"model_used":           "bose-rules-engine-v1",
			"request_id":           requestID,
		})
	}
}

// ── Watchlist Analysis ──────────────────────────────────────────────────────

func AnalyzeWatchlist(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)
		requestID := fmt.Sprintf("wa-%d-%d", claims.UserID, time.Now().UnixMilli())

		var body struct {
			WatchlistName string `json:"watchlist_name"`
			Items         []struct {
				ID        int     `json:"id"`
				Name      string  `json:"name"`
				Price     float64 `json:"price"`
				RiskScore float64 `json:"risk_score"`
			} `json:"items"`
			AnalysisType string `json:"analysis_type"`
			Language     string `json:"language"`
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}

		var user models.User
		if err := config.DB.First(&user, claims.UserID).Error; err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "user not found")
		}

		assets := market.BuildAssetCatalogue(engine)
		assetMap := map[string]market.Asset{}
		for _, a := range assets {
			assetMap[a.Symbol] = a
		}

		type scoredItem struct {
			symbol string
			score  float64
			asset  market.Asset
		}
		var scored []scoredItem
		for _, item := range body.Items {
			a, ok := assetMap[item.Name]
			if !ok {
				a = market.Asset{Symbol: item.Name, Name: item.Name, Price: item.Price}
			}
			score := ai.CalculateScore(a, user.RiskLevel, user.InvestmentTerm)
			scored = append(scored, scoredItem{symbol: item.Name, score: score, asset: a})
		}
		sort.Slice(scored, func(i, j int) bool { return scored[i].score > scored[j].score })

		var itemAnalyses []fiber.Map
		topPick := ""
		for i, s := range scored {
			if i == 0 {
				topPick = s.symbol
			}

			signal := "TUT"
			if s.score > 80 {
				signal = "AL"
			} else if s.score > 60 {
				signal = "İZLE"
			} else if s.score < 40 {
				signal = "SAT"
			}

			confidence := math.Min(s.score, 95)
			action, reason, _ := ai.DecideAction(s.asset, s.score, 0, user.RiskLevel, user.InvestmentTerm)
			_ = action

			targetPrice := s.asset.Price * 1.05
			if signal == "SAT" {
				targetPrice = s.asset.Price * 0.95
			}

			itemAnalyses = append(itemAnalyses, fiber.Map{
				"symbol":       s.symbol,
				"signal":       signal,
				"summary":      reason,
				"confidence":   int(confidence),
				"target_price": math.Round(targetPrice*100) / 100,
			})
		}

		riskWarning := ""
		if user.RiskLevel == "HIGH" {
			riskWarning = "Your risk profile is set to HIGH. Consider diversifying to reduce exposure."
		}

		overallSummary := fmt.Sprintf(
			"Analysis of %d assets in '%s'. Based on your %s risk profile, the top opportunity is %s.",
			len(body.Items), body.WatchlistName, strings.ToLower(user.RiskLevel), topPick,
		)

		return c.JSON(fiber.Map{
			"watchlist_name":  body.WatchlistName,
			"top_pick":        topPick,
			"risk_warning":    riskWarning,
			"overall_summary": overallSummary,
			"item_analyses":   itemAnalyses,
			"model_used":      "bose-rules-engine-v1",
			"request_id":      requestID,
		})
	}
}

// ── Transaction Analysis ────────────────────────────────────────────────────

func AnalyzeTransactions(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)
		requestID := fmt.Sprintf("ta-%d-%d", claims.UserID, time.Now().UnixMilli())

		var body struct {
			Transactions []struct {
				Symbol     string  `json:"symbol"`
				TxType     string  `json:"tx_type"`
				Quantity   float64 `json:"quantity"`
				Price      float64 `json:"price"`
				ExecutedAt string  `json:"executed_at"`
			} `json:"transactions"`
			Language string `json:"language"`
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}

		txs := body.Transactions
		total := len(txs)
		var buyCount, sellCount int
		var totalBuyVol, totalSellVol float64
		symbolCounts := map[string]int{}

		for _, tx := range txs {
			vol := tx.Price * tx.Quantity
			t := strings.ToLower(tx.TxType)
			if strings.Contains(t, "buy") {
				buyCount++
				totalBuyVol += vol
			} else {
				sellCount++
				totalSellVol += vol
			}
			symbolCounts[tx.Symbol]++
		}

		mostTraded := ""
		maxCount := 0
		for sym, cnt := range symbolCounts {
			if cnt > maxCount {
				maxCount = cnt
				mostTraded = sym
			}
		}

		winRate := 0.0
		if total > 0 && sellCount > 0 {
			winRate = math.Min(float64(sellCount)/float64(total)+0.1, 1.0)
		}

		// Behavior patterns
		var patterns []fiber.Map

		if buyCount > sellCount*2 {
			patterns = append(patterns, fiber.Map{
				"pattern_name": "Aggressive Buying",
				"impact":       "nötr",
				"frequency":    buyCount,
				"description":  "You buy significantly more than you sell, accumulating positions over time.",
				"suggestion":   "Consider taking profits periodically to lock in gains.",
			})
		}

		if len(symbolCounts) == 1 && total > 3 {
			patterns = append(patterns, fiber.Map{
				"pattern_name": "Single Asset Focus",
				"impact":       "negatif",
				"frequency":    total,
				"description":  fmt.Sprintf("All your trades are concentrated in %s.", mostTraded),
				"suggestion":   "Diversify across asset classes to reduce portfolio risk.",
			})
		} else if len(symbolCounts) >= 3 {
			patterns = append(patterns, fiber.Map{
				"pattern_name": "Diversified Trading",
				"impact":       "pozitif",
				"frequency":    len(symbolCounts),
				"description":  fmt.Sprintf("You trade across %d different assets, showing good diversification.", len(symbolCounts)),
				"suggestion":   "Continue maintaining a balanced portfolio approach.",
			})
		}

		if total >= 10 {
			patterns = append(patterns, fiber.Map{
				"pattern_name": "Active Trader",
				"impact":       "pozitif",
				"frequency":    total,
				"description":  "You have a high trading frequency, indicating active market engagement.",
				"suggestion":   "Watch out for overtrading — ensure each trade has a clear thesis.",
			})
		}

		var recs []string
		if buyCount > 0 && sellCount == 0 {
			recs = append(recs, "Consider setting take-profit levels on your positions.")
		}
		if len(symbolCounts) < 3 && total > 5 {
			recs = append(recs, "Diversify your portfolio across more asset categories.")
		}
		recs = append(recs, "Review your trade timing patterns to optimize entry/exit points.")
		recs = append(recs, "Set stop-loss orders to manage downside risk.")

		analysisContent := fmt.Sprintf(
			"Over %d transactions, you executed %d buys ($%.0f volume) and %d sells ($%.0f volume). "+
				"Your most traded asset is %s with %d transactions. ",
			total, buyCount, totalBuyVol, sellCount, totalSellVol, mostTraded, maxCount,
		)
		if winRate > 0.5 {
			analysisContent += "Your win rate suggests a positive trading pattern."
		} else {
			analysisContent += "Consider refining your strategy to improve consistency."
		}

		return c.JSON(fiber.Map{
			"total_transactions":  total,
			"win_rate":            math.Round(winRate*1000) / 1000,
			"total_buy_volume":    math.Round(totalBuyVol*100) / 100,
			"most_traded_symbol":  mostTraded,
			"analysis_content":    analysisContent,
			"behavior_patterns":   patterns,
			"recommendations":     recs,
			"model_used":          "bose-rules-engine-v1",
			"request_id":          requestID,
		})
	}
}

// ── AI Chat ─────────────────────────────────────────────────────────────────

func AIChat(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)

		var body struct {
			Messages []struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"messages"`
			Language string `json:"language"`
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}

		if len(body.Messages) == 0 {
			return fiber.NewError(fiber.StatusBadRequest, "messages array is required")
		}

		lastMsg := body.Messages[len(body.Messages)-1].Content
		upper := strings.ToUpper(lastMsg)

		// Detect referenced symbols
		assets := market.BuildAssetCatalogue(engine)
		prices := engine.CurrentPrices()
		var referenced []string
		for _, a := range assets {
			if strings.Contains(upper, a.Symbol) {
				referenced = append(referenced, a.Symbol)
			}
		}

		// Generate advice for context
		advice, _ := ai.GenerateAdvice(config.DB, engine, claims.UserID)

		// Build reply
		var reply string
		if len(referenced) > 0 {
			var parts []string
			for _, sym := range referenced {
				if p, ok := prices[sym]; ok {
					parts = append(parts, fmt.Sprintf("**%s** is currently trading at $%.2f.", sym, p))
				}
			}
			reply = strings.Join(parts, " ")
			if advice != nil && len(advice.Recommendations) > 0 {
				for _, r := range advice.Recommendations {
					for _, sym := range referenced {
						if r.Symbol == sym {
							reply += fmt.Sprintf("\n\nRegarding %s: %s", r.Symbol, r.Reason)
						}
					}
				}
			}
		} else if advice != nil {
			reply = advice.Summary
			if len(advice.Recommendations) > 0 {
				reply += "\n\nHere are my current recommendations:\n"
				for _, r := range advice.Recommendations {
					reply += fmt.Sprintf("- **%s** %s: %s\n", r.Action, r.Symbol, r.Reason)
				}
			}
		} else {
			reply = "I can help you with market analysis, portfolio advice, and trading strategies. " +
				"Try asking about specific assets like BTC, ETH, AAPL, or NVDA, or ask for portfolio recommendations."
		}

		// Suggested actions from recommendations
		var actions []fiber.Map
		if advice != nil {
			for _, r := range advice.Recommendations {
				actionType := "analyze"
				if r.Action == "BUY" {
					actionType = "buy"
				} else if r.Action == "SELL" {
					actionType = "sell"
				}
				actions = append(actions, fiber.Map{
					"action_type": actionType,
					"symbol":      r.Symbol,
					"description": fmt.Sprintf("%s — suggested allocation %.0f%%", r.Reason, r.Allocation),
				})
			}
		}

		followUps := []string{
			"What's your view on my current portfolio?",
			"Which assets should I watch today?",
			"How can I reduce my portfolio risk?",
		}

		return c.JSON(fiber.Map{
			"reply":              reply,
			"referenced_symbols": referenced,
			"suggested_actions":  actions,
			"follow_up_questions": followUps,
		})
	}
}
