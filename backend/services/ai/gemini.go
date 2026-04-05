package ai

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

const (
	geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
	geminiModel    = "gemini-2.0-flash"
	geminiTimeout  = 30 * time.Second
)

// GeminiProvider implements AIProvider using Google's Gemini REST API.
type GeminiProvider struct {
	apiKey string
	client *http.Client
}

// NewGeminiProvider creates a GeminiProvider with the given API key.
func NewGeminiProvider(apiKey string) *GeminiProvider {
	return &GeminiProvider{
		apiKey: apiKey,
		client: &http.Client{Timeout: geminiTimeout},
	}
}

func (g *GeminiProvider) Name() string {
	return geminiModel
}

func (g *GeminiProvider) Available() bool {
	return g.apiKey != ""
}

func (g *GeminiProvider) AnalyzePortfolio(ctx context.Context, prompt string) (string, error) {
	systemPrefix := "You are an expert financial advisor AI. Analyze the following portfolio data and provide actionable investment advice.\n\n"
	return g.generate(ctx, systemPrefix+prompt)
}

func (g *GeminiProvider) AnalyzeWatchlist(ctx context.Context, prompt string) (string, error) {
	systemPrefix := "You are an expert financial analyst AI. Analyze the following watchlist and provide insights on each asset.\n\n"
	return g.generate(ctx, systemPrefix+prompt)
}

func (g *GeminiProvider) AnalyzeTransactions(ctx context.Context, prompt string) (string, error) {
	systemPrefix := "You are an expert financial analyst AI. Analyze the following transaction history and provide insights on trading patterns and performance.\n\n"
	return g.generate(ctx, systemPrefix+prompt)
}

func (g *GeminiProvider) Chat(ctx context.Context, messages []ChatMessage) (string, error) {
	contents := make([]geminiContent, 0, len(messages))
	for _, m := range messages {
		role := m.Role
		// Gemini uses "user" and "model" roles.
		if role == "assistant" {
			role = "model"
		}
		if role == "system" {
			// Gemini doesn't have a system role; prepend as user context.
			role = "user"
		}
		// Gemini requires alternating roles. If the previous message has the
		// same role, merge the text into it instead of creating a consecutive
		// duplicate that the API would reject with a 400.
		if n := len(contents); n > 0 && contents[n-1].Role == role {
			contents[n-1].Parts = append(contents[n-1].Parts, geminiPart{Text: m.Content})
			continue
		}
		contents = append(contents, geminiContent{
			Parts: []geminiPart{{Text: m.Content}},
			Role:  role,
		})
	}

	reqBody := geminiRequest{
		Contents:         contents,
		GenerationConfig: geminiGenerationConfig{Temperature: 0.7, MaxOutputTokens: 2048},
	}

	return g.doRequest(ctx, reqBody)
}

// generate sends a single-turn prompt to Gemini.
func (g *GeminiProvider) generate(ctx context.Context, prompt string) (string, error) {
	reqBody := geminiRequest{
		Contents: []geminiContent{
			{
				Parts: []geminiPart{{Text: prompt}},
			},
		},
		GenerationConfig: geminiGenerationConfig{Temperature: 0.7, MaxOutputTokens: 2048},
	}
	return g.doRequest(ctx, reqBody)
}

func (g *GeminiProvider) doRequest(ctx context.Context, reqBody geminiRequest) (string, error) {
	body, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("[gemini] failed to marshal request: %w", err)
	}

	url := fmt.Sprintf("%s?key=%s", geminiEndpoint, g.apiKey)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("[gemini] failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := g.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("[gemini] request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("[gemini] failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("[gemini] API returned status %d: %s", resp.StatusCode, truncate(string(respBody), 500))
	}

	var geminiResp geminiResponse
	if err := json.Unmarshal(respBody, &geminiResp); err != nil {
		return "", fmt.Errorf("[gemini] failed to parse response: %w", err)
	}

	if len(geminiResp.Candidates) == 0 {
		return "", fmt.Errorf("[gemini] no candidates in response")
	}
	if len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("[gemini] no content parts in response")
	}

	return geminiResp.Candidates[0].Content.Parts[0].Text, nil
}

// --- Gemini API types ---

type geminiRequest struct {
	Contents         []geminiContent        `json:"contents"`
	GenerationConfig geminiGenerationConfig `json:"generationConfig"`
}

type geminiContent struct {
	Parts []geminiPart `json:"parts"`
	Role  string       `json:"role,omitempty"`
}

type geminiPart struct {
	Text string `json:"text"`
}

type geminiGenerationConfig struct {
	Temperature    float64 `json:"temperature"`
	MaxOutputTokens int    `json:"maxOutputTokens"`
}

type geminiResponse struct {
	Candidates []geminiCandidate `json:"candidates"`
}

type geminiCandidate struct {
	Content geminiContent `json:"content"`
}

// truncate shortens a string to maxLen, appending "..." if truncated.
func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}
