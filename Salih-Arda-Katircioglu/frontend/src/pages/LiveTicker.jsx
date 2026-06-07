import { useState, useEffect } from 'react'
import marketApi from '../api/marketApi'
import { Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

// Yakup's PriceTick → existing render shape. JSX reads
// item.symbol, item.current_price, item.change_24h.
function tickToItem(t) {
  return {
    id: t.symbol,
    symbol: t.symbol,
    name: t.name || t.symbol,
    current_price: t.price ?? 0,
    change_24h: t.change24h ?? 0,
  }
}

export default function LiveTicker() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchMarket = () => {
    setLoading(true)
    // Market data lives on Yakup's service (:8084), not Salih's own backend.
    marketApi.get('/market/prices')
      .then(r => {
        setItems((r.data.data || []).map(tickToItem))
        setLastUpdate(new Date())
      })
      .catch(() => setError('Piyasa verileri yuklenemedi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchMarket()
    const interval = setInterval(fetchMarket, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={28} className="text-neon" />
          <h1 className="text-2xl font-bold text-cloud">Canli Fiyatlar</h1>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-xs text-silver">
              Son guncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
            </span>
          )}
          <button onClick={fetchMarket} disabled={loading}
            className="rounded-lg border border-edge bg-white/5 p-2 text-silver transition-colors hover:border-neon hover:text-neon">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">{error}</div>}

      <GlassCard className="overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="py-16 text-center text-silver">Yukleniyor...</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-silver">Piyasa verisi bulunamadi.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map(item => {
              const change = item.change_24h || (Math.random() * 10 - 5)
              const isUp = change >= 0
              return (
                <div key={item.id || item.ID} className="rounded-xl border border-edge bg-card/60 p-4 transition-colors hover:border-neon/40">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-lg font-bold text-cloud">{item.symbol || item.name}</span>
                      {item.name && item.symbol && <p className="text-xs text-silver">{item.name}</p>}
                    </div>
                    <div className={`rounded-lg p-1.5 ${isUp ? 'bg-neon/10' : 'bg-crimson/10'}`}>
                      {isUp ? <TrendingUp size={16} className="text-bull" /> : <TrendingDown size={16} className="text-bear" />}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-mono text-xl text-cloud">${(item.current_price || item.price || 0).toFixed(2)}</span>
                    <span className={`font-mono text-sm ${isUp ? 'text-bull' : 'text-bear'}`}>
                      {isUp ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </GlassCard>

      <div className="flex items-center gap-2 text-xs text-silver">
        <div className="h-2 w-2 animate-pulse-neon rounded-full bg-neon" />
        <span>Veriler her 15 saniyede otomatik guncellenir</span>
      </div>
    </div>
  )
}
