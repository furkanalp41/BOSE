import { useState, useEffect } from 'react'
import api from '../api/axios'
import marketApi from '../api/marketApi'
import Modal from '../components/Modal'
import { TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react'

// Filter values from the local UI ('crypto', 'stock', 'all') map to Yakup's
// canonical asset types: 'CRYPTO', 'BIST', or no filter.
const TYPE_MAP = { crypto: 'CRYPTO', stock: 'BIST' }

// Yakup's PriceTick → existing render shape used by the JSX below.
// Keeps fields like current_price, change_24h, asset_type stable.
function tickToAsset(t) {
  return {
    id: t.symbol,
    symbol: t.symbol,
    name: t.name || t.symbol,
    asset_type: t.type === 'CRYPTO' ? 'crypto' : 'stock',
    current_price: t.price ?? t.currentPrice ?? 0,
    change_24h: t.change24h ?? 0,
    volume_24h: t.volume_24h ?? 0,
  }
}

export default function MarketAssets() {
  const [assets, setAssets] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tradeAsset, setTradeAsset] = useState(null)
  const [orderType, setOrderType] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderMsg, setOrderMsg] = useState('')

  const fetchAssets = () => {
    setLoading(true)
    const params = TYPE_MAP[filter] ? { type: TYPE_MAP[filter] } : {}
    // Market data lives on Yakup's service (:8084), not on Cem's own backend.
    marketApi.get('/market/prices', { params })
      .then(r => setAssets((r.data.data || []).map(tickToAsset)))
      .catch(() => setError('Varliklar yuklenemedi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAssets() }, [filter])

  const handleOrder = async () => {
    if (!quantity || parseFloat(quantity) <= 0) return
    setOrderLoading(true)
    setOrderMsg('')
    try {
      await api.post('/orders/', { symbol: tradeAsset.symbol, order_type: orderType, quantity: parseFloat(quantity) })
      setOrderMsg(`${orderType === 'buy' ? 'Alim' : 'Satim'} emri basariyla gerceklesti!`)
      setTimeout(() => { setTradeAsset(null); setOrderMsg(''); setQuantity('') }, 1500)
    } catch (err) {
      setOrderMsg(err.response?.data?.error || 'Emir basarisiz.')
    } finally { setOrderLoading(false) }
  }

  const tabs = [['all', 'Tumu'], ['crypto', 'Kripto'], ['stock', 'Hisse']]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Market</h1>
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === k ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400">Yukleniyor...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-16 text-slate-500">Varlik bulunamadi.</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3">Sembol</th><th className="text-left">Ad</th><th className="text-left">Tip</th>
              <th className="text-right">Fiyat</th><th className="text-right">24s</th><th className="text-right">Hacim</th>
              <th className="text-right px-6">Islem</th>
            </tr></thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-slate-100">{a.symbol}</td>
                  <td className="text-slate-300">{a.name}</td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full ${a.asset_type === 'crypto' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>{a.asset_type}</span></td>
                  <td className="text-right font-mono text-slate-100">${a.current_price?.toFixed(2)}</td>
                  <td className={`text-right font-mono ${(a.change_24h || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {(a.change_24h || 0) >= 0 ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                    {(a.change_24h || 0) >= 0 ? '+' : ''}{(a.change_24h || 0).toFixed(2)}%
                  </td>
                  <td className="text-right font-mono text-slate-400">{(a.volume_24h || 0).toLocaleString()}</td>
                  <td className="text-right px-6">
                    <button onClick={() => { setTradeAsset(a); setOrderType('buy'); setQuantity(''); setOrderMsg('') }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors inline-flex items-center gap-1">
                      <ShoppingCart size={12} /> Islem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!tradeAsset} onClose={() => setTradeAsset(null)} title={`${tradeAsset?.symbol} - Emir Ver`}>
        {tradeAsset && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Guncel Fiyat:</span>
              <span className="font-mono text-slate-100 font-semibold">${tradeAsset.current_price?.toFixed(2)}</span>
            </div>
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
              {['buy', 'sell'].map(t => (
                <button key={t} onClick={() => setOrderType(t)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${orderType === t
                    ? (t === 'buy' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white')
                    : 'text-slate-400 hover:text-slate-200'}`}>
                  {t === 'buy' ? 'Al' : 'Sat'}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Miktar</label>
              <input type="number" min="0" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00" />
            </div>
            {quantity > 0 && (
              <div className="flex justify-between text-sm bg-slate-800/50 p-3 rounded-lg">
                <span className="text-slate-400">Toplam Tutar</span>
                <span className="font-mono text-slate-100 font-semibold">${(parseFloat(quantity) * tradeAsset.current_price).toFixed(2)}</span>
              </div>
            )}
            {orderMsg && <div className={`p-3 rounded-lg text-sm ${orderMsg.includes('basari') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{orderMsg}</div>}
            <button onClick={handleOrder} disabled={orderLoading || !quantity || parseFloat(quantity) <= 0}
              className={`w-full py-2.5 font-medium rounded-lg transition-colors text-white ${orderType === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800' : 'bg-red-600 hover:bg-red-700 disabled:bg-red-800'} disabled:cursor-not-allowed`}>
              {orderLoading ? 'Isleniyor...' : orderType === 'buy' ? 'Satin Al' : 'Sat'}
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
