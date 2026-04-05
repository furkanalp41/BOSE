package controllers

import (
	"fmt"
	"strings"

	"stock-analyzer/models"
)

// ══════════════════════════════════════════════════════════════════
// Her AI analiz tipi için prompt builder fonksiyonları.
// Mevcut analyzer.go'daki buildPrompt eski endpoint için kalıyor.
// ══════════════════════════════════════════════════════════════════

// languageInstruction returns the language instruction fragment based on language code.
func languageInstruction(lang string) string {
	if lang == "en" {
		return "Respond in English."
	}
	return "Yanıtını Türkçe olarak ver."
}

// depthInstruction returns analysis depth hint.
func depthInstruction(depth string) string {
	switch depth {
	case "brief":
		return "Keep responses very brief (2-3 sentences max)."
	case "detailed":
		return "Provide a detailed, in-depth analysis with data-driven reasoning."
	default:
		return "Provide a standard-length analysis."
	}
}

// ──── Portföy Analizi Prompt ─────────────────────────────────────

func BuildPortfolioPrompt(req models.PortfolioAnalysisReq) string {
	var sb strings.Builder

	sb.WriteString("You are a professional financial advisor API. ")
	sb.WriteString(languageInstruction(req.Language))
	sb.WriteString(" ")
	sb.WriteString(depthInstruction(req.AnalysisDepth))
	sb.WriteString("\n\n")

	sb.WriteString(fmt.Sprintf("User Risk Preference: %d/10 (0=Safest, 10=Riskiest)\n\n",
		req.UserContext.RiskPreference))

	sb.WriteString("Current Portfolio:\n")
	if len(req.Holdings) == 0 {
		sb.WriteString("- Empty\n")
	} else {
		for _, h := range req.Holdings {
			line := fmt.Sprintf("- %d shares of %s", h.Quantity, h.Stock.String())
			if h.AvgBuyPrice != nil {
				line += fmt.Sprintf(" (avg buy: $%.2f)", *h.AvgBuyPrice)
			}
			sb.WriteString(line + "\n")
		}
	}

	sb.WriteString(`
Please respond in the following JSON format exactly (no markdown wrapping):
{
  "alignment_score": <0-100>,
  "overall_risk": "<low|medium|high|very_high>",
  "portfolio_risk_score": <0.0-10.0>,
  "analysis_content": "<your analysis text>",
  "recommendations": ["<rec1>", "<rec2>"],
  "diversification_score": <0-100>
}
`)

	return sb.String()
}

// ──── Watchlist Analizi Prompt ────────────────────────────────────

func BuildWatchlistPrompt(req models.WatchlistAnalysisReq) string {
	var sb strings.Builder

	sb.WriteString("You are a professional financial analyst API. ")
	sb.WriteString(languageInstruction(req.Language))
	sb.WriteString(" ")
	sb.WriteString(depthInstruction(req.AnalysisDepth))
	sb.WriteString("\n\n")

	analysisType := req.AnalysisType
	if analysisType == "" {
		analysisType = "both"
	}
	sb.WriteString(fmt.Sprintf("Analysis Type: %s\n", analysisType))
	sb.WriteString(fmt.Sprintf("User Risk Preference: %d/10\n\n",
		req.UserContext.RiskPreference))

	if req.WatchlistName != "" {
		sb.WriteString(fmt.Sprintf("Watchlist Name: %s\n", req.WatchlistName))
	}

	sb.WriteString("Watchlist Items:\n")
	for _, item := range req.Items {
		sb.WriteString(fmt.Sprintf("- %s\n", item.String()))
	}

	sb.WriteString(`
Please respond in the following JSON format exactly (no markdown wrapping):
{
  "overall_summary": "<general assessment>",
  "item_analyses": [
    {
      "symbol": "<SYMBOL>",
      "risk_level": "<low|medium|high|very_high>",
      "signal": "<AL|SAT|TUT|İZLE>",
      "confidence": <0-100>,
      "summary": "<brief analysis>"
    }
  ],
  "top_pick": "<best symbol or empty>",
  "risk_warning": "<warning or empty>"
}
`)

	return sb.String()
}

