package config

import (
	"os"
)

type Config struct {
	GeminiKey    string
	AnthropicKey string
	Provider     string // "gemini" or "anthropic"
	Port         string
}

func LoadConfig() Config {
	provider := os.Getenv("AI_PROVIDER")
	if provider == "" {
		provider = "gemini"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	return Config{
		GeminiKey:    os.Getenv("GEMINI_API_KEY"),
		AnthropicKey: os.Getenv("ANTHROPIC_API_KEY"),
		Provider:     provider,
		Port:         port,
	}
}
