package ai

import (
	"context"
)

type LLMProvider interface {
	GenerateContent(ctx context.Context, prompt string) (string, error)
}