// ──── İşlem Geçmişi Analizi Prompt ───────────────────────────────

func BuildTransactionPrompt(req models.TransactionAnalysisReq) string {
	var sb strings.Builder

	sb.WriteString("You are a professional trading behavior analyst API. ")
	sb.WriteString(languageInstruction(req.Language))
	sb.WriteString(" ")
	sb.WriteString(depthInstruction(req.AnalysisDepth))
	sb.WriteString("\n\n")

	sb.WriteString(fmt.Sprintf("User Risk Preference: %d/10\n",
		req.UserContext.RiskPreference))

	if req.PeriodLabel != "" {
		sb.WriteString(fmt.Sprintf("Analysis Period: %s\n", req.PeriodLabel))
	}
	if len(req.FocusAreas) > 0 {
		sb.WriteString(fmt.Sprintf("Focus Areas: %s\n", strings.Join(req.FocusAreas, ", ")))
	}

	sb.WriteString("\nTransaction History:\n")
	for _, tx := range req.Transactions {
		sb.WriteString(fmt.Sprintf("- %s %s %d @ $%.2f on %s\n",
			strings.ToUpper(tx.TxType), tx.Symbol, tx.Quantity, tx.Price, tx.ExecutedAt))
	}

	sb.WriteString(`
Please respond in the following JSON format exactly (no markdown wrapping):
{
  "total_transactions": <count>,
  "total_buy_volume": <amount>,
  "total_sell_volume": <amount>,
  "win_rate": <0-100 or null>,
  "analysis_content": "<overall analysis>",
  "behavior_patterns": [
    {
      "pattern_name": "<name>",
      "description": "<desc>",
      "frequency": <count>,
      "impact": "<pozitif|negatif|nötr>",
      "suggestion": "<improvement advice>"
    }
  ],
  "recommendations": ["<rec1>", "<rec2>"],
  "most_traded_symbol": "<symbol>"
}
`)

	return sb.String()
}

// ──── AI Sohbet (Chat) Prompt ────────────────────────────────────

func BuildChatPrompt(req models.ChatReq) string {
	var sb strings.Builder

	sb.WriteString("You are an AI financial assistant for a stock/crypto simulation platform. ")
	sb.WriteString(languageInstruction(req.Language))
	sb.WriteString("\n\n")

	sb.WriteString(fmt.Sprintf("User Risk Preference: %d/10\n\n",
		req.UserContext.RiskPreference))

	// Portföy bağlamı
	if len(req.PortfolioSummary) > 0 {
		sb.WriteString("User's Current Portfolio:\n")
		for _, h := range req.PortfolioSummary {
			sb.WriteString(fmt.Sprintf("- %d shares of %s\n", h.Quantity, h.Stock.String()))
		}
		sb.WriteString("\n")
	}

	// Watchlist bağlamı
	if len(req.WatchlistSummary) > 0 {
		sb.WriteString("User's Watchlist:\n")
		for _, item := range req.WatchlistSummary {
			sb.WriteString(fmt.Sprintf("- %s\n", item.String()))
		}
		sb.WriteString("\n")
	}

	// Sohbet geçmişi
	sb.WriteString("Conversation:\n")
	for _, msg := range req.Messages {
		sb.WriteString(fmt.Sprintf("[%s]: %s\n", msg.Role, msg.Content))
	}

	sb.WriteString(`
Please respond in the following JSON format exactly (no markdown wrapping):
{
  "reply": "<your response to the user>",
  "referenced_symbols": ["<SYM1>", "<SYM2>"],
  "suggested_actions": [
    {
      "action_type": "<buy|sell|add_to_watchlist|analyze>",
      "symbol": "<SYMBOL>",
      "description": "<what to do>",
      "confidence": <0-100>
    }
  ],
  "follow_up_questions": ["<q1>", "<q2>"],
  "context_used": <true|false>
}
`)

	return sb.String()
}
