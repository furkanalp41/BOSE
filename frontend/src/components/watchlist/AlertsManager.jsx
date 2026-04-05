import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { alertApi } from '../../services/api'

export default function AlertsManager() {
  const [alerts, setAlerts] = useState([])
  const [form, setForm] = useState({ watchlist_id: '', market_item_id: '', target_price: '', condition: 'ABOVE' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { watchlist_id, market_item_id, target_price, condition } = form
    if (!watchlist_id || !market_item_id || !target_price) return
    setCreating(true); setError(''); setSuccess('')
    try {
      const payload = {
        watchlist_id: Number(watchlist_id),
        market_item_id: Number(market_item_id),
        target_price: Number(target_price),
        condition,
      }
      const { data } = await alertApi.create(payload)
      const alert = data.data || data
      setAlerts(prev => [...prev, {
        id: alert.ID || alert.id || Date.now(),
        ...payload,
        is_active: true,
      }])
      setSuccess(`Alert created: ${condition} $${target_price}`)
      setForm({ watchlist_id: '', market_item_id: '', target_price: '', condition: 'ABOVE' })
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create alert')
    } finally { setCreating(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-neon/10 border border-amber-400/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Price Alerts</h3>
          <p className="text-silver text-xs">Get notified when prices hit targets</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          {['ABOVE', 'BELOW'].map((c) => (
            <button key={c} type="button" onClick={() => updateField('condition', c)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border uppercase
                ${form.condition === c
                  ? c === 'ABOVE'
                    ? 'bg-neon/10 border-neon/30 text-neon shadow-neon-sm'
                    : 'bg-crimson/10 border-crimson/30 text-crimson shadow-crimson-sm'
                  : 'bg-white/[0.02] border-border text-silver hover:border-white/20'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Watchlist ID</label>
            <input type="number" min="1" value={form.watchlist_id}
              onChange={(e) => updateField('watchlist_id', e.target.value)}
              placeholder="ID" className="input-base py-2.5 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Market Item ID</label>
            <input type="number" min="1" value={form.market_item_id}
              onChange={(e) => updateField('market_item_id', e.target.value)}
              placeholder="ID" className="input-base py-2.5 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Target Price</label>
            <input type="number" min="0.01" step="0.01" value={form.target_price}
              onChange={(e) => updateField('target_price', e.target.value)}
              placeholder="$0.00" className="input-base py-2.5 text-sm" />
          </div>
        </div>

        <button type="submit"
          disabled={creating || !form.watchlist_id || !form.market_item_id || !form.target_price}
          className="w-full h-12 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
          {creating ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              Creating...
            </span>
          ) : 'Create Alert'}
        </button>
      </form>

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

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No alerts yet</p>
          <p className="text-silver/50 text-xs mt-1">Create price alerts to track market movements</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div key={alert.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-border hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border
                    ${alert.condition === 'ABOVE' ? 'text-neon bg-neon/10 border-neon/20' : 'text-crimson bg-crimson/10 border-crimson/20'}`}>
                    {alert.condition}
                  </span>
                  <div className="min-w-0">
                    <p className="text-cloud font-mono font-bold text-sm">
                      ${Number(alert.target_price).toFixed(2)}
                    </p>
                    <p className="text-silver text-xs">
                      WL #{alert.watchlist_id} · Item #{alert.market_item_id}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border
                  ${alert.is_active ? 'text-neon bg-neon/10 border-neon/20' : 'text-silver bg-white/5 border-border'}`}>
                  {alert.is_active ? 'active' : 'inactive'}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
