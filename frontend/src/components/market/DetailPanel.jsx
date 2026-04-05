import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import AssetChart from './AssetChart'
import { fmtPrice, fmtPct, fmtCap } from '../../lib/format'
import { tradingApi, watchlistApi, alertApi } from '../../services/api'

function Stat({ label, value, highlight }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">{label}</span>
      <span className={clsx('font-mono text-sm font-semibold', highlight ?? 'text-white')}>
        {value}
      </span>
    </div>
  )
}

function Toast({ message, type }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className={clsx('px-4 py-2 rounded-xl text-xs font-semibold font-mono border',
        type === 'success' ? 'bg-neon/10 text-neon border-neon/20' : 'bg-crimson/10 text-crimson border-crimson/20'
      )}>
      {message}
    </motion.div>
  )
}

export default function DetailPanel({ asset, price, history }) {
  const [qty, setQty] = useState('')
  const [loading, setLoading] = useState(null)
  const [toast, setToast] = useState(null)
  const [alertMode, setAlertMode] = useState(false)
  const [alertPrice, setAlertPrice] = useState('')
  const [alertCondition, setAlertCondition] = useState('above')
  const [alertLoading, setAlertLoading] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleOrder = async (side) => {
    const q = parseFloat(qty)
    if (!q || q <= 0) return showToast('Enter a valid quantity', 'error')
    setLoading(side)
    try {
      await tradingApi.placeOrder({ symbol: asset.symbol, side: side.toUpperCase(), quantity: q })
      showToast(`${side.toUpperCase()} order placed for ${q} ${asset.symbol}`)
      setQty('')
    } catch (err) {
      showToast(err.response?.data?.error || `Failed to place ${side} order`, 'error')
    } finally { setLoading(null) }
  }

  const handleAddToWatchlist = async () => {
    try {
      const { data } = await watchlistApi.create('Favorites')
      const wlId = data?.data?.ID || data?.data?.id || data?.ID || data?.id
      if (wlId) {
        await watchlistApi.addItem(wlId, asset.id || asset.ID)
        showToast(`${asset.symbol} added to Favorites`)
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to add to watchlist'
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
        showToast(`${asset.symbol} already in watchlist`, 'error')
      } else {
        showToast(msg, 'error')
      }
    }
  }

  const handleCreateAlert = async () => {
    const tp = parseFloat(alertPrice)
    if (!tp || tp <= 0) return showToast('Enter a valid target price', 'error')
    setAlertLoading(true)
    try {
      await alertApi.create({
        market_item_id: asset.id || asset.ID,
        target_price: tp,
        condition: alertCondition,
      })
      showToast(`Alert set: ${asset.symbol} ${alertCondition} $${tp}`)
      setAlertMode(false)
      setAlertPrice('')
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to create alert', 'error')
    } finally { setAlertLoading(false) }
  }

  if (!asset) {
    return (
      <div className="glass rounded-2xl flex-1 flex items-center justify-center p-8">
        <p className="text-white/25 font-mono text-sm">← Select an asset to view details</p>
      </div>
    )
  }

  const isBull = (price?.changePct ?? asset.change24h ?? 0) >= 0
  const direction = isBull ? 'up' : 'down'
  const currentPrice  = price?.price     ?? asset.price
  const currentChange = price?.changePct ?? asset.change24h

  return (
    <div
      className={clsx(
        'glass rounded-2xl flex-1 flex flex-col overflow-hidden transition-all duration-500',
        isBull ? 'border-bull/20' : 'border-bear/20',
        'border'
      )}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-white/5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="font-mono font-bold text-2xl text-white">{asset.symbol}</h2>
            <span className="text-white/40 text-sm font-sans">{asset.name}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="font-mono font-bold text-3xl text-white">
              ${fmtPrice(currentPrice, asset.symbol)}
            </span>
            <span
              className={clsx(
                'font-mono text-sm font-semibold flex items-center gap-1',
                isBull ? 'text-bull' : 'text-bear'
              )}
            >
              <span>{isBull ? '▲' : '▼'}</span>
              {fmtPct(currentChange)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Star — add to watchlist */}
          <button onClick={handleAddToWatchlist} title="Add to Watchlist"
            className="p-2 rounded-lg border border-white/10 hover:border-amber-400/30 hover:bg-amber-400/10 transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="text-white/40 group-hover:text-amber-400 transition-colors">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
          {/* Bell — create alert */}
          <button onClick={() => setAlertMode(!alertMode)} title="Set Price Alert"
            className={clsx('p-2 rounded-lg border transition-colors group',
              alertMode ? 'border-ice/30 bg-ice/10' : 'border-white/10 hover:border-ice/30 hover:bg-ice/10')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={clsx(alertMode ? 'text-ice' : 'text-white/40 group-hover:text-ice', 'transition-colors')}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <div
            className={clsx(
              'rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest shrink-0',
              isBull
                ? 'bg-bull/10 text-bull border border-bull/20 shadow-glow-bull'
                : 'bg-bear/10 text-bear border border-bear/20 shadow-glow-bear'
            )}
          >
            {isBull ? 'BULLISH' : 'BEARISH'}
          </div>
        </div>
      </div>

      {/* Alert form */}
      <AnimatePresence>
        {alertMode && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/5">
            <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
              <span className="text-white/50 text-xs font-mono">Alert when price is</span>
              <select value={alertCondition} onChange={e => setAlertCondition(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-ice/30">
                <option value="above">above</option>
                <option value="below">below</option>
              </select>
              <div className="flex items-center gap-1">
                <span className="text-white/30 text-xs">$</span>
                <input type="number" value={alertPrice} onChange={e => setAlertPrice(e.target.value)}
                  placeholder={currentPrice?.toFixed(2)} step="any"
                  className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-ice/30" />
              </div>
              <button onClick={handleCreateAlert} disabled={alertLoading}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-ice/10 text-ice border border-ice/20 hover:bg-ice/20 transition-colors disabled:opacity-40">
                {alertLoading ? '...' : 'Create Alert'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart */}
      <div className="px-2 pt-4 pb-2" style={{ height: 260 }}>
        {history?.length > 1 ? (
          <AssetChart symbol={asset.symbol} data={history} direction={direction} />
        ) : (
          <div className="h-full flex items-center justify-center text-white/20 font-mono text-sm">
            Awaiting data…
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-6 pb-4 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-5 border-t border-white/5">
        <Stat label="Market Cap"    value={fmtCap(asset.marketCap)} />
        <Stat label="24h Volume"    value={fmtCap(asset.volume24h)} />
        <Stat label="24h Change"    value={fmtPct(asset.change24h)}
              highlight={asset.change24h >= 0 ? 'text-bull' : 'text-bear'} />
        <Stat label="Category"      value={asset.category?.toUpperCase()} />
      </div>

      {/* Quick Trade */}
      <div className="px-6 pb-5 pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider shrink-0">Quick Trade</span>
          <input type="number" value={qty} onChange={e => setQty(e.target.value)}
            placeholder="Quantity" min="0" step="any"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-brand/30" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleOrder('buy')} disabled={loading === 'buy'}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-neon/10 text-neon border border-neon/20 hover:bg-neon/20 transition-colors disabled:opacity-40">
            {loading === 'buy' ? '...' : 'BUY'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleOrder('sell')} disabled={loading === 'sell'}
            className="px-5 py-2 rounded-lg text-xs font-bold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20 transition-colors disabled:opacity-40">
            {loading === 'sell' ? '...' : 'SELL'}
          </motion.button>
        </div>
        <AnimatePresence>
          {toast && (
            <div className="mt-3">
              <Toast message={toast.message} type={toast.type} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
