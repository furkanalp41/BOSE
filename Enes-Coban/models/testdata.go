package models

func GetTestData() []*Person {
	// Sample Stocks
	appl := &StockItem{ID: 1, Name: "AAPL", Price: 175.50, Desc: "Tech - Consumer Electronics", RiskScore: 4}
	msft := &StockItem{ID: 2, Name: "MSFT", Price: 420.20, Desc: "Tech - Software & Cloud", RiskScore: 3}
	tsla := &StockItem{ID: 3, Name: "TSLA", Price: 210.80, Desc: "Auto - EV", RiskScore: 8}
	gme := &StockItem{ID: 4, Name: "GME", Price: 15.30, Desc: "Retail - Gaming (Meme stock)", RiskScore: 10}
	thyao := &StockItem{ID: 5, Name: "THYAO.IS", Price: 10.50, Desc: "Airlines", RiskScore: 6}
	sise := &StockItem{ID: 6, Name: "SISE.IS", Price: 1.80, Desc: "Glass Manufacturing", RiskScore: 4}
	bnd := &StockItem{ID: 7, Name: "BND", Price: 72.10, Desc: "Vanguard Total Bond Market ETF", RiskScore: 1}
	voo := &StockItem{ID: 8, Name: "VOO", Price: 470.00, Desc: "S&P 500 ETF", RiskScore: 3}

	p1 := &Person{
		ID:         1,
		Name:       "Alice (Conservative)",
		Preference: 2, // Low risk
		Portfolio: map[*StockItem]int16{
			bnd: 100,
			voo: 50,
			msft: 10,
		},
		Watchlist: []StockItem{*appl, *sise},
	}

	p2 := &Person{
		ID:         2,
		Name:       "Bob (Aggressive)",
		Preference: 9, // High risk
		Portfolio: map[*StockItem]int16{
			tsla: 80,
			gme:  500,
			thyao: 200,
		},
		Watchlist: []StockItem{*appl, *msft}, // Watching safe stocks
	}

	p3 := &Person{
		ID:         3,
		Name:       "Charlie (Mismatched)",
		Preference: 1, // Wants low risk but has high risk portfolio
		Portfolio: map[*StockItem]int16{
			tsla: 100,
			gme:  200,
		},
		Watchlist: []StockItem{*bnd, *voo},
	}

	return []*Person{p1, p2, p3}
}
