import { useState } from 'react'
import api from '../api/axios'
import { Bell, ArrowUp, ArrowDown } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

export default function AlertsDashboard() {
  const [symbol, setSymbol] = useState('')
  const [targetPrice, setTargetPrice] = useState('')
  const [condition, setCondition] = useState('GREATER_THAN')
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
      const r = await api.post('/alerts', {
        symbol: symbol.trim().toUpperCase(),
        targetPrice: parseFloat(targetPrice),
        condition,
      })
      setAlerts(prev => [...prev, r.data.alert || r.data.data || r.data])
      setSymbol('')
      setTargetPrice('')
      setMsg('Alarm olusturuldu!')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Alarm olusturulamadi.')
    } finally { setLoading(false) }
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-3">
        <Bell size={28} className="text-amber" />
        <h1 className="text-2xl font-bold text-cloud">Fiyat Alarmlari</h1>
      </div>

      {msg && <div className="rounded-lg border border-neon/40 bg-neon/10 p-3 text-sm text-neon">{msg}</div>}
      {error && <div className="rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">{error}</div>}

      <GlassCard className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-cloud">Yeni Alarm Olustur</h2>
        <form onSubmit={createAlert} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FloatingInput
              label="Sembol"
              type="text"
              value={symbol}
              onChange={e => setSymbol(e.target.value)}
              required
              placeholder="BTC, ETH, AAPL..."
            />
            <FloatingInput
              label="Hedef Fiyat ($)"
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={e => setTargetPrice(e.target.value)}
              required
              placeholder="50000.00"
            />
            <div>
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-silver">Kosul</span>
              <div className="flex gap-1 rounded-xl border border-edge bg-white/5 p-1">
                {['GREATER_THAN', 'LESS_THAN'].map(c => (
                  <button key={c} type="button" onClick={() => setCondition(c)}
                    className={`inline-flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium transition-colors ${condition === c
                      ? (c === 'GREATER_THAN' ? 'bg-neon text-void shadow-neon-sm' : 'bg-crimson text-white shadow-crimson-sm')
                      : 'text-silver hover:text-cloud'}`}>
                    {c === 'GREATER_THAN' ? <><ArrowUp size={14} /> Ustte</> : <><ArrowDown size={14} /> Altta</>}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <NeonButton type="submit" disabled={loading || !symbol || !targetPrice}>
            {loading ? 'Olusturuluyor...' : 'Alarm Olustur'}
          </NeonButton>
        </form>
      </GlassCard>

      {alerts.length > 0 && (
        <GlassCard className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-cloud">Aktif Alarmlar</h2>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={a.id || i} className="flex items-center justify-between rounded-xl border border-edge bg-card/60 p-4">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${a.condition === 'GREATER_THAN' ? 'bg-neon/10' : 'bg-crimson/10'}`}>
                    {a.condition === 'GREATER_THAN' ? <ArrowUp size={16} className="text-bull" /> : <ArrowDown size={16} className="text-bear" />}
                  </div>
                  <div>
                    <span className="font-mono font-bold text-cloud">{a.symbol}</span>
                    <p className="mt-0.5 text-xs text-silver">
                      Fiyat {a.condition === 'GREATER_THAN' ? 'ustune ciktiginda' : 'altina dustugunde'}: <span className="font-mono">${a.targetPrice}</span>
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber/10 px-2 py-1 text-xs text-amber">Aktif</span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
