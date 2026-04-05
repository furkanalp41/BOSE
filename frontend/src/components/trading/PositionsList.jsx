import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tradingApi } from '../../services/api'
import { useMarketSocket } from '../../hooks/useMarketSocket'

export default function PositionsList({ refreshKey }) {
  const { prices } = useMarketSocket()
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(null)
  const [error, setError] = useState('')

  const fetchPositions = useCallback(async () => {
    try {
      const { data } = await tradingApi.getPositions()
      setPositions(data.positions || [])
    } catch { setPositions([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchPositions() }, [fetchPositions, refreshKey])

  const handleClose = async (id) => {
    setClosing(id); setError('')
    try {
      await tradingApi.closePosition(id)
      setPositions((prev) => prev.filter((p) => p.ID !== id && p.id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to close position')
    } finally { setClosing(null) }
  }

  const calcPnL = (pos) => {
    const live = prices[pos.symbol]?.price
    if (!live) return null
    const diff = pos.side === 'BUY'
      ? (live - pos.entryPrice) * pos.quantity
      : (pos.entryPrice - live) * pos.quantity
    return diff
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
      className="glass p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice/20 to-neon/10 border border-ice/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Open Positions</h3>
          <p className="text-silver text-xs">Live P&L tracking</p>
        </div>
      </div>

      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.span className="block w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      ) : positions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No open positions</p>
          <p className="text-silver/50 text-xs mt-1">Place an order to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {positions.map((pos) => {
              const pnl = calcPnL(pos)
              const isProfit = pnl !== null && pnl >= 0
              const id = pos.ID || pos.id
              return (
                <motion.div key={id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }} transition={{ duration: 0.3 }}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-border hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border
                      ${pos.side === 'BUY' ? 'text-neon bg-neon/10 border-neon/20' : 'text-crimson bg-crimson/10 border-crimson/20'}`}>
                      {pos.side}
                    </span>
                    <div className="min-w-0">
                      <p className="text-cloud font-mono font-bold text-sm">{pos.symbol}</p>
                      <p className="text-silver text-xs">
                        {pos.quantity} × ${pos.entryPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {pnl !== null && (
                      <div className="text-right">
                        <p className={`font-mono font-bold text-sm ${isProfit ? 'text-neon' : 'text-crimson'}`}>
                          {isProfit ? '+' : ''}{pnl.toFixed(2)}
                        </p>
                        <p className="text-silver text-[10px]">P&L</p>
                      </div>
                    )}
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => handleClose(id)} disabled={closing === id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20 transition-colors disabled:opacity-40">
                      {closing === id ? '...' : 'Close'}
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
