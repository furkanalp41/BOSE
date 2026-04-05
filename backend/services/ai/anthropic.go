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
	anthropicEndpoint = "https://api.anthropic.com/v1/messages"
	anthropicModel    = "claude-sonnet-4-20250514"
	anthropicVersion  = "2023-06-01"
	anthropicTimeout  = 30 * time.Second
)

// AnthropicProvider implements AIProvider using Anthropic's Messages REST API.
type AnthropicProvider struct {
	apiKey string
	client *http.Client
}

// NewAnthropicProvider creates an AnthropicProvider with the given API key.
func NewAnthropicProvider(apiKey string) *AnthropicProvider {
	return &AnthropicProvider{
		apiKey: apiKey,
		client: &http.Client{Timeout: anthropicTimeout},
	}
}

func (a *AnthropicProvider) Name() string {
	return anthropicModel
}

func (a *AnthropicProvider) Available() bool {
	return a.apiKey != ""
}

func (a *AnthropicProvider) AnalyzePortfolio(ctx context.Context, prompt string) (string, error) {
	system := "You are an expert financial advisor AI. Analyze the following portfolio data and provide actionable investment advice."
	return a.generate(ctx, system, prompt)
}

func (a *AnthropicProvider) AnalyzeWatchlist(ctx context.Context, prompt string) (string, error) {
	system := "You are an expert financial analyst AI. Analyze the following watchlist and provide insights on each asset."
	return a.generate(ctx, system, prompt)
}

func (a *AnthropicProvider) AnalyzeTransactions(ctx context.Context, prompt string) (string, error) {
	system := "You are an expert financial analyst AI. Analyze the following transaction history and provide insights on trading patterns and performance."
	return a.generate(ctx, system, prompt)
}

func (a *AnthropicProvider) Chat(ctx context.Context, messages []ChatMessage) (string, error) {
	var system string
	apiMessages := make([]anthropicMessage, 0, len(messages))

	for _, m := range messages {
		if m.Role == "system" {
			// Anthropic uses a top-level system field, not a message role.
			system = m.Content
			continue
		}
		apiMessages = append(apiMessages, anthropicMessage{
			Role:    m.Role,
			Content: m.Content,
		})
	}

	// Ensure at least one user message exists.
	if len(apiMessages) == 0 {
		return "", fmt.Errorf("[anthropic] no user/assistant messages provided")
	}

	reqBody := anthropicRequest{
		Model:     anthropicModel,
		MaxTokens: 2048,
		Messages:  apiMessages,
	}
	if system != "" {
		reqBody.System = system
	}

	return a.doRequest(ctx, reqBody)
}

// generate sends a single-turn prompt with an optional system message.
func (a *AnthropicProvider) generate(ctx context.Context, system, prompt string) (string, error) {
	reqBody := anthropicRequest{
		Model:     anthropicModel,
		MaxTokens: 2048,
		Messages: []anthropicMessage{
			{Role: "user", Content: prompt},
		},
	}
	if system != "" {
		reqBody.System = system
	}

	return a.doRequest(ctx, reqBody)
}

func (a *AnthropicProvider) doRequest(ctx context.Context, reqBody anthropicRequest) (string, error) {
	body, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("[anthropic] failed to marshal request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, anthropicEndpoint, bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("[anthropic] failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", a.apiKey)
	req.Header.Set("anthropic-version", anthropicVersion)

	resp, err := a.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("[anthropic] request failed: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("[anthropic] failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("[anthropic] API returned status %d: %s", resp.StatusCode, truncate(string(respBody), 500))
	}

	var anthropicResp anthropicResponse
	if err := json.Unmarshal(respBody, &anthropicResp); err != nil {
		return "", fmt.Errorf("[anthropic] failed to parse response: %w", err)
	}

	if len(anthropicResp.Content) == 0 {
		return "", fmt.Errorf("[anthropic] no content blocks in response")
	}

	return anthropicResp.Content[0].Text, nil
}

// --- Anthropic API types ---

type anthropicRequest struct {
	Model     string             `json:"model"`
	MaxTokens int                `json:"max_tokens"`
	System    string             `json:"system,omitempty"`
	Messages  []anthropicMessage `json:"messages"`
}

type anthropicMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type anthropicResponse struct {
	Content []anthropicContentBlock `json:"content"`
}

type anthropicContentBlock struct {
	Type string `json:"type"`
	Text string `json:"text"`
}
