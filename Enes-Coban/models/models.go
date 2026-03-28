package models

import "fmt"

type StockItem struct {
	ID        int8
	Name      string
	Price     float64
	Desc      string // stock item description (category etc.)
	RiskScore int8   // risk score calculated by analysis engine (0-10, where 10 is highest risk)
}

func (s StockItem) String() string {
	return fmt.Sprintf("%s (Price: $%.2f, Risk: %d/10) - %s", s.Name, s.Price, s.RiskScore, s.Desc)
}

type Person struct {
	ID         int16
	Name       string
	Preference int8 // preferred user risk choice (0-10)
	Portfolio  map[*StockItem]int16 // map of StockItem pointer to quantity
	Watchlist  []StockItem
}

func (p Person) String() string {
	return fmt.Sprintf("%s (Risk Preference: %d/10)", p.Name, p.Preference)
}

type AnalysisReq struct {
	ID         int16
	Preference int8
	Portfolio  map[*StockItem]int16
	Watchlist  []StockItem
}

type AnalysisItem struct {
	ID         int16
	Preference int8   // preferred user risk choice
	Alignment  int8   // real portfolio and watchlist alignment score (0-100)
	Content    string // analysis content
}
