package controllers

import (
	"sync"

	"bose-efe/models"

	"github.com/gofiber/contrib/websocket"
)

var (
	wsMu      sync.Mutex
	wsClients = make(map[*websocket.Conn]struct{})
)

// HandleMarketStream upgrades the connection to a WebSocket and registers
// the client in the broadcast set. The ticker goroutine pushes price ticks
// to every registered client via BroadcastTick.
func HandleMarketStream(c *websocket.Conn) {
	wsMu.Lock()
	wsClients[c] = struct{}{}
	wsMu.Unlock()

	defer func() {
		wsMu.Lock()
		delete(wsClients, c)
		wsMu.Unlock()
		_ = c.Close()
	}()

	// Block until the client disconnects. Reads are dropped (no incoming protocol).
	for {
		if _, _, err := c.ReadMessage(); err != nil {
			return
		}
	}
}

// BroadcastTick sends a price tick to every connected WebSocket client.
// Called by the streamer goroutine for every generated tick.
func BroadcastTick(t models.PriceTick) {
	wsMu.Lock()
	defer wsMu.Unlock()
	for conn := range wsClients {
		if err := conn.WriteJSON(t); err != nil {
			// On write failure, drop the client; the deferred cleanup
			// in HandleMarketStream handles map removal once Read fails.
			_ = conn.Close()
		}
	}
}
