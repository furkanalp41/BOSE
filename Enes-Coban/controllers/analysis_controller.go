package controllers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"stock-analyzer/models"
	"stock-analyzer/services/ai"
)

type AnalysisController struct {
	provider ai.LLMProvider
}

func NewAnalysisController(provider ai.LLMProvider) *AnalysisController {
	return &AnalysisController{provider: provider}
}

// ──── Eski Endpoint (backward compat) ────────────────────────────

// POST /ai/reports/portfolio/legacy
func (c *AnalysisController) AnalyzePortfolio(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.AnalysisReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	res, err := Analyze(r.Context(), req, c.provider)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

// GET /ai/reports/portfolio/test
func (c *AnalysisController) RunTestAnalysis(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	persons := models.GetTestData()
	var results []models.AnalysisItem

	for _, p := range persons {
		req := models.AnalysisReq{
			ID:         p.ID,
			Preference: p.Preference,
			Portfolio:  p.Portfolio,
			Watchlist:  p.Watchlist,
		}

		res, err := Analyze(r.Context(), req, c.provider)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		results = append(results, res)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}

// ══════════════════════════════════════════════════════════════════
// Yeni Pydantic Uyumlu AI Endpoint'leri
// ══════════════════════════════════════════════════════════════════

// jsonError writes a JSON error response.
func jsonError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

// generateRequestID creates a simple unique request ID.
func generateRequestID() string {
	return fmt.Sprintf("req_%d", randSeq())
}

// Simple counter-based ID (no external deps needed)
var reqCounter int64

func randSeq() int64 {
	reqCounter++
	return reqCounter
}

// ──── POST /ai/reports/portfolio ─────────────────────────────────

func (c *AnalysisController) AnalyzePortfolioV2(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.PortfolioAnalysisReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if len(req.Holdings) == 0 {
		jsonError(w, "Holdings cannot be empty", http.StatusBadRequest)
		return
	}

	prompt := BuildPortfolioPrompt(req)
	llmMessage, err := c.provider.GenerateContent(r.Context(), prompt)
	if err != nil {
		jsonError(w, "AI provider error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// AI'dan gelen JSON yanıtı parse et
	var res models.PortfolioAnalysisRes
	if err := json.Unmarshal([]byte(cleanJSONResponse(llmMessage)), &res); err != nil {
		// Parse başarısızsa raw yanıtı content olarak dön
		res = models.PortfolioAnalysisRes{
			AnalysisContent: llmMessage,
		}
	}
	res.RequestID = generateRequestID()
	res.ModelUsed = "gemini-2.5-flash"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

// ──── POST /ai/reports/watchlist ─────────────────────────────────

func (c *AnalysisController) AnalyzeWatchlist(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.WatchlistAnalysisReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if len(req.Items) == 0 {
		jsonError(w, "Watchlist items cannot be empty", http.StatusBadRequest)
		return
	}

	prompt := BuildWatchlistPrompt(req)
	llmMessage, err := c.provider.GenerateContent(r.Context(), prompt)
	if err != nil {
		jsonError(w, "AI provider error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var res models.WatchlistAnalysisRes
	if err := json.Unmarshal([]byte(cleanJSONResponse(llmMessage)), &res); err != nil {
		res = models.WatchlistAnalysisRes{
			OverallSummary: llmMessage,
		}
	}
	res.RequestID = generateRequestID()
	res.WatchlistName = req.WatchlistName
	res.ModelUsed = "gemini-2.5-flash"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

// ──── POST /ai/reports/transactions ──────────────────────────────

func (c *AnalysisController) AnalyzeTransactions(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.TransactionAnalysisReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if len(req.Transactions) == 0 {
		jsonError(w, "Transactions cannot be empty", http.StatusBadRequest)
		return
	}

	prompt := BuildTransactionPrompt(req)
	llmMessage, err := c.provider.GenerateContent(r.Context(), prompt)
	if err != nil {
		jsonError(w, "AI provider error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var res models.TransactionAnalysisRes
	if err := json.Unmarshal([]byte(cleanJSONResponse(llmMessage)), &res); err != nil {
		res = models.TransactionAnalysisRes{
			AnalysisContent: llmMessage,
		}
	}
	res.RequestID = generateRequestID()
	res.ModelUsed = "gemini-2.5-flash"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

// ──── POST /ai/chat ──────────────────────────────────────────────

func (c *AnalysisController) HandleChat(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		jsonError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req models.ChatReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		jsonError(w, "Invalid request payload: "+err.Error(), http.StatusBadRequest)
		return
	}

	if len(req.Messages) == 0 {
		jsonError(w, "Messages cannot be empty", http.StatusBadRequest)
		return
	}

	prompt := BuildChatPrompt(req)
	llmMessage, err := c.provider.GenerateContent(r.Context(), prompt)
	if err != nil {
		jsonError(w, "AI provider error: "+err.Error(), http.StatusInternalServerError)
		return
	}

	var res models.ChatRes
	if err := json.Unmarshal([]byte(cleanJSONResponse(llmMessage)), &res); err != nil {
		// Fallback: raw yanıtı reply olarak kullan
		res = models.ChatRes{
			Reply:       llmMessage,
			ContextUsed: len(req.PortfolioSummary) > 0 || len(req.WatchlistSummary) > 0,
		}
	}
	res.RequestID = generateRequestID()
	res.ModelUsed = "gemini-2.5-flash"

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(res)
}

// ──── Helpers ────────────────────────────────────────────────────

// cleanJSONResponse strips markdown code fences that LLMs sometimes wrap around JSON.
func cleanJSONResponse(raw string) string {
	s := raw
	// Strip ```json ... ``` wrapping
	if len(s) > 7 && s[:7] == "```json" {
		s = s[7:]
	} else if len(s) > 3 && s[:3] == "```" {
		s = s[3:]
	}
	if len(s) > 3 && s[len(s)-3:] == "```" {
		s = s[:len(s)-3]
	}
	return s
}