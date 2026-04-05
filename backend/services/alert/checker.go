package alert

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/uraniumz/bose/config"
	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/market"
)

// TriggeredAlert records an alert that fired along with the price that caused it.
type TriggeredAlert struct {
	Alert        models.Alert `json:"alert"`
	CurrentPrice float64      `json:"current_price"`
	TriggeredAt  time.Time    `json:"triggered_at"`
}

// AlertChecker runs in the background, comparing active alerts against live
// prices from the PriceEngine. When a condition is met the alert is marked
// inactive in the database and kept in a bounded in-memory list.
type AlertChecker struct {
	engine    *market.PriceEngine
	mu        sync.RWMutex
	triggered []TriggeredAlert // recent triggered alerts (capped at maxTriggered)
}

const maxTriggered = 100

// NewAlertChecker creates a checker wired to the given PriceEngine.
func NewAlertChecker(engine *market.PriceEngine) *AlertChecker {
	return &AlertChecker{
		engine:    engine,
		triggered: make([]TriggeredAlert, 0, maxTriggered),
	}
}

// Start begins the background checking loop. It should be called in its own
// goroutine. The loop ticks every 5 seconds and stops when ctx is cancelled.
func (ac *AlertChecker) Start(ctx context.Context) {
	log.Println("Alert checker started")

	ticker := time.NewTicker(5 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			log.Println("Alert checker stopped")
			return
		case <-ticker.C:
			ac.Check()
		}
	}
}

// Check performs a single check cycle: it loads every active alert from the
// database, compares each against the current price from the engine, and
// triggers any alert whose condition is satisfied.
func (ac *AlertChecker) Check() {
	var alerts []models.Alert
	if err := config.DB.Where("is_active = ?", true).Find(&alerts).Error; err != nil {
		log.Printf("alert checker: failed to query active alerts: %v", err)
		return
	}

	if len(alerts) == 0 {
		return
	}

	prices := ac.engine.CurrentPrices()

	for _, a := range alerts {
		currentPrice, ok := prices[a.Symbol]
		if !ok {
			continue // symbol not tracked by engine
		}

		triggered := false
		switch a.Condition {
		case "ABOVE":
			triggered = currentPrice >= a.TargetPrice
		case "BELOW":
			triggered = currentPrice <= a.TargetPrice
		default:
			log.Printf("alert checker: unknown condition %q on alert %d", a.Condition, a.ID)
			continue
		}

		if !triggered {
			continue
		}

		// Deactivate the alert in the database.
		if err := config.DB.Model(&models.Alert{}).Where("id = ?", a.ID).Update("is_active", false).Error; err != nil {
			log.Printf("alert checker: failed to deactivate alert %d: %v", a.ID, err)
			continue
		}

		now := time.Now()
		log.Printf("alert triggered: id=%d user=%d symbol=%s condition=%s target=%.2f price=%.2f",
			a.ID, a.UserID, a.Symbol, a.Condition, a.TargetPrice, currentPrice)

		a.IsActive = false
		ta := TriggeredAlert{
			Alert:        a,
			CurrentPrice: currentPrice,
			TriggeredAt:  now,
		}

		ac.mu.Lock()
		ac.triggered = append(ac.triggered, ta)
		// Trim to the most recent entries when the list exceeds the cap.
		if len(ac.triggered) > maxTriggered {
			ac.triggered = ac.triggered[len(ac.triggered)-maxTriggered:]
		}
		ac.mu.Unlock()
	}
}

// GetTriggered returns the recently triggered alerts that belong to the given user.
func (ac *AlertChecker) GetTriggered(userID uint) []TriggeredAlert {
	ac.mu.RLock()
	defer ac.mu.RUnlock()

	var result []TriggeredAlert
	for _, ta := range ac.triggered {
		if ta.Alert.UserID == userID {
			result = append(result, ta)
		}
	}
	return result
}
