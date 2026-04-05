import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { tradingApi } from '../../services/api'

export default function PositionsList({ refreshKey }) {
  const [stats, setStats] = useState({ total: 0, buys: 0, sells: 0, volume: 0 })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await tradingApi.getHistory()
      const trades = data.trades || data.history || data || []
      const list = Array.isArray(trades) ? trades : []
      const buys = list.filter(t => (t.side || t.Side) === 'BUY').length
      const sells = list.filter(t => (t.side || t.Side) === 'SELL').length
      const volume = list.reduce((sum, t) => sum + (t.total || t.Total || 0), 0)
      setStats({ total: list.length, buys, sells, volume: Math.round(volume * 100) / 100 })
    } catch { setStats({ total: 0, buys: 0, sells: 0, volume: 0 }) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats, refreshKey])

  const cards = [
    { label: 'Total Trades', value: stats.total, color: 'text-cloud', border: 'border-border' },
    { label: 'Buys', value: stats.buys, color: 'text-neon', border: 'border-neon/20' },
    { label: 'Sells', value: stats.sells, color: 'text-crimson', border: 'border-crimson/20' },
    { label: 'Volume', value: `$${stats.volume.toLocaleString()}`, color: 'text-ice', border: 'border-ice/20' },
  ]

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
          <h3 className="text-lg font-bold text-cloud">Trade Summary</h3>
          <p className="text-silver text-xs">Overview of your trading activity</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.span className="block w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {cards.map(card => (
            <div key={card.label}
              className={`flex flex-col gap-1 p-4 rounded-xl bg-white/[0.02] border ${card.border} transition-colors`}>
              <span className="text-silver text-xs tracking-wide">{card.label}</span>
              <span className={`font-mono font-bold text-2xl ${card.color}`}>{card.value}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
