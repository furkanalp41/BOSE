package market

import (
	"math"
	"math/rand"
	"sync"
	"time"
)

type priceState struct {
	price      float64
	drift      float64
	volatility float64
}

// PriceEngine generates realistic random-walk prices using Geometric Brownian Motion.
type PriceEngine struct {
	mu     sync.RWMutex
	states map[string]*priceState
}

// NewPriceEngine creates a new engine with initial seed prices.
func NewPriceEngine() *PriceEngine {
	return &PriceEngine{
		states: map[string]*priceState{
			"BTC":   {price: 67_420.00, drift: 0.0002, volatility: 0.0018},
			"ETH":   {price: 3_540.00, drift: 0.0001, volatility: 0.0022},
			"SOL":   {price: 172.50, drift: 0.0003, volatility: 0.0030},
			"THYAO": {price: 284.60, drift: 0.0001, volatility: 0.0014},
			"ASELS": {price: 62.40, drift: -0.0001, volatility: 0.0012},
			"AAPL":  {price: 189.30, drift: 0.0001, volatility: 0.0010},
			"NVDA":  {price: 875.20, drift: 0.0002, volatility: 0.0025},
			"GOOGL": {price: 172.85, drift: 0.0001, volatility: 0.0012},
		},
	}
}

// Tick advances all prices by one step and returns the deltas.
func (e *PriceEngine) Tick() []PriceTick {
	e.mu.Lock()
	defer e.mu.Unlock()

	ticks := make([]PriceTick, 0, len(e.states))
	now := time.Now().UnixMilli()

	for sym, s := range e.states {
		prev := s.price

		// Geometric Brownian Motion step
		dt := 1.0
		z := rand.NormFloat64()
		s.price = prev * math.Exp((s.drift-0.5*s.volatility*s.volatility)*dt+s.volatility*math.Sqrt(dt)*z)

		// Occasionally flip drift
		if rand.Float64() < 0.05 {
			s.drift = -s.drift
		}

		change := s.price - prev
		changePct := (change / prev) * 100.0

		ticks = append(ticks, PriceTick{
			Symbol:    sym,
			Price:     roundTo(s.price, 2),
			Change:    roundTo(change, 4),
			ChangePct: roundTo(changePct, 4),
			Timestamp: now,
		})
	}
	return ticks
}

// CurrentPrices returns a snapshot of current prices (thread-safe read).
func (e *PriceEngine) CurrentPrices() map[string]float64 {
	e.mu.RLock()
	defer e.mu.RUnlock()
	m := make(map[string]float64, len(e.states))
	for sym, s := range e.states {
		m[sym] = roundTo(s.price, 2)
	}
	return m
}

func roundTo(v float64, decimals int) float64 {
	factor := math.Pow(10, float64(decimals))
	return math.Round(v*factor) / factor
}
