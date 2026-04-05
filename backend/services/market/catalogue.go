package market

// BuildAssetCatalogue returns the full asset list with live prices merged in.
func BuildAssetCatalogue(engine *PriceEngine) []Asset {
	prices := engine.CurrentPrices()

	catalogue := []Asset{
		{Symbol: "BTC", Name: "Bitcoin", Category: "crypto", MarketCap: 1_330_000_000_000, Volume24h: 28_400_000_000, Change24h: 2.34},
		{Symbol: "ETH", Name: "Ethereum", Category: "crypto", MarketCap: 425_000_000_000, Volume24h: 14_200_000_000, Change24h: 1.87},
		{Symbol: "SOL", Name: "Solana", Category: "crypto", MarketCap: 76_500_000_000, Volume24h: 3_800_000_000, Change24h: -0.92},
		{Symbol: "THYAO", Name: "Turk Hava Yollari", Category: "bist", MarketCap: 9_870_000_000, Volume24h: 230_000_000, Change24h: 3.12},
		{Symbol: "ASELS", Name: "Aselsan", Category: "bist", MarketCap: 7_420_000_000, Volume24h: 120_000_000, Change24h: -1.45},
		{Symbol: "AAPL", Name: "Apple Inc.", Category: "nasdaq", MarketCap: 2_940_000_000_000, Volume24h: 62_300_000_000, Change24h: 0.75},
		{Symbol: "NVDA", Name: "NVIDIA Corp.", Category: "nasdaq", MarketCap: 2_157_000_000_000, Volume24h: 48_100_000_000, Change24h: 4.21},
		{Symbol: "GOOGL", Name: "Alphabet Inc.", Category: "nasdaq", MarketCap: 2_120_000_000_000, Volume24h: 31_500_000_000, Change24h: -0.33},
	}

	for i := range catalogue {
		if p, ok := prices[catalogue[i].Symbol]; ok {
			catalogue[i].Price = p
		}
	}
	return catalogue
}

// ValidSymbol checks if a symbol exists in the engine.
func ValidSymbol(engine *PriceEngine, symbol string) bool {
	prices := engine.CurrentPrices()
	_, ok := prices[symbol]
	return ok
}
