import { useState } from 'react'
import api from '../api/axios'
import { Plus, Star, List } from 'lucide-react'

export default function Watchlist() {
  const [name, setName] = useState('')
  const [watchlists, setWatchlists] = useState([])
  const [itemId, setItemId] = useState('')
  const [selectedWl, setSelectedWl] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const createWatchlist = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/watchlist/', { name: name.trim() })
      const newWl = r.data.data || r.data
      setWatchlists(prev => [...prev, { ...newWl, items: [] }])
      setName('')
      setMsg('Watchlist olusturuldu!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Watchlist olusturulamadi.')
    } finally { setLoading(false) }
  }

  const addItem = async (e) => {
    e.preventDefault()
    if (!selectedWl || !itemId) return
    setError('')
    try {
      await api.post(`/watchlist/${selectedWl}/items`, { market_item_id: parseInt(itemId) })
      setItemId('')
      setMsg('Varlik watchlist\'e eklendi!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Varlik eklenemedi.')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Watchlist</h1>

      {msg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">{msg}</div>}
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} className="text-yellow-400" />
            <h2 className="text-lg font-semibold text-slate-100">Yeni Watchlist</h2>
          </div>
          <form onSubmit={createWatchlist} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Watchlist Adi</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ornek: Kripto Favorilerim" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-medium rounded-lg transition-colors inline-flex items-center justify-center gap-2">
              <Plus size={16} /> {loading ? 'Olusturuluyor...' : 'Olustur'}
            </button>
          </form>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <List size={20} className="text-emerald-400" />
            <h2 className="text-lg font-semibold text-slate-100">Varlik Ekle</h2>
          </div>
          <form onSubmit={addItem} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Watchlist Sec</label>
              <select value={selectedWl} onChange={e => setSelectedWl(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option value="">Watchlist secin...</option>
                {watchlists.map(wl => (
                  <option key={wl.id || wl.ID} value={wl.id || wl.ID}>{wl.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Market Varlik ID</label>
              <input type="number" value={itemId} onChange={e => setItemId(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Varlik ID giriniz" />
            </div>
            <button type="submit" disabled={!selectedWl || !itemId}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
              Ekle
            </button>
          </form>
        </div>
      </div>

      {watchlists.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Watchlistlerim</h2>
          <div className="space-y-3">
            {watchlists.map(wl => (
              <div key={wl.id || wl.ID} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-400" />
                  <span className="font-semibold text-slate-100">{wl.name}</span>
                  <span className="text-xs text-slate-500 ml-auto">ID: {wl.id || wl.ID}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
