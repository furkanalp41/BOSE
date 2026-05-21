import { useState, useEffect } from 'react'
import api from '../api/axios'
import { Trash2 } from 'lucide-react'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = () => {
    setLoading(true)
    const urls = { all: '/orders/', buy: '/orders/buy', sell: '/orders/sell' }
    api.get(urls[filter])
      .then(r => setOrders(r.data.data || []))
      .catch(() => setError('Emirler yuklenemedi.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOrders() }, [filter])

  const cancelOrder = async (id) => {
    try {
      await api.delete(`/orders/${id}`)
      setOrders(prev => prev.filter(o => o.id !== id))
    } catch {
      setError('Emir iptal edilemedi.')
    }
  }

  const tabs = [['all', 'Tumu'], ['buy', 'Alim'], ['sell', 'Satim']]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Emirlerim</h1>
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === k ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>{l}</button>
          ))}
        </div>
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400">Yukleniyor...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-slate-500">Emir bulunamadi.</div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3">Tarih</th><th className="text-left">Sembol</th><th className="text-left">Tip</th>
              <th className="text-right">Miktar</th><th className="text-right">Fiyat</th><th className="text-right">Toplam</th>
              <th className="text-right">Durum</th><th className="text-right px-6">Islem</th>
            </tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-slate-400 text-xs">{new Date(o.created_at).toLocaleString('tr-TR')}</td>
                  <td className="font-mono font-bold text-slate-100">{o.symbol}</td>
                  <td>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.order_type === 'buy' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                      {o.order_type === 'buy' ? 'ALIM' : 'SATIM'}
                    </span>
                  </td>
                  <td className="text-right font-mono text-slate-100">{o.quantity}</td>
                  <td className="text-right font-mono text-slate-100">${o.price?.toFixed(2)}</td>
                  <td className="text-right font-mono text-slate-100">${(o.quantity * o.price)?.toFixed(2)}</td>
                  <td className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-slate-500/10 text-slate-400'}`}>
                      {o.status === 'completed' ? 'Tamamlandi' : o.status === 'pending' ? 'Beklemede' : o.status}
                    </span>
                  </td>
                  <td className="text-right px-6">
                    {o.status === 'pending' && (
                      <button onClick={() => cancelOrder(o.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
