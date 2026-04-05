package controllers

import (
	"encoding/json"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/services/market"
)

// GetAssets returns a handler that lists all assets with live prices.
func GetAssets(engine *market.PriceEngine) fiber.Handler {
	return func(c *fiber.Ctx) error {
		assets := market.BuildAssetCatalogue(engine)
		return c.JSON(fiber.Map{
			"status": "ok",
			"data":   assets,
		})
	}
}

// MarketWebSocket returns a WebSocket handler for real-time price streaming.
func MarketWebSocket(engine *market.PriceEngine, hub *market.Hub) func(*websocket.Conn) {
	return func(c *websocket.Conn) {
		hub.Register(c)
		defer hub.Unregister(c)

		log.Printf("WS client connected: %s", c.RemoteAddr())

		// Send an immediate snapshot so the UI isn't empty
		ticks := engine.Tick()
		snap := market.MarketSnapshot{Ticks: ticks}
		if data, err := json.Marshal(snap); err == nil {
			_ = c.WriteMessage(1, data)
		}

		// Keep connection alive; read loop detects client disconnect
		for {
			_, _, err := c.ReadMessage()
			if err != nil {
				log.Printf("WS client disconnected: %s", c.RemoteAddr())
				break
			}
		}
	}
}
