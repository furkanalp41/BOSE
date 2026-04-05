package controllers

import (
	"context"
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

func AnalyzePortfolio(engine *market.PriceEngine, providers *ai.ProviderChain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)
		requestID := fmt.Sprintf("pa-%d-%d", claims.UserID, time.Now().UnixMilli())

		advice, err := ai.GenerateAdvice(config.DB, engine, claims.UserID)
		if err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, err.Error())
		}

		var user models.User
		if err := config.DB.First(&user, claims.UserID).Error; err != nil {
			return fiber.NewError(fiber.StatusInternalServerError, "user not found")
		}

		var positions []models.Position
		config.DB.Where("user_id = ?", claims.UserID).Find(&positions)

		prices := engine.CurrentPrices()
		assets := market.BuildAssetCatalogue(engine)
		assetMap := map[string]market.Asset{}
		for _, a := range assets {
			assetMap[a.Symbol] = a
		}

		categories := map[string]bool{}
		var inPositions float64
		var holdingsSummary []fiber.Map
		for _, p := range positions {
			if a, ok := assetMap[p.Symbol]; ok {
				categories[a.Category] = true
				cp := prices[p.Symbol]
				mv := cp * p.Quantity
				inPositions += mv
				pnl := mv - (p.AvgEntryPrice * p.Quantity)
				holdingsSummary = append(holdingsSummary, fiber.Map{
					"symbol":       p.Symbol,
					"quantity":     p.Quantity,
					"avgEntry":     p.AvgEntryPrice,
					"currentPrice": cp,
					"marketValue":  math.Round(mv*100) / 100,
					"pnl":          math.Round(pnl*100) / 100,
				})
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

		totalValue := user.VirtualBalance + inPositions

		// Try LLM-enhanced analysis
		modelUsed := "bose-rules-engine-v1"
		analysisContent := advice.Summary

		if providers != nil {
			prompt := buildPortfolioPrompt(user, positions, holdingsSummary, prices, totalValue)
			ctx, cancel := context.WithTimeout(c.Context(), 30*time.Second)
			defer cancel()
			llmResult, llmModel, _ := providers.Analyze(ctx, "portfolio", prompt)
			if llmResult != "" {
				analysisContent = llmResult
				modelUsed = llmModel
			}
		}

		return c.JSON(fiber.Map{
			"alignment_score":       int(advice.Confidence),
			"overall_risk":          strings.ToLower(advice.RiskProfile),
			"portfolio_risk_score":  riskScore,
			"diversification_score": divScore,
			"analysis_content":      analysisContent,
			"recommendations":       recs,
			"holdings":              holdingsSummary,
			"balance":               user.VirtualBalance,
			"total_value":           math.Round(totalValue*100) / 100,
			"risk_level":            user.RiskLevel,
			"investment_term":       user.InvestmentTerm,
			"model_used":            modelUsed,
			"request_id":            requestID,
		})
	}
}

func buildPortfolioPrompt(user models.User, positions []models.Position, holdings []fiber.Map, prices map[string]float64, totalValue float64) string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("User Profile: Risk Level=%s, Investment Term=%s, Balance=$%.2f, Total Portfolio Value=$%.2f\n\n",
		user.RiskLevel, user.InvestmentTerm, user.VirtualBalance, totalValue))

	if len(holdings) > 0 {
		sb.WriteString("Current Holdings:\n")
		for _, h := range holdings {
			sb.WriteString(fmt.Sprintf("- %s: %.4f units, Avg Entry: $%.2f, Current: $%.2f, Market Value: $%.2f, P&L: $%.2f\n",
				h["symbol"], h["quantity"], h["avgEntry"], h["currentPrice"], h["marketValue"], h["pnl"]))
		}
	} else {
		sb.WriteString("No current holdings.\n")
	}

	sb.WriteString("\nProvide a concise portfolio analysis covering: risk assessment, diversification, and 2-3 actionable recommendations.")
	return sb.String()
}

// ── Watchlist Analysis ──────────────────────────────────────────────────────

