import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { Settings, Shield, Clock, Save } from 'lucide-react'

const riskLevels = [
  { value: 'low', label: 'Dusuk Risk', desc: 'Sabit getirili ve buyuk hacimli varliklar', color: 'emerald' },
  { value: 'medium', label: 'Orta Risk', desc: 'Dengeli portfoy, karisik varliklar', color: 'yellow' },
  { value: 'high', label: 'Yuksek Risk', desc: 'Agresif buyume, volatil varliklar', color: 'red' },
]

const investTerms = [
  { value: 'short', label: 'Kisa Vade', desc: '1-3 ay' },
  { value: 'medium', label: 'Orta Vade', desc: '3-12 ay' },
  { value: 'long', label: 'Uzun Vade', desc: '1+ yil' },
]

export default function AIPreferences() {
  const { user, setUser } = useAuth()

  const existing = (() => {
    try { return JSON.parse(user?.ai_preferences || '{}') } catch { return {} }
  })()

  const [risk, setRisk] = useState(existing.risk_level || 'medium')
  const [term, setTerm] = useState(existing.investment_term || 'medium')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setMsg('')
    try {
      const prefs = JSON.stringify({ risk_level: risk, investment_term: term })
      await api.put('/users/ai-preferences', { ai_preferences: prefs })
      setUser(prev => ({ ...prev, ai_preferences: prefs }))
      setMsg('Tercihler kaydedildi!')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Kayit basarisiz.')
    } finally { setLoading(false) }
  }

  const colorMap = { emerald: 'border-emerald-500 bg-emerald-500/10 text-emerald-400', yellow: 'border-yellow-500 bg-yellow-500/10 text-yellow-400', red: 'border-red-500 bg-red-500/10 text-red-400' }
  const colorMapInactive = { emerald: 'hover:border-emerald-500/30', yellow: 'hover:border-yellow-500/30', red: 'hover:border-red-500/30' }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Settings size={28} className="text-purple-400" />
        <h1 className="text-2xl font-bold text-slate-100">AI Tercihleri</h1>
      </div>

      {msg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">{msg}</div>}
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={20} className="text-emerald-400" />
          <h2 className="text-lg font-semibold text-slate-100">Risk Seviyesi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {riskLevels.map(r => (
            <button key={r.value} onClick={() => setRisk(r.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${risk === r.value ? colorMap[r.color] : `border-slate-700 bg-slate-800/50 ${colorMapInactive[r.color]}`}`}>
              <p className={`font-semibold text-sm ${risk === r.value ? '' : 'text-slate-200'}`}>{r.label}</p>
              <p className="text-xs text-slate-400 mt-1">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-purple-400" />
          <h2 className="text-lg font-semibold text-slate-100">Yatirim Vadesi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {investTerms.map(t => (
            <button key={t.value} onClick={() => setTerm(t.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${term === t.value
                ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                : 'border-slate-700 bg-slate-800/50 hover:border-purple-500/30'}`}>
              <p className={`font-semibold text-sm mt-1 ${term === t.value ? '' : 'text-slate-200'}`}>{t.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={loading}
        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2">
        <Save size={16} /> {loading ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
      </button>
    </div>
  )
}
