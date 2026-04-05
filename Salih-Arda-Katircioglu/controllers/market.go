package controllers

import (
	"net/http"
	"bose/models" // Kendi modül adına göre bose kısmını güncelle (örn: github.com/kullanici/proje)
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type MarketController struct {
	DB *gorm.DB
}

// GET: Tüm market verilerini getir
func (mc *MarketController) GetAll(c *gin.Context) {
	var items []models.MarketItem
	mc.DB.Find(&items)
	c.JSON(http.StatusOK, items)
}

// POST: Yeni borsa kalemi ekle (Admin)
func (mc *MarketController) Create(c *gin.Context) {
	var item models.MarketItem
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	mc.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

// PUT: Borsa kalemini güncelle (Admin)
func (mc *MarketController) Update(c *gin.Context) {
	id := c.Param("id")
	var item models.MarketItem
	if err := mc.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Bulunamadı"})
		return
	}

	var updateData models.MarketItem
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	mc.DB.Model(&item).Updates(updateData)
	c.JSON(http.StatusOK, item)
}

// DELETE: Borsa kalemini sil (Admin)
func (mc *MarketController) Delete(c *gin.Context) {
	id := c.Param("id")
	mc.DB.Delete(&models.MarketItem{}, id)
	c.JSON(http.StatusOK, gin.H{"message": "Silindi"})
}