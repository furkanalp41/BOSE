package trading

import (
	"fmt"
	"math"
	"time"

	"github.com/uraniumz/bose/models"
	"github.com/uraniumz/bose/services/market"
	"gorm.io/gorm"
)

// ExecuteOrder processes a market buy/sell order.
func ExecuteOrder(db *gorm.DB, engine *market.PriceEngine, userID uint, req models.OrderRequest) (*models.Trade, error) {
	prices := engine.CurrentPrices()
	price, ok := prices[req.Symbol]
	if !ok {
		return nil, fmt.Errorf("unknown symbol: %s", req.Symbol)
	}

	total := math.Round(price*req.Quantity*100) / 100

	trade := &models.Trade{
		UserID:   userID,
		Symbol:   req.Symbol,
		Side:     req.Side,
		Quantity: req.Quantity,
		Price:    price,
		Total:    total,
	}

	err := db.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := tx.First(&user, userID).Error; err != nil {
			return fmt.Errorf("user not found")
		}

		if req.Side == "BUY" {
			if user.VirtualBalance < total {
				return fmt.Errorf("insufficient balance: need $%.2f, have $%.2f", total, user.VirtualBalance)
			}
			// Deduct balance
			if err := tx.Model(&user).Update("virtual_balance", gorm.Expr("virtual_balance - ?", total)).Error; err != nil {
				return err
			}
			// Update or create position
			var pos models.Position
			result := tx.Where("user_id = ? AND symbol = ?", userID, req.Symbol).First(&pos)
			if result.Error != nil {
				// New position
				pos = models.Position{
					UserID:        userID,
					Symbol:        req.Symbol,
					Quantity:      req.Quantity,
					AvgEntryPrice: price,
				}
				if err := tx.Create(&pos).Error; err != nil {
					return err
				}
			} else {
				// Update existing: recalculate avg entry price
				totalCost := pos.AvgEntryPrice*pos.Quantity + price*req.Quantity
				newQty := pos.Quantity + req.Quantity
				newAvg := totalCost / newQty
				if err := tx.Model(&pos).Updates(map[string]interface{}{
					"quantity":        newQty,
					"avg_entry_price": math.Round(newAvg*100) / 100,
				}).Error; err != nil {
					return err
				}
			}
		} else { // SELL
			var pos models.Position
			if err := tx.Where("user_id = ? AND symbol = ?", userID, req.Symbol).First(&pos).Error; err != nil {
				return fmt.Errorf("no position in %s to sell", req.Symbol)
			}
			if pos.Quantity < req.Quantity {
				return fmt.Errorf("insufficient position: have %.8f, want to sell %.8f", pos.Quantity, req.Quantity)
			}

			// Credit balance
			if err := tx.Model(&user).Update("virtual_balance", gorm.Expr("virtual_balance + ?", total)).Error; err != nil {
				return err
			}

			newQty := pos.Quantity - req.Quantity
			if newQty < 0.00000001 { // effectively zero
				if err := tx.Delete(&pos).Error; err != nil {
					return err
				}
			} else {
				if err := tx.Model(&pos).Update("quantity", newQty).Error; err != nil {
					return err
				}
			}
		}

		// Record the trade
		if err := tx.Create(trade).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, err
	}

	return trade, nil
}

// ClosePosition sells the entire position at current market price.
func ClosePosition(db *gorm.DB, engine *market.PriceEngine, positionID uint, userID uint) (*models.Trade, error) {
	var pos models.Position
	if err := db.Where("id = ? AND user_id = ?", positionID, userID).First(&pos).Error; err != nil {
		return nil, fmt.Errorf("position not found")
	}

	return ExecuteOrder(db, engine, userID, models.OrderRequest{
		Symbol:   pos.Symbol,
		Side:     "SELL",
		Quantity: pos.Quantity,
	})
}

// GetPortfolio returns the user's full portfolio with live P&L.
func GetPortfolio(db *gorm.DB, engine *market.PriceEngine, userID uint) (*models.PortfolioResponse, error) {
	var user models.User
	if err := db.First(&user, userID).Error; err != nil {
		return nil, fmt.Errorf("user not found")
	}

	var positions []models.Position
	db.Where("user_id = ?", userID).Find(&positions)

	prices := engine.CurrentPrices()
	initialBalance := 100_000.00
	var inPositions float64
	details := make([]models.PositionDetail, 0, len(positions))

	for _, pos := range positions {
		currentPrice := prices[pos.Symbol]
		marketValue := currentPrice * pos.Quantity
		costBasis := pos.AvgEntryPrice * pos.Quantity
		pnl := marketValue - costBasis
		pnlPct := 0.0
		if costBasis > 0 {
			pnlPct = (pnl / costBasis) * 100
		}

		inPositions += marketValue
		details = append(details, models.PositionDetail{
			Position:     pos,
			CurrentPrice: currentPrice,
			MarketValue:  math.Round(marketValue*100) / 100,
			PnL:          math.Round(pnl*100) / 100,
			PnLPercent:   math.Round(pnlPct*100) / 100,
		})
	}

	totalValue := user.VirtualBalance + inPositions
	totalPnL := totalValue - initialBalance
	totalPnLPct := 0.0
	if initialBalance > 0 {
		totalPnLPct = (totalPnL / initialBalance) * 100
	}

	return &models.PortfolioResponse{
		Balance:     user.VirtualBalance,
		InPositions: math.Round(inPositions*100) / 100,
		TotalValue:  math.Round(totalValue*100) / 100,
		PnL:         math.Round(totalPnL*100) / 100,
		PnLPercent:  math.Round(totalPnLPct*100) / 100,
		Positions:   details,
	}, nil
}

// CheckAndAwardAchievements checks if the user earned any new achievements after a trade.
func CheckAndAwardAchievements(db *gorm.DB, userID uint) {
	var tradeCount int64
	db.Model(&models.Trade{}).Where("user_id = ?", userID).Count(&tradeCount)

	type achievementRule struct {
		code      string
		condition bool
	}

	rules := []achievementRule{
		{"first_trade", tradeCount >= 1},
		{"trader_10", tradeCount >= 10},
		{"trader_50", tradeCount >= 50},
		{"trader_100", tradeCount >= 100},
	}

	for _, rule := range rules {
		if !rule.condition {
			continue
		}
		var achievement models.Achievement
		if err := db.Where("code = ?", rule.code).First(&achievement).Error; err != nil {
			continue
		}
		// Check if already awarded
		var existing models.UserAchievement
		if err := db.Where("user_id = ? AND achievement_id = ?", userID, achievement.ID).First(&existing).Error; err == nil {
			continue // already has it
		}
		db.Create(&models.UserAchievement{
			UserID:        userID,
			AchievementID: achievement.ID,
			EarnedAt:      time.Now(),
		})
	}
}