func AnalyzeWatchlist(engine *market.PriceEngine, providers *ai.ProviderChain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)
		requestID := fmt.Sprintf("wa-%d-%d", claims.UserID, time.Now().UnixMilli())

		var body struct {
			WatchlistID   uint   `json:"watchlist_id"`
			WatchlistName string `json:"watchlist_name"`
			Items         []struct {
				Name  string  `json:"name"`
				Price float64 `json:"price"`
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
		prices := engine.CurrentPrices()

		type analyzeItem struct {
			symbol string
			price  float64
		}
		var items []analyzeItem
		watchlistName := body.WatchlistName

		if body.WatchlistID > 0 {
			var wl models.Watchlist
			if err := config.DB.Preload("Items").Where("id = ? AND user_id = ?", body.WatchlistID, claims.UserID).First(&wl).Error; err == nil {
				watchlistName = wl.Name
				for _, item := range wl.Items {
					p := prices[item.Symbol]
					items = append(items, analyzeItem{symbol: item.Symbol, price: p})
				}
			}
		}

		if len(items) == 0 && len(body.Items) > 0 {
			for _, item := range body.Items {
				p := prices[item.Name]
				if p == 0 {
					p = item.Price
				}
				items = append(items, analyzeItem{symbol: item.Name, price: p})
			}
		}

		if len(items) == 0 {
			return fiber.NewError(fiber.StatusBadRequest, "no items to analyze — provide a watchlist_id or items array")
		}

		type scoredItem struct {
			symbol string
			score  float64
			asset  market.Asset
		}
		var scored []scoredItem
		for _, item := range items {
			a, ok := assetMap[item.symbol]
			if !ok {
				a = market.Asset{Symbol: item.symbol, Name: item.symbol, Price: item.price}
			}
			score := ai.CalculateScore(a, user.RiskLevel, user.InvestmentTerm)
			scored = append(scored, scoredItem{symbol: item.symbol, score: score, asset: a})
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
			_, reason, _ := ai.DecideAction(s.asset, s.score, 0, user.RiskLevel, user.InvestmentTerm)

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

		if watchlistName == "" {
			watchlistName = "Watchlist"
		}

		// Try LLM-enhanced summary
		modelUsed := "bose-rules-engine-v1"
		overallSummary := fmt.Sprintf(
			"Analysis of %d assets in '%s'. Based on your %s risk profile, the top opportunity is %s.",
			len(items), watchlistName, strings.ToLower(user.RiskLevel), topPick,
		)

		if providers != nil {
			prompt := buildWatchlistPrompt(user, itemAnalyses, watchlistName)
			ctx, cancel := context.WithTimeout(c.Context(), 30*time.Second)
			defer cancel()
			llmResult, llmModel, _ := providers.Analyze(ctx, "watchlist", prompt)
			if llmResult != "" {
				overallSummary = llmResult
				modelUsed = llmModel
			}
		}

		return c.JSON(fiber.Map{
			"watchlist_name":  watchlistName,
			"top_pick":        topPick,
			"risk_warning":    riskWarning,
			"overall_summary": overallSummary,
			"item_analyses":   itemAnalyses,
			"model_used":      modelUsed,
			"request_id":      requestID,
		})
	}
}

func buildWatchlistPrompt(user models.User, itemAnalyses []fiber.Map, name string) string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("Watchlist: %s | User Risk: %s | Term: %s\n\nAssets:\n", name, user.RiskLevel, user.InvestmentTerm))
	for _, item := range itemAnalyses {
		sb.WriteString(fmt.Sprintf("- %s: Signal=%s, Confidence=%v%%, Target=$%v\n",
			item["symbol"], item["signal"], item["confidence"], item["target_price"]))
	}
	sb.WriteString("\nProvide a brief analysis of this watchlist with buy/sell signals and a top pick recommendation.")
	return sb.String()
}

// ── Transaction Analysis ────────────────────────────────────────────────────

func AnalyzeTransactions(engine *market.PriceEngine, providers *ai.ProviderChain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)
		requestID := fmt.Sprintf("ta-%d-%d", claims.UserID, time.Now().UnixMilli())

		var trades []models.Trade
		config.DB.Where("user_id = ?", claims.UserID).Order("created_at desc").Limit(100).Find(&trades)

		if len(trades) == 0 {
			return c.JSON(fiber.Map{
				"total_transactions": 0,
				"win_rate":           0,
				"total_buy_volume":   0,
				"most_traded_symbol": "",
				"analysis_content":   "No transactions found. Start trading to get AI-powered behavioral analysis.",
				"behavior_patterns":  []fiber.Map{},
				"recommendations":    []string{"Make your first trade to unlock transaction analysis."},
				"model_used":         "bose-rules-engine-v1",
				"request_id":         requestID,
			})
		}

		total := len(trades)
		var buyCount, sellCount int
		var totalBuyVol, totalSellVol float64
		symbolCounts := map[string]int{}

		for _, t := range trades {
			vol := t.Price * t.Quantity
			if t.Side == "BUY" {
				buyCount++
				totalBuyVol += vol
			} else {
				sellCount++
				totalSellVol += vol
			}
			symbolCounts[t.Symbol]++
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

		// Build rules-engine analysis content
		modelUsed := "bose-rules-engine-v1"
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

		// Try LLM-enhanced analysis
		if providers != nil {
			prompt := buildTransactionPrompt(trades, buyCount, sellCount, totalBuyVol, totalSellVol, mostTraded, symbolCounts)
			ctx, cancel := context.WithTimeout(c.Context(), 30*time.Second)
			defer cancel()
			llmResult, llmModel, _ := providers.Analyze(ctx, "transactions", prompt)
			if llmResult != "" {
				analysisContent = llmResult
				modelUsed = llmModel
			}
		}

		return c.JSON(fiber.Map{
			"total_transactions": total,
			"win_rate":           math.Round(winRate*1000) / 1000,
			"total_buy_volume":   math.Round(totalBuyVol*100) / 100,
			"most_traded_symbol": mostTraded,
			"analysis_content":   analysisContent,
			"behavior_patterns":  patterns,
			"recommendations":    recs,
			"model_used":         modelUsed,
			"request_id":         requestID,
		})
	}
}

