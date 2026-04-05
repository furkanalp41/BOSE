import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api, { watchlistApi, marketApi } from '../../services/api'

export default function WatchlistManager() {
  const [watchlists, setWatchlists] = useState([])
  const [fetching, setFetching] = useState(true)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [itemInputs, setItemInputs] = useState({})
  const [addingItem, setAddingItem] = useState(null)
  const [deletingWl, setDeletingWl] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [prices, setPrices] = useState({})
  const [availableSymbols, setAvailableSymbols] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(null)

  // Fetch live prices
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await marketApi.getAll()
        const assets = data.data || data || []
        const priceMap = {}
        assets.forEach(a => {
          priceMap[a.symbol] = { price: a.price, change24h: a.change24h, name: a.name, category: a.category }
        })
        setPrices(priceMap)
        setAvailableSymbols(assets.map(a => a.symbol))
      } catch { /* silent */ }
    }
    load()
    const interval = setInterval(load, 10_000)
    return () => clearInterval(interval)
  }, [])

  const fetchWatchlists = async () => {
    setFetching(true)
    try {
      const { data } = await watchlistApi.getAll()
      const list = data.data || data || []
      setWatchlists(list.map(wl => ({
        id: wl.id || wl.ID,
        name: wl.name,
        createdAt: wl.createdAt || wl.created_at,
        items: (wl.items || []).map(item => ({
          id: item.id || item.ID,
          symbol: item.symbol || item.Symbol,
        })),
      })))
    } catch {
      setError('Failed to load watchlists')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchWatchlists() }, [])
  useEffect(() => { if (error) { const t = setTimeout(() => setError(''), 5000); return () => clearTimeout(t) } }, [error])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true); setError(''); setSuccess('')
    try {
      await watchlistApi.create(name.trim())
      setSuccess(`"${name.trim()}" created`)
      setName('')
      fetchWatchlists()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create watchlist')
    } finally { setCreating(false) }
  }

  const handleAddItem = async (wlId, symbol) => {
    const sym = (symbol || itemInputs[wlId] || '').trim().toUpperCase()
    if (!sym) return
    setAddingItem(wlId); setError('')
    try {
      await watchlistApi.addItem(wlId, sym)
      setItemInputs(prev => ({ ...prev, [wlId]: '' }))
      setShowSuggestions(null)
      fetchWatchlists()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item')
    } finally { setAddingItem(null) }
  }

  const handleDeleteItem = async (wlId, itemId, symbol) => {
    setError('')
    try {
      await watchlistApi.deleteItem(wlId, itemId)
      setSuccess(`Removed ${symbol}`)
      fetchWatchlists()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove item')
    }
  }

  const handleDeleteWatchlist = async (wlId) => {
    setDeletingWl(wlId); setError('')
    try {
      await api.delete(`/watchlist/${wlId}`)
      setConfirmDelete(null)
      setSuccess('Watchlist deleted')
      fetchWatchlists()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete watchlist')
    } finally { setDeletingWl(null) }
  }

  // Filter suggestions based on input
  const getSuggestions = (wlId) => {
    const input = (itemInputs[wlId] || '').toUpperCase()
    if (!input) return availableSymbols.slice(0, 8)
    const wl = watchlists.find(w => w.id === wlId)
    const existing = new Set((wl?.items || []).map(i => i.symbol))
    return availableSymbols
      .filter(s => s.includes(input) && !existing.has(s))
      .slice(0, 6)
  }

  const formatPrice = (p) => p >= 1000 ? p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : p.toFixed(2)

  // Calculate watchlist total value (sum of tracked asset prices)
  const getWatchlistStats = (items) => {
    let totalChange = 0, count = 0
    items.forEach(item => {
      const p = prices[item.symbol]
      if (p) { totalChange += p.change24h; count++ }
    })
    return { avgChange: count > 0 ? (totalChange / count) : 0 }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice/20 to-neon/10 border border-ice/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Watchlists</h3>
            <p className="text-silver text-xs">Track assets with live prices</p>
          </div>
        </div>
        {watchlists.length > 0 && (
          <span className="text-silver/40 text-xs font-mono">{watchlists.reduce((s, w) => s + w.items.length, 0)} assets tracked</span>
        )}
      </div>

      {/* Create Form */}
      <form onSubmit={handleCreate} className="flex gap-3">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="New watchlist name..." className="input-base py-2.5 text-sm flex-1" />
        <button type="submit" disabled={creating || !name.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 disabled:opacity-40">
          {creating ? <Spinner size={4} color="void" /> : 'Create'}
        </button>
      </form>

      {/* Toasts */}
      <AnimatePresence>
        {error && <Toast type="error" message={error} />}
        {success && <Toast type="success" message={success} />}
      </AnimatePresence>

      {/* Watchlists */}
      {fetching ? (
        <div className="flex justify-center py-8"><Spinner size={5} color="ice" /></div>
      ) : watchlists.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-ice/5 border border-ice/10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-silver text-sm">No watchlists yet</p>
          <p className="text-silver/40 text-xs">Create a watchlist and add symbols to start tracking live prices</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {watchlists.map((wl) => {
              const stats = getWatchlistStats(wl.items)
              return (
                <motion.div key={wl.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-3 hover:border-white/10 transition-colors">

                  {/* Watchlist Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-cloud font-bold text-sm">{wl.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-silver/50 text-xs">{wl.items.length} asset{wl.items.length !== 1 ? 's' : ''}</span>
                          {wl.items.length > 0 && (
                            <span className={`text-[10px] font-mono font-bold ${stats.avgChange >= 0 ? 'text-neon' : 'text-crimson'}`}>
                              avg {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <DeleteButton
                      isConfirming={confirmDelete === wl.id}
                      isDeleting={deletingWl === wl.id}
                      onConfirm={() => setConfirmDelete(wl.id)}
                      onDelete={() => handleDeleteWatchlist(wl.id)}
                      onCancel={() => setConfirmDelete(null)}
                    />
                  </div>

                  {/* Asset Cards with Live Prices */}
                  {wl.items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {wl.items.map((item) => {
                        const p = prices[item.symbol]
                        return (
                          <div key={item.id}
                            className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-border/50 group hover:border-ice/20 transition-colors">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-xs font-bold font-mono text-ice">{item.symbol}</span>
                              {p && <span className="text-silver/40 text-[10px] truncate">{p.name}</span>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {p ? (
                                <div className="text-right">
                                  <p className="text-cloud text-xs font-mono font-bold">${formatPrice(p.price)}</p>
                                  <p className={`text-[10px] font-mono ${p.change24h >= 0 ? 'text-neon' : 'text-crimson'}`}>
                                    {p.change24h >= 0 ? '+' : ''}{p.change24h.toFixed(2)}%
                                  </p>
                                </div>
                              ) : (
                                <span className="text-silver/30 text-[10px]">--</span>
                              )}
                              <button onClick={() => handleDeleteItem(wl.id, item.id, item.symbol)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded text-silver/30 hover:text-crimson hover:bg-crimson/10 transition-all"
                                title="Remove">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Add Item with Symbol Suggestions */}
                  <div className="relative">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Add symbol (e.g. BTC, ETH, AAPL)"
                        value={itemInputs[wl.id] || ''}
                        onChange={(e) => {
                          setItemInputs(prev => ({ ...prev, [wl.id]: e.target.value.toUpperCase() }))
                          setShowSuggestions(wl.id)
                        }}
                        onFocus={() => setShowSuggestions(wl.id)}
                        onBlur={() => setTimeout(() => setShowSuggestions(null), 200)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddItem(wl.id) } }}
                        className="input-base py-2 text-xs flex-1" />
                      <button onClick={() => handleAddItem(wl.id)}
                        disabled={addingItem === wl.id || !itemInputs[wl.id]?.trim()}
                        className="px-3 py-2 rounded-lg text-xs font-semibold bg-ice/10 text-ice border border-ice/20 hover:bg-ice/20 transition-colors disabled:opacity-40">
                        {addingItem === wl.id ? <Spinner size={3} color="ice" /> : '+ Add'}
                      </button>
                    </div>
                    {/* Suggestions Dropdown */}
                    {showSuggestions === wl.id && (
                      <div className="absolute z-10 top-full mt-1 left-0 right-12 bg-void/95 border border-border rounded-lg shadow-xl backdrop-blur-sm max-h-48 overflow-y-auto">
                        {getSuggestions(wl.id).map(sym => {
                          const p = prices[sym]
                          return (
                            <button key={sym} type="button"
                              onMouseDown={(e) => { e.preventDefault(); handleAddItem(wl.id, sym) }}
                              className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 transition-colors text-left">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold font-mono text-ice">{sym}</span>
                                {p && <span className="text-silver/40 text-[10px]">{p.name}</span>}
                              </div>
                              {p && (
                                <span className={`text-[10px] font-mono ${p.change24h >= 0 ? 'text-neon' : 'text-crimson'}`}>
                                  ${formatPrice(p.price)}
                                </span>
                              )}
                            </button>
                          )
                        })}
                        {getSuggestions(wl.id).length === 0 && (
                          <p className="px-3 py-2 text-silver/40 text-xs">No matching symbols</p>
                        )}
                      </div>
                    )}
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

// ── Shared sub-components ──

function Spinner({ size = 4, color = 'ice' }) {
  const cls = `block w-${size} h-${size} border-2 border-${color}/30 border-t-${color} rounded-full`
  return <motion.span className={cls} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
}

function Toast({ type, message }) {
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className={`flex items-center gap-2 text-sm font-medium ${type === 'error' ? 'text-crimson' : 'text-neon'}`}>
      {type === 'success' && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
      )}
      {message}
    </motion.div>
  )
}

function DeleteButton({ isConfirming, isDeleting, onConfirm, onDelete, onCancel }) {
  if (isConfirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-silver">Delete?</span>
        <button onClick={onDelete} disabled={isDeleting}
          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20 transition-colors disabled:opacity-40">
          {isDeleting ? <Spinner size={3} color="crimson" /> : 'Yes'}
        </button>
        <button onClick={onCancel}
          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-white/5 text-silver border border-border hover:bg-white/10 transition-colors">
          No
        </button>
      </div>
    )
  }
  return (
    <button onClick={onConfirm} className="p-1.5 rounded-lg text-silver/40 hover:text-crimson hover:bg-crimson/10 transition-all" title="Delete watchlist">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </button>
  )
}
