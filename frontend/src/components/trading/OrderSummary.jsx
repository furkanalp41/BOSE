import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ordersApi } from '../../services/api'

export default function PositionsList({ refreshKey }) {
  const [stats, setStats] = useState({ total: 0, pending: 0, filled: 0, cancelled: 0 })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await ordersApi.getAll()
      const orders = data.data || []
      setStats({
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        filled: orders.filter(o => o.status === 'filled').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
      })
    } catch { setStats({ total: 0, pending: 0, filled: 0, cancelled: 0 }) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats, refreshKey])

  const cards = [
    { label: 'Total Orders', value: stats.total, color: 'text-cloud', border: 'border-border' },
    { label: 'Filled', value: stats.filled, color: 'text-neon', border: 'border-neon/20' },
    { label: 'Pending', value: stats.pending, color: 'text-amber-400', border: 'border-amber-400/20' },
    { label: 'Cancelled', value: stats.cancelled, color: 'text-silver', border: 'border-border' },
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
          <h3 className="text-lg font-bold text-cloud">Order Summary</h3>
          <p className="text-silver text-xs">Overview of your orders</p>
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
