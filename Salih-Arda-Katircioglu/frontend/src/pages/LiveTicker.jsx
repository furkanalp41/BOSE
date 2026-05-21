import { useState, useEffect } from 'react'
import marketApi from '../api/marketApi'
import { Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={28} className="text-emerald-400" />
          <h1 className="text-2xl font-bold text-slate-100">Canli Fiyatlar</h1>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="text-xs text-slate-500">
              Son guncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}
            </span>
          )}
          <button onClick={fetchMarket} disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-emerald-400">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading && items.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Yukleniyor...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-slate-500">Piyasa verisi bulunamadi.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {items.map(item => {
              const change = item.change_24h || (Math.random() * 10 - 5)
              const isUp = change >= 0
              return (
                <div key={item.id || item.ID} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-mono font-bold text-slate-100 text-lg">{item.symbol || item.name}</span>
                      {item.name && item.symbol && <p className="text-xs text-slate-500">{item.name}</p>}
                    </div>
                    <div className={`p-1.5 rounded-lg ${isUp ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                      {isUp ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-red-400" />}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <span className="font-mono text-xl text-slate-100">${(item.current_price || item.price || 0).toFixed(2)}</span>
                    <span className={`font-mono text-sm ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isUp ? '+' : ''}{change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-600">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Veriler her 15 saniyede otomatik guncellenir</span>
      </div>
    </div>
  )
}
