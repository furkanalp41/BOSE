import { useState } from 'react'
import api from '../api/axios'
import { Plus, Star, List } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

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
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-cloud">Watchlist</h1>

      {msg && <div className="rounded-lg border border-neon/40 bg-neon/10 p-3 text-sm text-neon">{msg}</div>}
      {error && <div className="rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">{error}</div>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Star size={20} className="text-amber" />
            <h2 className="text-lg font-semibold text-cloud">Yeni Watchlist</h2>
          </div>
          <form onSubmit={createWatchlist} className="space-y-4">
            <FloatingInput
              label="Watchlist Adi"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              placeholder="Ornek: Kripto Favorilerim"
            />
            <NeonButton type="submit" disabled={loading} className="w-full">
              <Plus size={16} /> {loading ? 'Olusturuluyor...' : 'Olustur'}
            </NeonButton>
          </form>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <List size={20} className="text-neon" />
            <h2 className="text-lg font-semibold text-cloud">Varlik Ekle</h2>
          </div>
          <form onSubmit={addItem} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-silver">Watchlist Sec</span>
              <select value={selectedWl} onChange={e => setSelectedWl(e.target.value)} className="input-base">
                <option value="">Watchlist secin...</option>
                {watchlists.map(wl => (
                  <option key={wl.id || wl.ID} value={wl.id || wl.ID}>{wl.name}</option>
                ))}
              </select>
            </label>
            <FloatingInput
              label="Market Varlik ID"
              type="number"
              value={itemId}
              onChange={e => setItemId(e.target.value)}
              required
              placeholder="Varlik ID giriniz"
            />
            <NeonButton type="submit" disabled={!selectedWl || !itemId} className="w-full">
              Ekle
            </NeonButton>
          </form>
        </GlassCard>
      </div>

      {watchlists.length > 0 && (
        <GlassCard className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-cloud">Watchlistlerim</h2>
          <div className="space-y-3">
            {watchlists.map(wl => (
              <div key={wl.id || wl.ID} className="rounded-xl border border-edge bg-card/60 p-4">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber" />
                  <span className="font-semibold text-cloud">{wl.name}</span>
                  <span className="ml-auto font-mono text-xs text-silver">ID: {wl.id || wl.ID}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
