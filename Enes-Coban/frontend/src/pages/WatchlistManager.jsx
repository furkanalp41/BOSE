import { useEffect, useState } from 'react'
import api from '../api/axios'
import { ListChecks, Plus, Trash2, ListPlus, Loader2, RefreshCw } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

export default function WatchlistManager() {
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [assetDrafts, setAssetDrafts] = useState({})
  const [busyList, setBusyList] = useState(null)

  const loadLists = async () => {
    setLoading(true)
    setError('')
    try {
      const r = await api.get('/watchlists')
      setLists(r.data.data || [])
    } catch (err) {
      setError(err.response?.data?.error || 'Listeler yuklenemedi.')
    } finally { setLoading(false) }
  }

  useEffect(() => { loadLists() }, [])

  const createList = async (e) => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    setCreating(true)
    setError('')
    try {
      await api.post('/watchlists', { name })
      setNewName('')
      await loadLists()
    } catch (err) {
      setError(err.response?.data?.error || 'Liste olusturulamadi.')
    } finally { setCreating(false) }
  }

  const deleteList = async (id) => {
    setBusyList(id)
    setError('')
    try {
      await api.delete(`/watchlists/${id}`)
      await loadLists()
    } catch (err) {
      setError(err.response?.data?.error || 'Liste silinemedi.')
    } finally { setBusyList(null) }
  }

  const addAsset = async (e, listId) => {
    e.preventDefault()
    const symbol = (assetDrafts[listId] || '').trim().toUpperCase()
    if (!symbol) return
    setBusyList(listId)
    setError('')
    try {
      await api.post(`/watchlists/${listId}/assets`, { symbol })
      setAssetDrafts((d) => ({ ...d, [listId]: '' }))
      await loadLists()
    } catch (err) {
      setError(err.response?.data?.error || 'Sembol eklenemedi.')
    } finally { setBusyList(null) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ListChecks size={28} className="text-neon" />
          <h1 className="text-2xl font-bold text-cloud">Izleme Listeleri</h1>
        </div>
        <NeonButton variant="ghost" onClick={loadLists} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Yenile
        </NeonButton>
      </div>

      {error && (
        <div className="rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">{error}</div>
      )}

      <GlassCard className="p-6">
        <form onSubmit={createList} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-silver">Yeni Liste Adi</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="orn. Teknoloji Hisseleri"
              className="input-base"
            />
          </div>
          <NeonButton type="submit" disabled={creating || !newName.trim()}>
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Liste Olustur
          </NeonButton>
        </form>
      </GlassCard>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-silver">
          <Loader2 size={20} className="animate-spin text-neon" /> Yukleniyor...
        </div>
      ) : lists.length === 0 ? (
        <GlassCard className="p-10 text-center">
          <ListChecks size={40} className="mx-auto mb-3 text-neon opacity-50" />
          <p className="text-lg font-medium text-cloud">Henuz izleme listeniz yok</p>
          <p className="mt-1 text-sm text-silver">Yukaridan yeni bir liste olusturarak baslayin.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {lists.map((list) => (
            <GlassCard key={list.id} className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-cloud">{list.name}</h3>
                  <p className="mt-0.5 text-xs text-silver">
                    {(list.assets?.length || 0)} varlik
                  </p>
                </div>
                <NeonButton
                  variant="danger"
                  onClick={() => deleteList(list.id)}
                  disabled={busyList === list.id}
                  className="px-3 py-2"
                  aria-label="Listeyi sil"
                >
                  <Trash2 size={16} />
                </NeonButton>
              </div>

              <div className="mb-4 flex flex-1 flex-wrap content-start gap-2">
                {list.assets && list.assets.length > 0 ? (
                  list.assets.map((a) => (
                    <span
                      key={a.id}
                      className="rounded-full border border-neon/30 bg-neon/10 px-3 py-1 font-mono text-xs text-neon"
                    >
                      {a.symbol}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-silver">Bu listede henuz varlik yok.</span>
                )}
              </div>

              <form onSubmit={(e) => addAsset(e, list.id)} className="flex gap-2 border-t border-edge pt-4">
                <input
                  value={assetDrafts[list.id] || ''}
                  onChange={(e) => setAssetDrafts((d) => ({ ...d, [list.id]: e.target.value.toUpperCase() }))}
                  placeholder="SEMBOL"
                  className="input-base flex-1 font-mono uppercase"
                />
                <NeonButton
                  type="submit"
                  disabled={busyList === list.id || !(assetDrafts[list.id] || '').trim()}
                  className="px-3 py-2"
                  aria-label="Sembol ekle"
                >
                  <ListPlus size={16} />
                </NeonButton>
              </form>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
