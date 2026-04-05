package controllers

import (
	"net/http"
	"bose/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type WatchlistController struct {
	DB *gorm.DB
}

// POST: Watchlist Oluştur
func (wc *WatchlistController) CreateWatchlist(c *gin.Context) {
	var wl models.Watchlist
	if err := c.ShouldBindJSON(&wl); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	wc.DB.Create(&wl)
	c.JSON(http.StatusCreated, wl)
}

// POST: Watchlist'e Market Item Ekle
func (wc *WatchlistController) AddItemToWatchlist(c *gin.Context) {
	watchlistID := c.Param("id")
	var req struct { MarketItemID uint `json:"market_item_id"` }
	c.ShouldBindJSON(&req)

	var wl models.Watchlist
	wc.DB.First(&wl, watchlistID)
	
	var item models.MarketItem
	wc.DB.First(&item, req.MarketItemID)

	// İlişkiyi ekle
	wc.DB.Model(&wl).Association("Items").Append(&item)
	c.JSON(http.StatusOK, gin.H{"message": "Watchlist güncellendi"})
}

// POST: Alarm Oluştur
func (wc *WatchlistController) CreateAlert(c *gin.Context) {
	var alert models.Alert
	if err := c.ShouldBindJSON(&alert); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	wc.DB.Create(&alert)
	c.JSON(http.StatusCreated, alert)
}