package routes

import (
	"bose/controllers"

	"github.com/gofiber/fiber/v2"
)

// SetupOrderRoutes: Emir ve market route'larını tanımla
// main.go'da çağrılacak: routes.SetupOrderRoutes(app)
func SetupOrderRoutes(app *fiber.App, authMiddleware fiber.Handler) {
	// ── MARKET (public, giriş gerekmez) ──────────────────────────
	market := app.Group("/api/market")
	market.Get("/", controllers.GetAllAssets)               // Tüm varlıklar
	market.Get("/type/:type", controllers.GetAssetsByType)  // Kripto veya hisse filtrele
	market.Get("/:symbol", controllers.GetAssetBySymbol)    // Tekil varlık detayı

	// ── ORDERS (private, JWT gerekir) ────────────────────────────
	orders := app.Group("/api/orders", authMiddleware)
	orders.Post("/", controllers.PlaceOrder)         // Emir ver (al/sat)
	orders.Get("/", controllers.GetMyOrders)         // Tüm emirlerim
	orders.Get("/buy", controllers.GetMyBuyOrders)   // Alım emirlerim
	orders.Get("/sell", controllers.GetMySellOrders) // Satım emirlerim
	orders.Delete("/:id", controllers.CancelOrder)   // Emri iptal et
}
