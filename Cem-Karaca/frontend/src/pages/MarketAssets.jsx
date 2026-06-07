import { useState, useEffect } from 'react'
import api from '../api/axios'
import marketApi from '../api/marketApi'
import Modal from '../components/Modal'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import FloatingInput from '../ui/FloatingInput'
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
      // Cem backend market order: POST /orders/market { symbol, side (BUY|SELL), quantity }
      await api.post('/orders/market', { symbol: tradeAsset.symbol, side: orderType, quantity: parseFloat(quantity) })
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
        <h1 className="text-2xl font-bold text-cloud">Market</h1>
        <div className="flex gap-1 bg-panel border border-edge rounded-lg p-1">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === k ? 'bg-neon/10 text-neon shadow-neon-sm' : 'text-silver hover:text-cloud'}`}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div className="p-3 bg-crimson/10 border border-crimson/30 rounded-lg text-crimson text-sm">{error}</div>}

      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-silver">Yukleniyor...</div>
        ) : assets.length === 0 ? (
          <div className="text-center py-16 text-silver">Varlik bulunamadi.</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-silver border-b border-edge text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3">Sembol</th><th className="text-left">Ad</th><th className="text-left">Tip</th>
              <th className="text-right">Fiyat</th><th className="text-right">24s</th><th className="text-right">Hacim</th>
              <th className="text-right px-6">Islem</th>
            </tr></thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-edge/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-cloud">{a.symbol}</td>
                  <td className="text-silver">{a.name}</td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full ${a.asset_type === 'crypto' ? 'bg-ice/10 text-ice' : 'bg-neon/10 text-neon'}`}>{a.asset_type}</span></td>
                  <td className="text-right font-mono text-cloud">${a.current_price?.toFixed(2)}</td>
                  <td className={`text-right font-mono ${(a.change_24h || 0) >= 0 ? 'text-bull' : 'text-bear'}`}>
                    {(a.change_24h || 0) >= 0 ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                    {(a.change_24h || 0) >= 0 ? '+' : ''}{(a.change_24h || 0).toFixed(2)}%
                  </td>
                  <td className="text-right font-mono text-silver">{(a.volume_24h || 0).toLocaleString()}</td>
                  <td className="text-right px-6">
                    <button onClick={() => { setTradeAsset(a); setOrderType('buy'); setQuantity(''); setOrderMsg('') }}
                      className="px-3 py-1.5 bg-neon/10 text-neon hover:bg-neon/20 hover:shadow-neon-sm text-xs rounded-lg transition-all inline-flex items-center gap-1">
                      <ShoppingCart size={12} /> Islem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>

      <Modal open={!!tradeAsset} onClose={() => setTradeAsset(null)} title={`${tradeAsset?.symbol} - Emir Ver`}>
        {tradeAsset && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-silver">
              <span>Guncel Fiyat:</span>
              <span className="font-mono text-cloud font-semibold">${tradeAsset.current_price?.toFixed(2)}</span>
            </div>
            <div className="flex gap-1 bg-panel border border-edge rounded-lg p-1">
              {['buy', 'sell'].map(t => (
                <button key={t} onClick={() => setOrderType(t)}
                  className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${orderType === t
                    ? (t === 'buy' ? 'bg-bull/15 text-bull' : 'bg-bear/15 text-bear')
                    : 'text-silver hover:text-cloud'}`}>
                  {t === 'buy' ? 'Al' : 'Sat'}
                </button>
              ))}
            </div>
            <FloatingInput label="Miktar" type="number" min="0" step="0.01" value={quantity}
              onChange={e => setQuantity(e.target.value)} placeholder="0.00" className="font-mono" />
            {quantity > 0 && (
              <div className="flex justify-between text-sm bg-white/5 border border-edge p-3 rounded-lg">
                <span className="text-silver">Toplam Tutar</span>
                <span className="font-mono text-cloud font-semibold">${(parseFloat(quantity) * tradeAsset.current_price).toFixed(2)}</span>
              </div>
            )}
            {orderMsg && <div className={`p-3 rounded-lg text-sm ${orderMsg.includes('basari') ? 'bg-neon/10 text-neon' : 'bg-crimson/10 text-crimson'}`}>{orderMsg}</div>}
            <NeonButton variant={orderType === 'buy' ? 'primary' : 'danger'} onClick={handleOrder}
              disabled={orderLoading || !quantity || parseFloat(quantity) <= 0} className="w-full">
              {orderLoading ? 'Isleniyor...' : orderType === 'buy' ? 'Satin Al' : 'Sat'}
            </NeonButton>
          </div>
        )}
      </Modal>
    </div>
  )
}
