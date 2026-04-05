import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api, { alertApi } from '../../services/api'

export default function AlertsManager() {
  const [alerts, setAlerts] = useState([])
  const [triggered, setTriggered] = useState([])
  const [fetching, setFetching] = useState(true)
  const [form, setForm] = useState({ symbol: '', target_price: '', condition: 'ABOVE' })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deletingAlert, setDeletingAlert] = useState(null)

  const fetchAlerts = async () => {
    setFetching(true)
    try {
      const { data } = await alertApi.getAll()
      const list = data.data || data || []
      setAlerts(list.map(a => ({
        id: a.id || a.ID,
        symbol: a.symbol,
        target_price: a.target_price,
        condition: a.condition,
        is_active: a.is_active,
        createdAt: a.createdAt || a.created_at,
      })))
    } catch {
      setError('Failed to load alerts')
    } finally {
      setFetching(false)
    }
  }

  const fetchTriggered = async () => {
    try {
      const { data } = await api.get('/watchlist/alerts/triggered')
      const list = data.data || data || []
      setTriggered(list.map(t => ({
        alert: {
          id: t.alert?.id || t.alert?.ID,
          symbol: t.alert?.symbol,
          target_price: t.alert?.target_price,
          condition: t.alert?.condition,
        },
        currentPrice: t.currentPrice || t.current_price,
        triggeredAt: t.triggeredAt || t.triggered_at,
      })))
    } catch {
      // Endpoint may not exist yet -- silently skip
      setTriggered([])
    }
  }

  useEffect(() => {
    fetchAlerts()
    fetchTriggered()
  }, [])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(t)
    }
  }, [error])

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { symbol, target_price, condition } = form
    if (!symbol.trim() || !target_price) return
    setCreating(true)
    setError('')
    setSuccess('')
    try {
      await alertApi.create({
        symbol: symbol.trim().toUpperCase(),
        target_price: Number(target_price),
        condition,
      })
      setSuccess(`Alert created: ${symbol.toUpperCase()} ${condition} $${target_price}`)
      setForm({ symbol: '', target_price: '', condition: 'ABOVE' })
      fetchAlerts()
      fetchTriggered()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create alert')
    } finally {
      setCreating(false)
    }
  }

  const handleDeleteAlert = async (alertId) => {
    setDeletingAlert(alertId)
    setError('')
    try {
      await api.delete(`/watchlist/alerts/${alertId}`)
      setConfirmDelete(null)
      setSuccess('Alert deleted')
      fetchAlerts()
      fetchTriggered()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete alert')
    } finally {
      setDeletingAlert(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-6"
    >
      {/* ── Header ── */}
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

      {/* ── Create Form ── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Condition Toggle */}
        <div className="flex gap-2">
          {['ABOVE', 'BELOW'].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => updateField('condition', c)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border uppercase
                ${form.condition === c
                  ? c === 'ABOVE'
                    ? 'bg-neon/10 border-neon/30 text-neon shadow-neon-sm'
                    : 'bg-crimson/10 border-crimson/30 text-crimson shadow-crimson-sm'
                  : 'bg-white/[0.02] border-border text-silver hover:border-white/20'
                }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Symbol + Target Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Symbol</label>
            <input
              type="text"
              value={form.symbol}
              onChange={(e) => updateField('symbol', e.target.value.toUpperCase())}
              placeholder="e.g. BTC"
              className="input-base py-2.5 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Target Price</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.target_price}
              onChange={(e) => updateField('target_price', e.target.value)}
              placeholder="$0.00"
              className="input-base py-2.5 text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={creating || !form.symbol.trim() || !form.target_price}
          className="w-full h-12 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40"
        >
          {creating ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span
                className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
              Creating...
            </span>
          ) : 'Create Alert'}
        </button>
      </form>

      {/* ── Error Toast ── */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-crimson text-sm"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Success Toast ── */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-neon text-sm font-medium"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Triggered Alerts Section ── */}
      {triggered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-silver text-xs font-medium uppercase tracking-widest">Recently Triggered</p>
          </div>
          <AnimatePresence>
            {triggered.map((t, idx) => (
              <motion.div
                key={`triggered-${t.alert?.id || idx}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-silver/20 hover:border-silver/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border
                    ${t.alert?.condition === 'ABOVE'
                      ? 'text-neon/60 bg-neon/5 border-neon/10'
                      : 'text-crimson/60 bg-crimson/5 border-crimson/10'
                    }`}>
                    {t.alert?.condition}
                  </span>
                  <div className="min-w-0">
                    <p className="text-silver font-mono font-bold text-sm">{t.alert?.symbol}</p>
                    <p className="text-silver/60 text-xs">
                      Target: ${Number(t.alert?.target_price).toFixed(2)}
                      {t.currentPrice != null && (
                        <span className="ml-2">
                          Hit at: ${Number(t.currentPrice).toFixed(2)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-amber-400 bg-amber-400/10 border-amber-400/20 font-mono">
                    triggered
                  </span>
                  {t.triggeredAt && (
                    <p className="text-silver/40 text-[10px] mt-1">{formatDate(t.triggeredAt)}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Active Alerts List ── */}
      {fetching ? (
        <div className="flex justify-center py-8">
          <motion.span
            className="block w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No alerts yet</p>
          <p className="text-silver/50 text-xs mt-1">Create price alerts to track market movements</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-silver text-xs font-medium uppercase tracking-widest">
            All Alerts ({alerts.length})
          </p>
          <AnimatePresence>
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className={`flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] transition-colors
                  ${alert.is_active
                    ? 'border border-neon/20 hover:border-neon/30'
                    : 'border border-silver/10 hover:border-silver/20 opacity-60'
                  }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border
                    ${alert.condition === 'ABOVE'
                      ? 'text-neon bg-neon/10 border-neon/20'
                      : 'text-crimson bg-crimson/10 border-crimson/20'
                    }`}>
                    {alert.condition}
                  </span>
                  <div className="min-w-0">
                    <p className="text-cloud font-mono font-bold text-sm">{alert.symbol}</p>
                    <p className="text-silver text-xs">
                      Target: ${Number(alert.target_price).toFixed(2)}
                      {alert.createdAt && (
                        <span className="ml-2 text-silver/50">{formatDate(alert.createdAt)}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border font-mono
                    ${alert.is_active
                      ? 'text-neon bg-neon/10 border-neon/20'
                      : 'text-silver bg-white/5 border-border'
                    }`}>
                    {alert.is_active ? 'active' : 'inactive'}
                  </span>

                  {confirmDelete === alert.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleDeleteAlert(alert.id)}
                        disabled={deletingAlert === alert.id}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20 transition-colors disabled:opacity-40"
                      >
                        {deletingAlert === alert.id ? (
                          <motion.span
                            className="block w-3 h-3 border-2 border-crimson/40 border-t-crimson rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          />
                        ) : 'Yes'}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/5 text-silver border border-border hover:bg-white/10 transition-colors"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(alert.id)}
                      className="p-1.5 rounded-lg text-silver/40 hover:text-crimson hover:bg-crimson/10 transition-all"
                      title="Delete alert"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
