import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { watchlistApi } from '../../services/api'

export default function WatchlistManager() {
  const [watchlists, setWatchlists] = useState([])
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Add-item state per watchlist
  const [itemInputs, setItemInputs] = useState({})
  const [addingItem, setAddingItem] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true); setError(''); setSuccess('')
    try {
      const { data } = await watchlistApi.create(name.trim())
      const wl = data.data || data
      setWatchlists(prev => [...prev, { id: wl.ID || wl.id, name: wl.name || name.trim(), items: [] }])
      setSuccess(`Watchlist "${name.trim()}" created!`)
      setName('')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create watchlist')
    } finally { setCreating(false) }
  }

  const handleAddItem = async (wlId) => {
    const itemId = Number(itemInputs[wlId])
    if (!itemId) return
    setAddingItem(wlId); setError('')
    try {
      await watchlistApi.addItem(wlId, itemId)
      setWatchlists(prev => prev.map(wl =>
        wl.id === wlId ? { ...wl, items: [...wl.items, itemId] } : wl
      ))
      setItemInputs(prev => ({ ...prev, [wlId]: '' }))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item')
    } finally { setAddingItem(null) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-6">
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

      <form onSubmit={handleCreate} className="flex gap-3">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Watchlist name" className="input-base py-2.5 text-sm flex-1" />
        <button type="submit" disabled={creating || !name.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 disabled:opacity-40">
          {creating ? (
            <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
              animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
          ) : 'Create'}
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

      {watchlists.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No watchlists yet</p>
          <p className="text-silver/50 text-xs mt-1">Create one to start tracking assets</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {watchlists.map((wl) => (
              <motion.div key={wl.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cloud font-mono font-bold text-sm">{wl.name}</p>
                    <p className="text-silver text-xs">ID: {wl.id} · {wl.items.length} item{wl.items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>

                {wl.items.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {wl.items.map((itemId, i) => (
                      <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded border text-ice bg-ice/10 border-ice/20">
                        Item #{itemId}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input type="number" min="1" placeholder="Market item ID"
                    value={itemInputs[wl.id] || ''}
                    onChange={(e) => setItemInputs(prev => ({ ...prev, [wl.id]: e.target.value }))}
                    className="input-base py-2 text-xs flex-1" />
                  <button onClick={() => handleAddItem(wl.id)}
                    disabled={addingItem === wl.id || !itemInputs[wl.id]}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-ice/10 text-ice border border-ice/20 hover:bg-ice/20 transition-colors disabled:opacity-40">
                    {addingItem === wl.id ? '...' : 'Add Item'}
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
