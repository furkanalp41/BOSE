package routes

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/uraniumz/bose/controllers"
	"github.com/uraniumz/bose/middleware"
	"github.com/uraniumz/bose/services/market"
)

// SetupRoutes registers all API routes on the Fiber app.
func SetupRoutes(app *fiber.App, engine *market.PriceEngine, hub *market.Hub) {
	api := app.Group("/api/v1")

	// ── Public: Authentication ─────────────────────────────────────────────
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	// ── Public: Market Data (REST) ─────────────────────────────────────────
	mkt := api.Group("/market")
	mkt.Get("/assets", controllers.GetAssets(engine))

	// ── Public: WebSocket ──────────────────────────────────────────────────
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Get("/ws/market", websocket.New(controllers.MarketWebSocket(engine, hub)))

	// ── Protected: User Profile ────────────────────────────────────────────
	users := api.Group("/users", middleware.Protected())
	users.Get("/:userId", controllers.GetUser)
	users.Put("/:userId", controllers.UpdateUser)
	users.Delete("/:userId", controllers.DeleteUser)
	users.Post("/:userId/ai-preferences", controllers.UpdateAIPreferences)

	// ── Protected: Trading ─────────────────────────────────────────────────
	trade := api.Group("/trading", middleware.Protected())
	trade.Post("/order", controllers.PlaceOrder(engine))
	trade.Get("/positions", controllers.GetPositions(engine))
	trade.Post("/positions/:positionId/close", controllers.ClosePosition(engine))
	trade.Get("/history", controllers.GetTradeHistory)
	trade.Get("/portfolio", controllers.GetPortfolio(engine))

	// ── Protected: Watchlist & Alerts ──────────────────────────────────────
	wl := api.Group("/watchlist", middleware.Protected())
	wl.Post("/", controllers.CreateWatchlist)
	wl.Get("/", controllers.GetWatchlists)
	wl.Post("/alerts", controllers.CreateAlert)
	wl.Post("/:id/items", controllers.AddWatchlistItem)

	// ── Protected: AI Advisor & Reports ────────────────────────────────────
	aiGroup := api.Group("/ai", middleware.Protected())
	aiGroup.Post("/advice", controllers.GetAdvice(engine))
	aiGroup.Post("/reports/portfolio", controllers.AnalyzePortfolio(engine))
	aiGroup.Post("/reports/watchlist", controllers.AnalyzeWatchlist(engine))
	aiGroup.Post("/reports/transactions", controllers.AnalyzeTransactions(engine))
	aiGroup.Post("/chat", controllers.AIChat(engine))

	// ── Protected: Admin ───────────────────────────────────────────────────
	admin := api.Group("/admin", middleware.Protected(), controllers.AdminRequired)
	admin.Get("/logs", controllers.GetAdminLogs)
	admin.Delete("/users/:id", controllers.AdminDeleteUser)
	admin.Put("/users/:id/role", controllers.AdminUpdateRole)
	admin.Post("/announcements", controllers.CreateAnnouncement)

	// ── Protected: Leaderboard ─────────────────────────────────────────────
	lb := api.Group("/leaderboard", middleware.Protected())
	lb.Get("/rankings", controllers.GetRankings(engine))
	lb.Get("/user/:userId", controllers.GetUserRank(engine))
	lb.Get("/achievements", controllers.GetAchievements)
}
