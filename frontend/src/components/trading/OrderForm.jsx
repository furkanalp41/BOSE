import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tradingApi } from '../../services/api'
import { useMarketSocket } from '../../hooks/useMarketSocket'

export default function OrderForm({ onOrderPlaced }) {
  const { prices, assets } = useMarketSocket()
  const [symbol, setSymbol] = useState('')
  const [side, setSide] = useState('buy')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (assets.length > 0 && !symbol) setSymbol(assets[0].symbol)
  }, [assets])

  const livePrice = prices[symbol]?.price
  const estimatedTotal = livePrice && quantity ? (livePrice * Number(quantity)).toFixed(2) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symbol || !quantity || Number(quantity) <= 0) return
    setLoading(true); setError(''); setSuccess('')
    try {
      const { data } = await tradingApi.placeOrder({ symbol, side: side.toUpperCase(), quantity: Number(quantity) })
      const label = side.toUpperCase()
      setSuccess(`${label} order for ${quantity} ${symbol} executed!${data.trade?.total != null ? ` Total: $${data.trade.total.toFixed(2)}` : ''}`)
      setQuantity('')
      setTimeout(() => setSuccess(''), 4000)
      onOrderPlaced?.()
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed')
    } finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon/20 to-ice/10 border border-neon/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Place Order</h3>
          <p className="text-silver text-xs">Execute market orders instantly</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-2">
          {['buy', 'sell'].map((s) => (
            <button key={s} type="button" onClick={() => setSide(s)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border uppercase
                ${side === s
                  ? s === 'buy'
                    ? 'bg-neon/10 border-neon/30 text-neon shadow-neon-sm'
                    : 'bg-crimson/10 border-crimson/30 text-crimson shadow-crimson-sm'
                  : 'bg-white/[0.02] border-border text-silver hover:border-white/20'}`}>
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-silver text-xs font-medium tracking-widest uppercase">Asset</label>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)}
            className="input-base py-2.5 text-sm bg-void appearance-none cursor-pointer">
            {assets.map((a) => (
              <option key={a.symbol} value={a.symbol}>{a.symbol} — {a.name}</option>
            ))}
          </select>
        </div>

        {livePrice && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-border">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-silver text-xs">Live Price:</span>
            <span className="text-cloud font-mono font-bold text-sm">${livePrice.toFixed(2)}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-silver text-xs font-medium tracking-widest uppercase">Quantity</label>
          <input type="number" min="0.01" step="0.01" value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter amount" className="input-base py-2.5 text-sm" />
        </div>

        {estimatedTotal && (
          <div className="flex justify-between items-center px-4 py-3 rounded-xl bg-white/[0.03] border border-border">
            <span className="text-silver text-xs">Estimated Total</span>
            <span className="text-cloud font-mono font-bold">${Number(estimatedTotal).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}

        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-neon text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" disabled={loading || !quantity || !symbol}
          className={`w-full h-12 rounded-xl text-sm font-bold transition-all duration-300 uppercase
            ${side === 'buy'
              ? 'bg-neon text-void hover:shadow-neon-md active:scale-[0.98] disabled:opacity-40'
              : 'bg-crimson text-white hover:shadow-crimson-md active:scale-[0.98] disabled:opacity-40'}`}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              Executing...
            </span>
          ) : `${side} ${symbol || 'Asset'}`}
        </button>
      </form>
    </motion.div>
  )
}