func buildTransactionPrompt(trades []models.Trade, buyCount, sellCount int, totalBuyVol, totalSellVol float64, mostTraded string, symbolCounts map[string]int) string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("Trading Summary: %d total trades, %d buys ($%.0f volume), %d sells ($%.0f volume)\n",
		len(trades), buyCount, totalBuyVol, sellCount, totalSellVol))
	sb.WriteString(fmt.Sprintf("Most traded: %s (%d trades)\n", mostTraded, symbolCounts[mostTraded]))
	sb.WriteString(fmt.Sprintf("Unique symbols: %d\n\n", len(symbolCounts)))
	sb.WriteString("Recent trades:\n")
	limit := 20
	if len(trades) < limit {
		limit = len(trades)
	}
	for _, t := range trades[:limit] {
		sb.WriteString(fmt.Sprintf("- %s %s: %.4f @ $%.2f = $%.2f (%s)\n",
			t.Side, t.Symbol, t.Quantity, t.Price, t.Total, t.CreatedAt.Format("2006-01-02")))
	}
	sb.WriteString("\nProvide a concise behavioral analysis covering: trading patterns, risk assessment, and 2-3 improvement suggestions.")
	return sb.String()
}

// ── AI Chat ─────────────────────────────────────────────────────────────────

func AIChat(engine *market.PriceEngine, providers *ai.ProviderChain) fiber.Handler {
	return func(c *fiber.Ctx) error {
		claims := c.Locals("claims").(*middleware.Claims)

		var body struct {
			Messages []struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"messages"`
			Message  string `json:"message"`
			Language string `json:"language"`
		}
		if err := c.BodyParser(&body); err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid request body")
		}

		// Support {"message": "..."} shorthand — wrap into messages array
		if len(body.Messages) == 0 && body.Message != "" {
			body.Messages = append(body.Messages, struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			}{Role: "user", Content: body.Message})
		}

		if len(body.Messages) == 0 {
			return fiber.NewError(fiber.StatusBadRequest, "messages array or message field is required")
		}

		lastMsg := body.Messages[len(body.Messages)-1].Content
		upper := strings.ToUpper(lastMsg)

		assets := market.BuildAssetCatalogue(engine)
		prices := engine.CurrentPrices()
		var referenced []string
		for _, a := range assets {
			if strings.Contains(upper, a.Symbol) {
				referenced = append(referenced, a.Symbol)
			}
		}

		advice, _ := ai.GenerateAdvice(config.DB, engine, claims.UserID)

		// Try LLM chat first
		var reply string
		modelUsed := "bose-rules-engine-v1"

		if providers != nil {
			chatMessages := []ai.ChatMessage{
				{Role: "system", Content: buildChatSystemPrompt(assets, prices, advice)},
			}
			for _, m := range body.Messages {
				chatMessages = append(chatMessages, ai.ChatMessage{Role: m.Role, Content: m.Content})
			}
			ctx, cancel := context.WithTimeout(c.Context(), 30*time.Second)
			defer cancel()
			llmReply, llmModel, _ := providers.ChatCompletion(ctx, chatMessages)
			if llmReply != "" {
				reply = llmReply
				modelUsed = llmModel
			}
		}

		// Fallback to rules engine
		if reply == "" {
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
		}

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
			"reply":               reply,
			"referenced_symbols":  referenced,
			"suggested_actions":   actions,
			"follow_up_questions": followUps,
			"model_used":          modelUsed,
		})
	}
}

func buildChatSystemPrompt(assets []market.Asset, prices map[string]float64, advice *ai.Advice) string {
	var sb strings.Builder
	sb.WriteString("You are BOSE AI, a financial advisor for a virtual trading platform. You provide market analysis and trading advice.\n\n")
	sb.WriteString("Current market prices:\n")
	for _, a := range assets {
		p := prices[a.Symbol]
		sb.WriteString(fmt.Sprintf("- %s (%s): $%.2f, 24h: %.2f%%, Category: %s\n", a.Symbol, a.Name, p, a.Change24h, a.Category))
	}
	if advice != nil {
		sb.WriteString(fmt.Sprintf("\nUser risk profile: %s, Horizon: %s\n", advice.RiskProfile, advice.Horizon))
		if len(advice.Recommendations) > 0 {
			sb.WriteString("Current recommendations:\n")
			for _, r := range advice.Recommendations {
				sb.WriteString(fmt.Sprintf("- %s %s: %s (%.0f%% allocation)\n", r.Action, r.Symbol, r.Reason, r.Allocation))
			}
		}
	}
	sb.WriteString("\nBe concise, use markdown formatting, and provide actionable advice.")
	return sb.String()
}
