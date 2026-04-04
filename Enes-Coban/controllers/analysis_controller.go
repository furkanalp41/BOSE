package controllers

import (
	"encoding/json"
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

// POST /ai/reports/portfolio
// Analyzes a user provided portfolio
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
// Runs the test data batch
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