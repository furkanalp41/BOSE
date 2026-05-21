import { useState } from 'react'
import api from '../api/axios'
import { Bell, ArrowUp, ArrowDown } from 'lucide-react'

export default function AlertsDashboard() {
  const [symbol, setSymbol] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [condition, setCondition] = useState('ABOVE')
  const [alerts, setAlerts] = useState([])
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const createAlert = async (e) => {
    e.preventDefault()
    if (!symbol.trim() || !targetPrice) return
    setLoading(true)
    setError('')
    try {
      const r = await api.post('/watchlist/alerts', {
        symbol: symbol.trim().toUpperCase(),
        target_price: parseFloat(targetPrice),
        condition,
      })
      setAlerts(prev => [...prev, r.data.data || r.data])
      setSymbol('')
      setTargetPrice('')
      setMsg('Alarm olusturuldu!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Alarm olusturulamadi.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bell size={28} className="text-yellow-400" />
        <h1 className="text-2xl font-bold text-slate-100">Fiyat Alarmlari</h1>
      </div>

      {msg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">{msg}</div>}
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Yeni Alarm Olustur</h2>
        <form onSubmit={createAlert} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Sembol</label>
              <input type="text" value={symbol} onChange={e => setSymbol(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="BTC, ETH, AAPL..." />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Hedef Fiyat ($)</label>
              <input type="number" step="0.01" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="50000.00" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Kosul</label>
              <div className="flex gap-1 bg-slate-800 border border-slate-700 rounded-lg p-1">
                {['ABOVE', 'BELOW'].map(c => (
                  <button key={c} type="button" onClick={() => setCondition(c)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-1 ${condition === c
                      ? (c === 'ABOVE' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white')
                      : 'text-slate-400 hover:text-slate-200'}`}>
                    {c === 'ABOVE' ? <><ArrowUp size={14} /> Ustte</> : <><ArrowDown size={14} /> Altta</>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading || !symbol || !targetPrice}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
            {loading ? 'Olusturuluyor...' : 'Alarm Olustur'}
          </button>
        </form>
      </div>

      {alerts.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Aktif Alarmlar</h2>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={a.id || i} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${a.condition === 'ABOVE' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    {a.condition === 'ABOVE' ? <ArrowUp size={16} className="text-emerald-400" /> : <ArrowDown size={16} className="text-red-400" />}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-slate-100">{a.symbol}</span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Fiyat {a.condition === 'ABOVE' ? 'ustune ciktiginda' : 'altina dustugunde'}: ${a.target_price}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400">Aktif</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
