package market

// Asset represents a tradeable asset in the market catalogue.
type Asset struct {
	Symbol    string  `json:"symbol"`
	Name      string  `json:"name"`
	Category  string  `json:"category"` // crypto | bist | nasdaq
	Price     float64 `json:"price"`
	Change24h float64 `json:"change24h"`
	MarketCap float64 `json:"marketCap"`
	Volume24h float64 `json:"volume24h"`
}

// PriceTick represents a single price update for one symbol.
type PriceTick struct {
	Symbol    string  `json:"symbol"`
	Price     float64 `json:"price"`
	Change    float64 `json:"change"`
	ChangePct float64 `json:"changePct"`
	Timestamp int64   `json:"timestamp"`
}

// MarketSnapshot is broadcast over WebSocket each tick.
type MarketSnapshot struct {
	Ticks []PriceTick `json:"ticks"`
}
