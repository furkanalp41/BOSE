package routes

import (
	"net/http"
	
	"stock-analyzer/controllers"
	"stock-analyzer/middlewares"
)

func SetupAIRoutes(analysisController *controllers.AnalysisController) http.Handler {
	mux := http.NewServeMux()

	// Endpoints under /ai/ domain
	mux.HandleFunc("/ai/reports/portfolio", analysisController.AnalyzePortfolio)
	mux.HandleFunc("/ai/reports/portfolio/test", analysisController.RunTestAnalysis)

	// In the future:
	// mux.HandleFunc("/ai/chat", chatController.HandleChat)

	return middlewares.Logger(mux)
}
