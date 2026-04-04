package routes

import (
	"bose/controllers"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	marketCtrl := controllers.MarketController{DB: db}
	wlCtrl := controllers.WatchlistController{DB: db}

	// Market Rotaları
	market := r.Group("/api/market")
	{
		market.GET("/", marketCtrl.GetAll)
		market.POST("/", marketCtrl.Create)
		market.PUT("/:id", marketCtrl.Update)
		market.DELETE("/:id", marketCtrl.Delete)
	}

	// Watchlist & Alert Rotaları
	watchlist := r.Group("/api/watchlist")
	{
		watchlist.POST("/", wlCtrl.CreateWatchlist)
		watchlist.POST("/:id/items", wlCtrl.AddItemToWatchlist)
		watchlist.POST("/alerts", wlCtrl.CreateAlert)
	}
}
