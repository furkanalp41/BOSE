package models

import "fmt"

// ──────────────────────────────────────────────────────────────────
// Mevcut yapılar (backward compat — test data ve eski endpoint)
// ──────────────────────────────────────────────────────────────────

type StockItem struct {
	ID        int8
	Name      string
	Price     float64
	Desc      string // stock item description (category etc.)
	RiskScore int8   // risk score calculated by analysis engine (0-10, where 10 is highest risk)
}

func (s StockItem) String() string {
	return fmt.Sprintf("%s (Price: $%.2f, Risk: %d/10) - %s", s.Name, s.Price, s.RiskScore, s.Desc)
}

type Person struct {
	ID         int16
	Name       string
	Preference int8 // preferred user risk choice (0-10)
	Portfolio  map[*StockItem]int16
	Watchlist  []StockItem
}

func (p Person) String() string {
	return fmt.Sprintf("%s (Risk Preference: %d/10)", p.Name, p.Preference)
}

type AnalysisReq struct {
	ID         int16
	Preference int8
	Portfolio  map[*StockItem]int16
	Watchlist  []StockItem
}

type AnalysisItem struct {
	ID         int16
	Preference int8
	Alignment  int8
	Content    string
}

// ══════════════════════════════════════════════════════════════════
// JSON Uyumlu AI Query Struct'ları (Pydantic şemalarıyla eşleşir)
// ══════════════════════════════════════════════════════════════════

// ──── Ortak Tipler ───────────────────────────────────────────────

// UserContext — her AI query'de taşınan kullanıcı bağlamı.
type UserContext struct {
	UserID         string `json:"user_id"`
	RiskPreference int    `json:"risk_preference"` // 0-10
	DisplayName    string `json:"display_name,omitempty"`
}

// StockItemJSON — REST API JSON payloadlarında kullanılan varlık bilgisi.
type StockItemJSON struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	Price     float64 `json:"price"`
	Desc      string  `json:"desc,omitempty"`
	AssetType string  `json:"asset_type,omitempty"` // "stock" | "crypto"
	RiskScore int     `json:"risk_score"`            // 0-10
}

func (s StockItemJSON) String() string {
	return fmt.Sprintf("%s ($%.2f, Risk:%d/10) %s", s.Name, s.Price, s.RiskScore, s.Desc)
}

// PortfolioHolding — portföydeki tek bir pozisyon.
type PortfolioHolding struct {
	Stock       StockItemJSON `json:"stock"`
	Quantity    int           `json:"quantity"`
	AvgBuyPrice *float64     `json:"avg_buy_price,omitempty"`
}

// ──── Portföy Analizi ────────────────────────────────────────────

type PortfolioAnalysisReq struct {
	UserContext            UserContext       `json:"user_context"`
	Holdings               []PortfolioHolding `json:"holdings"`
	AnalysisDepth          string             `json:"analysis_depth,omitempty"`  // "brief" | "standard" | "detailed"
	Language               string             `json:"language,omitempty"`         // "tr" | "en"
	IncludeRecommendations bool               `json:"include_recommendations"`
}

type PortfolioAnalysisRes struct {
	RequestID          string   `json:"request_id"`
	AlignmentScore     int      `json:"alignment_score"`      // 0-100
	OverallRisk        string   `json:"overall_risk"`          // "low" | "medium" | "high" | "very_high"
	PortfolioRiskScore float64  `json:"portfolio_risk_score"`  // 0-10
	TotalValue         *float64 `json:"total_value,omitempty"`
	AnalysisContent    string   `json:"analysis_content"`
	Recommendations    []string `json:"recommendations"`
	DiversificationScore *int   `json:"diversification_score,omitempty"` // 0-100
	ModelUsed          string   `json:"model_used"`
}

// ──── Watchlist Analizi ──────────────────────────────────────────

type WatchlistAnalysisReq struct {
	UserContext   UserContext      `json:"user_context"`
	WatchlistName string           `json:"watchlist_name,omitempty"`
	WatchlistID   string           `json:"watchlist_id,omitempty"`
	Items         []StockItemJSON  `json:"items"`
	AnalysisType  string           `json:"analysis_type,omitempty"` // "technical" | "fundamental" | "both"
	AnalysisDepth string           `json:"analysis_depth,omitempty"`
	Language      string           `json:"language,omitempty"`
}

