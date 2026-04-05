import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api, { watchlistApi } from '../../services/api'

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

  const fetchWatchlists = async () => {
    setFetching(true)
    try {
      const { data } = await watchlistApi.getAll()
      const list = data.data || data || []
      setWatchlists(list.map(wl => ({
        id: wl.id || wl.ID,
        name: wl.name,
        createdAt: wl.createdAt || wl.created_at,
        updatedAt: wl.updatedAt || wl.updated_at,
        items: (wl.items || []).map(item => ({
          id: item.id || item.ID,
          symbol: item.symbol || item.Symbol,
          createdAt: item.createdAt || item.created_at,
        })),
      })))
    } catch {
      setError('Failed to load watchlists')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchWatchlists() }, [])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(t)
    }
  }, [error])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setError('')
    setSuccess('')
    try {
      await watchlistApi.create(name.trim())
      setSuccess(`Watchlist "${name.trim()}" created`)
      setName('')
      fetchWatchlists()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create watchlist')
    } finally {
      setCreating(false)
    }
  }

  const handleAddItem = async (wlId) => {
    const symbol = (itemInputs[wlId] || '').trim().toUpperCase()
    if (!symbol) return
    setAddingItem(wlId)
    setError('')
    try {
      await watchlistApi.addItem(wlId, symbol)
      setItemInputs(prev => ({ ...prev, [wlId]: '' }))
      fetchWatchlists()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item')
    } finally {
      setAddingItem(null)
    }
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
    setDeletingWl(wlId)
    setError('')
    try {
      await api.delete(`/watchlist/${wlId}`)
      setConfirmDelete(null)
      setSuccess('Watchlist deleted')
      fetchWatchlists()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete watchlist')
    } finally {
      setDeletingWl(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice/20 to-neon/10 border border-ice/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Watchlists</h3>
          <p className="text-silver text-xs">Create and manage your watchlists</p>
        </div>
      </div>

      {/* ── Create Form ── */}
      <form onSubmit={handleCreate} className="flex gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Watchlist name"
          className="input-base py-2.5 text-sm flex-1"
        />
        <button
          type="submit"
          disabled={creating || !name.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 disabled:opacity-40"
        >
          {creating ? (
            <motion.span
              className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : 'Create'}
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

      {/* ── Watchlists List ── */}
      {fetching ? (
        <div className="flex justify-center py-8">
          <motion.span
            className="block w-5 h-5 border-2 border-ice/30 border-t-ice rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      ) : watchlists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No watchlists yet</p>
          <p className="text-silver/50 text-xs mt-1">Create one to start tracking assets</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {watchlists.map((wl) => (
              <motion.div
                key={wl.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-3"
              >
                {/* ── Watchlist Header ── */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cloud font-mono font-bold text-sm">{wl.name}</p>
                    <p className="text-silver text-xs">
                      {wl.items.length} item{wl.items.length !== 1 ? 's' : ''}
                      {wl.createdAt && (
                        <span className="ml-2 text-silver/50">
                          Created {formatDate(wl.createdAt)}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {confirmDelete === wl.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-silver">Delete?</span>
                        <button
                          onClick={() => handleDeleteWatchlist(wl.id)}
                          disabled={deletingWl === wl.id}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-crimson/10 text-crimson border border-crimson/20 hover:bg-crimson/20 transition-colors disabled:opacity-40"
                        >
                          {deletingWl === wl.id ? (
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
                        onClick={() => setConfirmDelete(wl.id)}
                        className="p-1.5 rounded-lg text-silver/40 hover:text-crimson hover:bg-crimson/10 transition-all"
                        title="Delete watchlist"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Symbol Badges ── */}
                {wl.items.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {wl.items.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded border text-ice bg-ice/10 border-ice/20 font-mono"
                      >
                        {item.symbol}
                        <button
                          onClick={() => handleDeleteItem(wl.id, item.id, item.symbol)}
                          className="text-crimson/50 hover:text-crimson transition-colors ml-0.5"
                          title="Remove"
                        >
                          x
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* ── Add Item Input ── */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Symbol (e.g. BTC)"
                    value={itemInputs[wl.id] || ''}
                    onChange={(e) => setItemInputs(prev => ({ ...prev, [wl.id]: e.target.value.toUpperCase() }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddItem(wl.id)
                      }
                    }}
                    className="input-base py-2 text-xs flex-1"
                  />
                  <button
                    onClick={() => handleAddItem(wl.id)}
                    disabled={addingItem === wl.id || !itemInputs[wl.id]?.trim()}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-ice/10 text-ice border border-ice/20 hover:bg-ice/20 transition-colors disabled:opacity-40"
                  >
                    {addingItem === wl.id ? (
                      <motion.span
                        className="block w-3 h-3 border-2 border-ice/40 border-t-ice rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                    ) : 'Add'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  )
}
