package streamer

import (
	"encoding/json"
	"log"
	"math/rand"
	"time"

	"bose-efe/config"
	"bose-efe/controllers"
	"bose-efe/messaging"
	"bose-efe/models"
)

// Seed creates a minimal default asset list if the market_assets table is empty,
// so first-time runs immediately have something to stream.
func Seed() {
	if config.DB == nil {
		return
	}
	var count int64
	config.DB.Model(&models.MarketAsset{}).Count(&count)
	if count > 0 {
		return
	}
	defaults := []models.MarketAsset{
		{Symbol: "THYAO", Name: "Türk Hava Yolları", Type: "BIST", IsActive: true},
		{Symbol: "ASELS", Name: "Aselsan", Type: "BIST", IsActive: true},
		{Symbol: "GARAN", Name: "Garanti BBVA", Type: "BIST", IsActive: true},
		{Symbol: "AKBNK", Name: "Akbank", Type: "BIST", IsActive: true},
		{Symbol: "BTCUSDT", Name: "Bitcoin", Type: "CRYPTO", IsActive: true},
		{Symbol: "ETHUSDT", Name: "Ethereum", Type: "CRYPTO", IsActive: true},
		{Symbol: "SOLUSDT", Name: "Solana", Type: "CRYPTO", IsActive: true},
	}
	if err := config.DB.Create(&defaults).Error; err != nil {
		log.Println("seed market_assets failed:", err)
		return
	}
	log.Println("✅ seed: 7 default market_assets inserted.")
}

var lastPrice = map[string]float64{}

func basePrice(symbol string) float64 {
	if p, ok := lastPrice[symbol]; ok {
		return p
	}
	switch symbol {
	case "BTCUSDT":
		return 67000
	case "ETHUSDT":
		return 3500
	case "SOLUSDT":
		return 170
	case "THYAO":
		return 280
	case "ASELS":
		return 75
	case "GARAN":
		return 95
	case "AKBNK":
		return 65
	default:
		return 100
	}
}

// Start runs an infinite goroutine that generates a synthetic price tick
// for every active market asset every second, writes it to Redis
// (hash prices:latest), publishes it to RabbitMQ (routing key price.tick),
// and broadcasts it to every WebSocket client.
func Start() {
	go run()
}

func run() {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		var assets []models.MarketAsset
		if config.DB != nil {
			config.DB.Where("is_active = ?", true).Find(&assets)
		}
		if len(assets) == 0 {
			continue
		}

		for _, a := range assets {
			prev := basePrice(a.Symbol)
			// random walk ±0.5%
			move := (rng.Float64() - 0.5) / 100
			next := prev * (1 + move)
			if next <= 0 {
				next = prev
			}
			lastPrice[a.Symbol] = next

			tick := models.PriceTick{
				Symbol:    a.Symbol,
				Price:     round2(next),
				Change24h: round2((next - prev) / prev * 100),
				Type:      a.Type,
				TS:        time.Now(),
			}

			if config.Redis != nil {
				if raw, err := json.Marshal(tick); err == nil {
					_ = config.Redis.HSet(config.RedisCtx, "prices:latest", a.Symbol, raw).Err()
				}
			}
			_ = messaging.Publish("price.tick", tick)
			controllers.BroadcastTick(tick)
		}
	}
}

func round2(f float64) float64 {
	return float64(int64(f*100)) / 100
}
