package routes

import (
	"net/http"

	"stock-analyzer/controllers"
	"stock-analyzer/middlewares"
)

func SetupAIRoutes(analysisController *controllers.AnalysisController) http.Handler {
	mux := http.NewServeMux()

	// ── Yeni Pydantic uyumlu AI endpoint'leri ──
	mux.HandleFunc("/ai/reports/portfolio", analysisController.AnalyzePortfolioV2)
	mux.HandleFunc("/ai/reports/watchlist", analysisController.AnalyzeWatchlist)
	mux.HandleFunc("/ai/reports/transactions", analysisController.AnalyzeTransactions)
	mux.HandleFunc("/ai/chat", analysisController.HandleChat)

	// ── Eski endpoint'ler (backward compat) ──
	mux.HandleFunc("/ai/reports/portfolio/legacy", analysisController.AnalyzePortfolio)
	mux.HandleFunc("/ai/reports/portfolio/test", analysisController.RunTestAnalysis)

	return middlewares.CORS(middlewares.Logger(mux))
}

