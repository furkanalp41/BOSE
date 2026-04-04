package main

import (
	"log"
	"net/http"
	
	"stock-analyzer/config"
	"stock-analyzer/controllers"
	"stock-analyzer/routes"
	"stock-analyzer/services/ai"
)

func main() {
	cfg := config.LoadConfig()

	var provider ai.LLMProvider
	var err error

	if cfg.Provider == "gemini" {
		provider, err = ai.NewGeminiProvider(cfg.GeminiKey)
	} else if cfg.Provider == "anthropic" {
		provider, err = ai.NewAnthropicProvider(cfg.AnthropicKey)
	} else {
		log.Fatalf("Unknown provider: %s", cfg.Provider)
	}

	if err != nil {
		log.Fatalf("Failed to initialize ai provider: %v", err)
	}

	analysisController := controllers.NewAnalysisController(provider)
	handler := routes.SetupAIRoutes(analysisController)

	log.Printf("Starting REST API on port %s using %s provider...", cfg.Port, cfg.Provider)
	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
