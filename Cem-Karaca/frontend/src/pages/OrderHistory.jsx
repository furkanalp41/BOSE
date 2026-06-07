import { useState, useEffect } from 'react'
import api from '../api/axios'
import GlassCard from '../ui/GlassCard'
import { Trash2 } from 'lucide-react'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = () => {
    setLoading(true)
    // Cem backend only exposes GET /orders/open (PENDING orders for the user).
    // The buy/sell split is applied client-side from each order's `side`.
    api.get('/orders/open')
      .then(r => setOrders(r.data.data || []))
      .catch(() => setError('Emirler yuklenemedi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [])

  const cancelOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch {
      setError('Emir iptal edilemedi.')
    }
  }

  const tabs = [['all', 'Tumu'], ['buy', 'Alim'], ['sell', 'Satim']]
  const sideFor = { buy: 'BUY', sell: 'SELL' }
  const visibleOrders = filter === 'all' ? orders : orders.filter(o => o.side === sideFor[filter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cloud">Emirlerim</h1>
        <div className="flex gap-1 bg-panel border border-edge rounded-lg p-1">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === k ? 'bg-neon/10 text-neon shadow-neon-sm' : 'text-silver hover:text-cloud'}`}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div className="p-3 bg-crimson/10 border border-crimson/30 rounded-lg text-crimson text-sm">{error}</div>}

      <GlassCard className="overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-silver">Yukleniyor...</div>
        ) : visibleOrders.length === 0 ? (
          <div className="text-center py-16 text-silver">Emir bulunamadi.</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-silver border-b border-edge text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3">Tarih</th><th className="text-left">Sembol</th><th className="text-left">Tip</th>
              <th className="text-right">Miktar</th><th className="text-right">Hedef Fiyat</th><th className="text-right">Toplam</th>
              <th className="text-right">Durum</th><th className="text-right px-6">Islem</th>
            </tr></thead>
            <tbody>
              {visibleOrders.map(o => (
                <tr key={o.id} className="border-b border-edge/50 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-silver text-xs">{new Date(o.createdAt).toLocaleString('tr-TR')}</td>
                  <td className="font-mono font-bold text-cloud">{o.symbol}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.side === 'BUY' ? 'bg-bull/10 text-bull' : 'bg-bear/10 text-bear'}`}>
                      {o.side === 'BUY' ? 'ALIM' : 'SATIM'}
                    </span>
                  </td>
                  <td className="text-right font-mono text-cloud">{o.quantity}</td>
                  <td className="text-right font-mono text-cloud">${o.targetPrice?.toFixed(2)}</td>
                  <td className="text-right font-mono text-cloud">${(o.quantity * o.targetPrice)?.toFixed(2)}</td>
                  <td className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'COMPLETED' ? 'bg-neon/10 text-neon' : o.status === 'PENDING' ? 'bg-amber/10 text-amber' : 'bg-white/5 text-silver'}`}>
                      {o.status === 'COMPLETED' ? 'Tamamlandi' : o.status === 'PENDING' ? 'Beklemede' : o.status}
                    </span>
                  </td>
                  <td className="text-right px-6">
                    {o.status === 'PENDING' && (
                      <button onClick={() => cancelOrder(o.id)} className="p-1.5 text-crimson hover:bg-crimson/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  )
}
