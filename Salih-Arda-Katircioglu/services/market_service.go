package services

import (
	"bose/models"
	"fmt"
	"math/rand"
	"time"

	"gorm.io/gorm"
)

func StartMarketSimulation(db *gorm.DB) {
	go func() {
		for {
			time.Sleep(5 * time.Second) // Her 5 saniyede bir güncelle (Gerçekte WebSocket veya Timer kullanılır)

			var items []models.MarketItem
			db.Find(&items)

			for _, item := range items {
				// 1. Fiyatı güncelle (Gerçek bir borsa API'sinden veri çekilecek kısım)
				fluctuation := (rand.Float64() - 0.5) * 2 // -1.0 ile 1.0 arası değişim simülasyonu
				item.Price += fluctuation
				db.Save(&item)

				// 2. Alarmları Kontrol Et
				checkAlerts(db, item)
			}
		}
	}()
}

func checkAlerts(db *gorm.DB, item models.MarketItem) {
	var alerts []models.Alert
	// Sadece aktif ve bu hisseye ait alarmları getir
	db.Where("market_item_id = ? AND is_active = ?", item.ID, true).Find(&alerts)

	for _, alert := range alerts {
		if alert.Condition == "ABOVE" && item.Price >= alert.TargetPrice {
			fmt.Printf("ALARM TETİKLENDİ: %s hedef fiyatı aştı! Güncel: %f\n", item.Symbol, item.Price)
			// TODO: Kullanıcıya Push Notification veya Email gönder
			alert.IsActive = false // Bir kere tetiklendikten sonra kapat
			db.Save(&alert)
		} else if alert.Condition == "BELOW" && item.Price <= alert.TargetPrice {
			fmt.Printf("ALARM TETİKLENDİ: %s hedef fiyatın altına düştü! Güncel: %f\n", item.Symbol, item.Price)
			alert.IsActive = false
			db.Save(&alert)
		}
	}
}
