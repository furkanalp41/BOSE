package ai

import (
	"context"
	"fmt"
	"log"
	"os"
)

// AIProvider defines the interface for LLM-based analysis providers.
type AIProvider interface {
	Name() string
	Available() bool
	AnalyzePortfolio(ctx context.Context, prompt string) (string, error)
	AnalyzeWatchlist(ctx context.Context, prompt string) (string, error)
	AnalyzeTransactions(ctx context.Context, prompt string) (string, error)
	Chat(ctx context.Context, messages []ChatMessage) (string, error)
}

// ChatMessage represents a single message in a conversation.
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// ProviderChain tries AI providers in priority order with graceful fallback.
type ProviderChain struct {
	providers []AIProvider
}

// NewProviderChain initializes the provider chain based on available API keys.
// Priority order: Gemini -> Anthropic -> Rules Engine (implicit fallback).
func NewProviderChain() *ProviderChain {
	pc := &ProviderChain{}

	// Gemini — highest priority
	if key := os.Getenv("GEMINI_API_KEY"); key != "" {
		gp := NewGeminiProvider(key)
		pc.providers = append(pc.providers, gp)
		log.Printf("[ai] provider registered: %s", gp.Name())
	} else {
		log.Println("[ai] Gemini provider skipped: GEMINI_API_KEY not set")
	}

	// Anthropic — second priority
	if key := os.Getenv("ANTHROPIC_API_KEY"); key != "" {
		ap := NewAnthropicProvider(key)
		pc.providers = append(pc.providers, ap)
		log.Printf("[ai] provider registered: %s", ap.Name())
	} else {
		log.Println("[ai] Anthropic provider skipped: ANTHROPIC_API_KEY not set")
	}

	if len(pc.providers) == 0 {
		log.Println("[ai] no LLM providers available — rules engine will be used exclusively")
	} else {
		log.Printf("[ai] %d LLM provider(s) available", len(pc.providers))
	}

	return pc
}

// GetActiveProvider returns the first available provider, or nil if none are available.
func (pc *ProviderChain) GetActiveProvider() AIProvider {
	for _, p := range pc.providers {
		if p.Available() {
			return p
		}
	}
	return nil
}

// Analyze dispatches an analysis request to the first working provider.
// analysisType must be one of: "portfolio", "watchlist", "transactions".
// If all LLM providers fail, it returns ("", "rules-engine", nil) so the caller
// can fall back to the existing rules-based advisor.
func (pc *ProviderChain) Analyze(ctx context.Context, analysisType string, prompt string) (result string, modelUsed string, err error) {
	for _, p := range pc.providers {
		if !p.Available() {
			continue
		}

		var res string
		var callErr error

		switch analysisType {
		case "portfolio":
			res, callErr = p.AnalyzePortfolio(ctx, prompt)
		case "watchlist":
			res, callErr = p.AnalyzeWatchlist(ctx, prompt)
		case "transactions":
			res, callErr = p.AnalyzeTransactions(ctx, prompt)
		default:
			return "", "", fmt.Errorf("unknown analysis type: %s", analysisType)
		}

		if callErr != nil {
			log.Printf("[ai] provider %s failed for %s analysis: %v", p.Name(), analysisType, callErr)
			continue
		}

		return res, p.Name(), nil
	}

	// All LLM providers failed or none available — signal rules-engine fallback
	log.Println("[ai] all LLM providers exhausted, falling back to rules engine")
	return "", "rules-engine", nil
}

// ChatCompletion dispatches a chat request to the first working provider.
// If all LLM providers fail, it returns ("", "rules-engine", nil).
func (pc *ProviderChain) ChatCompletion(ctx context.Context, messages []ChatMessage) (reply string, modelUsed string, err error) {
	for _, p := range pc.providers {
		if !p.Available() {
			continue
		}

		res, callErr := p.Chat(ctx, messages)
		if callErr != nil {
			log.Printf("[ai] provider %s failed for chat: %v", p.Name(), callErr)
			continue
		}

		return res, p.Name(), nil
	}

	log.Println("[ai] all LLM providers exhausted for chat, falling back to rules engine")
	return "", "rules-engine", nil
}
