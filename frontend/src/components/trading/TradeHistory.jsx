import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { tradingApi } from '../../services/api'

const FILTER_KEYS = [
  { key: 'all', label: 'All Orders' },
  { key: 'buy', label: 'Buy' },
  { key: 'sell', label: 'Sell' },
]

const STATUS_STYLES = {
  filled:    'text-neon bg-neon/10 border-neon/20',
  pending:   'text-amber-400 bg-amber-400/10 border-amber-400/20',
  cancelled: 'text-silver bg-white/5 border-border',
}

export default function TradeHistory() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await tradingApi.getHistory()
      const all = Array.isArray(data) ? data : (data.trades || data.history || [])
      const filtered = filter === 'all' ? all
        : filter === 'buy' ? all.filter(t => (t.side || '').toUpperCase() === 'BUY')
        : all.filter(t => (t.side || '').toUpperCase() === 'SELL')
      setOrders(filtered)
    } catch (err) {
      console.error('Failed to fetch trade history:', err)
      setOrders([])
    }
    finally { setLoading(false) }
  }, [filter])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      className="glass p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-ice/10 border border-purple-500/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Order History</h3>
          <p className="text-silver text-xs">All orders with live status</p>
        </div>
      </div>

      <div className="flex gap-2">
        {FILTER_KEYS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all
              ${filter === f.key
                ? 'bg-brand/20 text-brand border border-brand/30 shadow-glow-brand'
                : 'text-white/40 border border-white/8 hover:text-white/70 hover:border-white/15'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.span className="block w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No orders yet</p>
          <p className="text-silver/50 text-xs mt-1">Your orders will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-silver text-xs font-medium tracking-widest uppercase border-b border-border">
                <th className="text-left py-3 pr-4">Date</th>
                <th className="text-left py-3 pr-4">Type</th>
                <th className="text-left py-3 pr-4">Asset</th>
                <th className="text-right py-3 pr-4">Qty</th>
                <th className="text-right py-3 pr-4">Price</th>
                <th className="text-right py-3 pr-4">Total</th>
                <th className="text-center py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {orders.map((order) => {
                  const id = order.id || order.ID
                  const type = (order.side || order.order_type || '').toUpperCase()
                  const status = (order.status || 'filled').toLowerCase()
                  return (
                    <motion.tr key={id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pr-4 text-silver font-mono text-xs">
                        {new Date(order.createdAt || order.created_at || order.CreatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border
                          ${type === 'BUY' ? 'text-neon bg-neon/10 border-neon/20' : 'text-crimson bg-crimson/10 border-crimson/20'}`}>
                          {type}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-cloud font-mono font-semibold">{order.symbol}</td>
                      <td className="py-3 pr-4 text-right text-cloud font-mono">{order.quantity}</td>
                      <td className="py-3 pr-4 text-right text-cloud font-mono">${order.price?.toFixed(2)}</td>
                      <td className="py-3 pr-4 text-right text-cloud font-mono font-semibold">
                        ${(order.total || order.price * order.quantity)?.toFixed(2)}
                      </td>
                      <td className="py-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_STYLES[status] || STATUS_STYLES.filled}`}>
                          {status}
                        </span>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
