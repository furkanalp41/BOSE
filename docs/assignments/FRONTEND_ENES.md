# Frontend Documentation — Enes

## Domain
**Frontend URL:** https://bose-platform.onrender.com

## Test Videosu
> [YouTube video linki buraya eklenecek]

## Responsibilities
AI analysis pages: Portfolio Analysis, Transaction Analysis, AI Chat interface.

## Pages

### PortfolioAnalysis
- **File:** `frontend/src/pages/PortfolioAnalysis.jsx`
- Displays alignment score, risk score, diversification score.
- Shows holdings table with current value and P&L per position.
- AI-generated analysis content and recommendations.
- Indicates which AI model produced the analysis.

### TransactionAnalysis
- **File:** `frontend/src/pages/TransactionAnalysis.jsx`
- Behavioral pattern detection (Aggressive Buying, Single Asset Focus, Diversified Trading, Active Trader).
- Win rate, buy/sell volume statistics, most traded symbol.
- AI-generated behavioral insights and improvement suggestions.

### AIChat (`/dashboard` — AI Chat tab)
- **File:** `frontend/src/pages/AIChat.jsx`
- Chat interface with the AI financial advisor.
- Sends user messages to `POST /api/v1/ai/chat`.
- Displays referenced symbols, suggested actions, and follow-up questions.
- Shows which AI model (Gemini, Anthropic, or rules engine) generated the response.

## Components

### AdvisorPanel
- **File:** `frontend/src/components/ai/AdvisorPanel.jsx`
- Wrapper component for AI advisor interactions.

### ChatMessage
- **File:** `frontend/src/components/ai/ChatMessage.jsx`
- Renders individual chat messages with markdown support.
- Differentiates between user and assistant messages.

## Data Flow
1. Frontend sends POST request to the relevant AI endpoint.
2. Backend tries LLM providers in order (Gemini → Anthropic).
3. If all LLMs fail, falls back to the built-in rules engine.
4. Response includes `model_used` field so the UI can display the source.