type WatchlistItemResult struct {
	Symbol          string   `json:"symbol"`
	RiskLevel       string   `json:"risk_level"`
	Signal          string   `json:"signal"`     // "AL" | "SAT" | "TUT" | "İZLE"
	Confidence      int      `json:"confidence"` // 0-100
	Summary         string   `json:"summary"`
	TargetPrice     *float64 `json:"target_price,omitempty"`
	SupportPrice    *float64 `json:"support_price,omitempty"`
	ResistancePrice *float64 `json:"resistance_price,omitempty"`
}

type WatchlistAnalysisRes struct {
	RequestID      string                `json:"request_id"`
	WatchlistName  string                `json:"watchlist_name,omitempty"`
	OverallSummary string                `json:"overall_summary"`
	ItemAnalyses   []WatchlistItemResult `json:"item_analyses"`
	TopPick        string                `json:"top_pick,omitempty"`
	RiskWarning    string                `json:"risk_warning,omitempty"`
	ModelUsed      string                `json:"model_used"`
}

// ──── İşlem Geçmişi Analizi ──────────────────────────────────────

type TransactionRecord struct {
	Symbol     string  `json:"symbol"`
	AssetType  string  `json:"asset_type,omitempty"` // "stock" | "crypto"
	TxType     string  `json:"tx_type"`               // "buy" | "sell" | "buy_limit" | "sell_limit"
	Quantity   int     `json:"quantity"`
	Price      float64 `json:"price"`
	TotalValue *float64 `json:"total_value,omitempty"`
	ExecutedAt string  `json:"executed_at"` // ISO 8601
	OrderID    string  `json:"order_id,omitempty"`
}

type TransactionAnalysisReq struct {
	UserContext   UserContext          `json:"user_context"`
	Transactions  []TransactionRecord `json:"transactions"`
	PeriodLabel   string              `json:"period_label,omitempty"`
	AnalysisDepth string              `json:"analysis_depth,omitempty"`
	Language      string              `json:"language,omitempty"`
	FocusAreas    []string            `json:"focus_areas,omitempty"`
}

type BehaviorPattern struct {
	PatternName string `json:"pattern_name"`
	Description string `json:"description"`
	Frequency   int    `json:"frequency"`
	Impact      string `json:"impact"`     // "pozitif" | "negatif" | "nötr"
	Suggestion  string `json:"suggestion"`
}

type TransactionAnalysisRes struct {
	RequestID        string            `json:"request_id"`
	TotalTransactions int              `json:"total_transactions"`
	TotalBuyVolume   float64           `json:"total_buy_volume"`
	TotalSellVolume  float64           `json:"total_sell_volume"`
	WinRate          *float64          `json:"win_rate,omitempty"`
	AnalysisContent  string            `json:"analysis_content"`
	BehaviorPatterns []BehaviorPattern `json:"behavior_patterns"`
	Recommendations  []string          `json:"recommendations"`
	MostTradedSymbol string            `json:"most_traded_symbol,omitempty"`
	ModelUsed        string            `json:"model_used"`
}

// ──── AI Sohbet (Chat) ───────────────────────────────────────────

type ChatMessage struct {
	Role    string `json:"role"`    // "user" | "assistant" | "system"
	Content string `json:"content"`
}

type ChatReq struct {
	UserContext       UserContext       `json:"user_context"`
	Messages          []ChatMessage     `json:"messages"`
	PortfolioSummary  []PortfolioHolding `json:"portfolio_summary,omitempty"`
	WatchlistSummary  []StockItemJSON   `json:"watchlist_summary,omitempty"`
	Language          string            `json:"language,omitempty"`
	MaxResponseTokens int              `json:"max_response_tokens,omitempty"`
}

type SuggestedAction struct {
	ActionType  string `json:"action_type"` // "buy" | "sell" | "add_to_watchlist" | "analyze"
	Symbol      string `json:"symbol,omitempty"`
	Description string `json:"description"`
	Confidence  int    `json:"confidence"` // 0-100
}

type ChatRes struct {
	RequestID         string            `json:"request_id"`
	Reply             string            `json:"reply"`
	ReferencedSymbols []string          `json:"referenced_symbols"`
	SuggestedActions  []SuggestedAction `json:"suggested_actions"`
	FollowUpQuestions []string          `json:"follow_up_questions"`
	ContextUsed       bool              `json:"context_used"`
	ModelUsed         string            `json:"model_used"`
}
