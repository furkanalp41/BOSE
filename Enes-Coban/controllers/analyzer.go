package controllers

import (
	"context"
	"fmt"
	"strings"

	"stock-analyzer/models"
	"stock-analyzer/services/ai"
)

// Analyze builds the prompt, calls the AI provider, and parses the response.
func Analyze(ctx context.Context, req models.AnalysisReq, aiProvider ai.LLMProvider) (models.AnalysisItem, error) {
	prompt := buildPrompt(req)
	
	llmMessage, err := aiProvider.GenerateContent(ctx, prompt)
	if err != nil {
		return models.AnalysisItem{}, err
	}

	return parseResponse(req, llmMessage), nil
}

func buildPrompt(req models.AnalysisReq) string {
	var sb strings.Builder

	sb.WriteString("You are a professional financial advisor API. I will provide you a user's portfolio, watchlist, and risk preference. ")
	sb.WriteString("Analyze their risk alignment and provide a succinct recommendation.\n\n")

	sb.WriteString(fmt.Sprintf("User Risk Preference: %d/10 (0=Safest, 10=Riskiest)\n\n", req.Preference))

	sb.WriteString("Current Portfolio:\n")
	if len(req.Portfolio) == 0 {
		sb.WriteString("- Empty\n")
	} else {
		for stock, quantity := range req.Portfolio {
			sb.WriteString(fmt.Sprintf("- %d shares of %s\n", quantity, stock.String()))
		}
	}

	sb.WriteString("\nWatchlist:\n")
	if len(req.Watchlist) == 0 {
		sb.WriteString("- Empty\n")
	} else {
		for _, stock := range req.Watchlist {
			sb.WriteString(fmt.Sprintf("- %s\n", stock.String()))
		}
	}

	sb.WriteString(`
Please respond in the following format exactly (do not add any extra markdown beyond the requested):
ALIGNMENT_SCORE: [A number from 0-100 indicating how well their portfolio matches their risk preference. 100 means perfect match.]
ANALYSIS: [2-3 sentences evaluating their portfolio risk vs preference, and recommending actions from their watchlist.]
`)

	return sb.String()
}

func parseResponse(req models.AnalysisReq, llmMessage string) models.AnalysisItem {
	item := models.AnalysisItem{
		ID:         req.ID,
		Preference: req.Preference,
		Alignment:  0,
		Content:    "Failed to parse analysis.",
	}

	lines := strings.Split(strings.TrimSpace(llmMessage), "\n")
	var contentLines []string
	
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if strings.HasPrefix(line, "ALIGNMENT_SCORE:") {
			var score int8
			fmt.Sscanf(line, "ALIGNMENT_SCORE: %d", &score)
			item.Alignment = score
		} else if strings.HasPrefix(line, "ANALYSIS:") {
			contentLines = append(contentLines, strings.TrimPrefix(line, "ANALYSIS:"))
		} else if len(contentLines) > 0 && line != "" {
			contentLines = append(contentLines, line)
		}
	}

	if len(contentLines) > 0 {
		item.Content = strings.TrimSpace(strings.Join(contentLines, " "))
	} else {
		item.Content = llmMessage
	}

	return item
}
