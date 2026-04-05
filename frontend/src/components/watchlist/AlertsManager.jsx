import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api, { alertApi, marketApi } from '../../services/api'

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
  const [prices, setPrices] = useState({})
  const [availableSymbols, setAvailableSymbols] = useState([])

  // Fetch live prices
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await marketApi.getAll()
        const assets = data.data || data || []
        const priceMap = {}
        assets.forEach(a => { priceMap[a.symbol] = { price: a.price, change24h: a.change24h, name: a.name } })
        setPrices(priceMap)
        setAvailableSymbols(assets.map(a => a.symbol))
      } catch { /* silent */ }
    }
    load()
    const interval = setInterval(load, 10_000)
    return () => clearInterval(interval)
  }, [])

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
    } catch { setError('Failed to load alerts') }
    finally { setFetching(false) }
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
    } catch { setTriggered([]) }
  }

  useEffect(() => { fetchAlerts(); fetchTriggered() }, [])
  useEffect(() => { if (error) { const t = setTimeout(() => setError(''), 5000); return () => clearTimeout(t) } }, [error])

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { symbol, target_price, condition } = form
    if (!symbol.trim() || !target_price) return
    setCreating(true); setError(''); setSuccess('')
    try {
      await alertApi.create({ symbol: symbol.trim().toUpperCase(), target_price: Number(target_price), condition })
      setSuccess(`Alert: ${symbol.toUpperCase()} ${condition} $${target_price}`)
      setForm({ symbol: '', target_price: '', condition: 'ABOVE' })
      fetchAlerts(); fetchTriggered()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create alert')
    } finally { setCreating(false) }
  }

  const handleDeleteAlert = async (alertId) => {
    setDeletingAlert(alertId); setError('')
    try {
      await api.delete(`/watchlist/alerts/${alertId}`)
      setConfirmDelete(null)
      setSuccess('Alert deleted')
      fetchAlerts(); fetchTriggered()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete alert')
    } finally { setDeletingAlert(null) }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try { return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    catch { return '' }
  }

  // Calculate how close current price is to target
  const getProgress = (alert) => {
    const p = prices[alert.symbol]
    if (!p) return null
    const current = p.price
    const target = Number(alert.target_price)
    if (alert.condition === 'ABOVE') {
      if (current >= target) return 100
      const distance = ((target - current) / target) * 100
      return Math.max(0, Math.min(100, 100 - distance))
    } else {
      if (current <= target) return 100
      const distance = ((current - target) / current) * 100
      return Math.max(0, Math.min(100, 100 - distance))
    }
  }

  const getDistanceLabel = (alert) => {
    const p = prices[alert.symbol]
    if (!p) return null
    const current = p.price
    const target = Number(alert.target_price)
    const diff = target - current
    const pct = ((diff / current) * 100).toFixed(1)
    if (alert.condition === 'ABOVE') {
      return current >= target
        ? { text: 'Target reached!', color: 'text-neon' }
        : { text: `${Math.abs(pct)}% away`, color: Math.abs(pct) < 5 ? 'text-amber-400' : 'text-silver' }
    } else {
      return current <= target
        ? { text: 'Target reached!', color: 'text-neon' }
        : { text: `${Math.abs(pct)}% away`, color: Math.abs(pct) < 5 ? 'text-amber-400' : 'text-silver' }
    }
  }

  const currentPrice = prices[form.symbol.toUpperCase()]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-neon/10 border border-amber-400/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Price Alerts</h3>
            <p className="text-silver text-xs">Get notified when prices hit your targets</p>
          </div>
        </div>
        {alerts.filter(a => a.is_active).length > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-neon animate-pulse" />
            <span className="text-neon text-xs font-mono">{alerts.filter(a => a.is_active).length} active</span>
          </div>
        )}
      </div>

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Condition Toggle */}
        <div className="flex gap-2">
          {['ABOVE', 'BELOW'].map((c) => (
            <button key={c} type="button" onClick={() => updateField('condition', c)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border uppercase
                ${form.condition === c
                  ? c === 'ABOVE'
                    ? 'bg-neon/10 border-neon/30 text-neon shadow-neon-sm'
                    : 'bg-crimson/10 border-crimson/30 text-crimson shadow-crimson-sm'
                  : 'bg-white/[0.02] border-border text-silver hover:border-white/20'}`}>
              {c === 'ABOVE' ? 'Price Goes Above' : 'Price Goes Below'}
            </button>
          ))}
        </div>

        {/* Symbol + Target Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Symbol</label>
            <select value={form.symbol} onChange={(e) => updateField('symbol', e.target.value)}
              className="input-base py-2.5 text-sm bg-void appearance-none cursor-pointer w-full">
              <option value="">Select asset...</option>
              {availableSymbols.map(sym => {
                const p = prices[sym]
                return <option key={sym} value={sym}>{sym} {p ? `— $${p.price >= 1000 ? p.price.toLocaleString() : p.price.toFixed(2)}` : ''}</option>
              })}
            </select>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-silver text-xs font-medium tracking-widest uppercase">Target Price</label>
              {currentPrice && (
                <span className="text-ice text-[10px] font-mono">Current: ${currentPrice.price >= 1000 ? currentPrice.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : currentPrice.price.toFixed(2)}</span>
              )}
            </div>
            <input type="number" min="0.01" step="0.01" value={form.target_price}
              onChange={(e) => updateField('target_price', e.target.value)}
              placeholder="$0.00" className="input-base py-2.5 text-sm" />
          </div>
        </div>

        {/* Price context hint */}
        {currentPrice && form.target_price && (
          <div className={`text-xs font-mono px-3 py-2 rounded-lg border ${
            (form.condition === 'ABOVE' && Number(form.target_price) > currentPrice.price) ||
            (form.condition === 'BELOW' && Number(form.target_price) < currentPrice.price)
              ? 'text-ice/80 bg-ice/5 border-ice/10'
              : 'text-amber-400 bg-amber-400/5 border-amber-400/10'
          }`}>
            {form.condition === 'ABOVE'
              ? Number(form.target_price) > currentPrice.price
                ? `Alert when ${form.symbol} rises ${((Number(form.target_price) - currentPrice.price) / currentPrice.price * 100).toFixed(1)}% from current price`
                : `Target is below current price — will trigger immediately`
              : Number(form.target_price) < currentPrice.price
                ? `Alert when ${form.symbol} drops ${((currentPrice.price - Number(form.target_price)) / currentPrice.price * 100).toFixed(1)}% from current price`
                : `Target is above current price — will trigger immediately`
            }
          </div>
        )}

        <button type="submit" disabled={creating || !form.symbol.trim() || !form.target_price}
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

      {/* Toasts */}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-crimson text-sm">{error}</motion.p>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-neon text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Triggered Alerts */}
      {triggered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <p className="text-amber-400 text-xs font-medium uppercase tracking-widest">Recently Triggered</p>
          </div>
          {triggered.map((t, idx) => (
            <motion.div key={`triggered-${t.alert?.id || idx}`} layout
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center justify-between gap-4 p-4 rounded-xl bg-amber-400/[0.03] border border-amber-400/20">
              <div className="flex items-center gap-3 min-w-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border
                  ${t.alert?.condition === 'ABOVE' ? 'text-neon bg-neon/10 border-neon/20' : 'text-crimson bg-crimson/10 border-crimson/20'}`}>
                  {t.alert?.condition}
                </span>
                <div className="min-w-0">
                  <p className="text-cloud font-mono font-bold text-sm">{t.alert?.symbol}</p>
                  <p className="text-silver/60 text-xs">
                    Target: ${Number(t.alert?.target_price).toFixed(2)}
                    <span className="mx-1.5 text-silver/30">→</span>
                    Hit: <span className="text-amber-400 font-bold">${Number(t.currentPrice).toFixed(2)}</span>
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-amber-400 bg-amber-400/10 border-amber-400/20 font-mono">triggered</span>
                {t.triggeredAt && <p className="text-silver/40 text-[10px] mt-1">{formatDate(t.triggeredAt)}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Active Alerts */}
      {fetching ? (
        <div className="flex justify-center py-8">
          <motion.span className="block w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/5 border border-amber-400/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <p className="text-silver text-sm">No alerts yet</p>
          <p className="text-silver/40 text-xs">Set price targets and get notified when the market moves</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-silver text-xs font-medium uppercase tracking-widest">All Alerts ({alerts.length})</p>
          <AnimatePresence>
            {alerts.map((alert) => {
              const progress = getProgress(alert)
              const distance = getDistanceLabel(alert)
              const p = prices[alert.symbol]
              return (
                <motion.div key={alert.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl bg-white/[0.02] transition-colors space-y-2
                    ${alert.is_active ? 'border border-neon/20 hover:border-neon/30' : 'border border-silver/10 opacity-50'}`}>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0
                        ${alert.condition === 'ABOVE' ? 'text-neon bg-neon/10 border-neon/20' : 'text-crimson bg-crimson/10 border-crimson/20'}`}>
                        {alert.condition}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-cloud font-mono font-bold text-sm">{alert.symbol}</p>
                          {distance && <span className={`text-[10px] font-mono ${distance.color}`}>{distance.text}</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {p && <span className="text-silver text-xs font-mono">Now: ${p.price >= 1000 ? p.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : p.price.toFixed(2)}</span>}
                          <span className="text-silver/30 text-xs">→</span>
                          <span className={`text-xs font-mono font-bold ${alert.condition === 'ABOVE' ? 'text-neon' : 'text-crimson'}`}>
                            Target: ${Number(alert.target_price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {confirmDelete === alert.id ? (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleDeleteAlert(alert.id)} disabled={deletingAlert === alert.id}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20 transition-colors disabled:opacity-40">
                            {deletingAlert === alert.id ? '...' : 'Yes'}
                          </button>
                          <button onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/5 text-silver border border-border hover:bg-white/10 transition-colors">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(alert.id)}
                          className="p-1.5 rounded-lg text-silver/40 hover:text-crimson hover:bg-crimson/10 transition-all" title="Delete alert">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar showing proximity to target */}
                  {alert.is_active && progress !== null && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            progress >= 95 ? 'bg-neon' : progress >= 70 ? 'bg-amber-400' : 'bg-ice/50'
                          }`} />
                      </div>
                      <span className="text-[10px] font-mono text-silver/50 w-8 text-right">{Math.round(progress)}%</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
