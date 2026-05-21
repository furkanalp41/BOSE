import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const RISK_LEVELS = [
  {
    value: 'Low',
    label: 'Dusuk Risk',
    description: 'Muhafazakar strateji. Dusuk volatiliteli varliklar ve uzun vadeli yatirimlar tercih edilir.',
    color: 'emerald',
  },
  {
    value: 'Medium',
    label: 'Orta Risk',
    description: 'Dengeli strateji. Risk ve getiri arasinda optimum denge hedeflenir.',
    color: 'yellow',
  },
  {
    value: 'High',
    label: 'Yuksek Risk',
    description: 'Agresif strateji. Yuksek volatiliteli varliklar ve kisa vadeli firsatlar takip edilir.',
    color: 'red',
  },
]

const INVESTMENT_TERMS = [
  { value: 'short', label: 'Kisa Vade', description: '1 gunden 1 haftaya' },
  { value: 'medium', label: 'Orta Vade', description: '1 haftadan 3 aya' },
  { value: 'long', label: 'Uzun Vade', description: '3 aydan fazla' },
]

export default function AIPreferences() {
  const { user, updateUser } = useAuth()
  const [riskLevel, setRiskLevel] = useState('Medium')
  const [investmentTerm, setInvestmentTerm] = useState('medium')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user?.ai_preferences) {
      try {
        const prefs = typeof user.ai_preferences === 'string'
          ? JSON.parse(user.ai_preferences)
          : user.ai_preferences
        if (prefs.risk_level) setRiskLevel(prefs.risk_level)
        if (prefs.investment_term) setInvestmentTerm(prefs.investment_term)
      } catch {
        // invalid JSON, use defaults
      }
    }
  }, [user])

  const handleSave = async () => {
    setMessage('')
    setError('')
    setSaving(true)

    try {
      await api.post(`/users/${user.ID}/ai-preferences`, {
        risk_level: riskLevel,
        investment_term: investmentTerm,
      })
      // Refresh user data
      const profileRes = await api.get(`/users/${user.ID}`)
      updateUser(profileRes.data.user)
      setMessage('AI tercihleri basariyla kaydedildi.')
    } catch (err) {
      setError(err.response?.data?.error || 'Tercihler kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  const colorMap = {
    emerald: {
      selected: 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/30',
      dot: 'bg-emerald-500',
    },
    yellow: {
      selected: 'border-yellow-500 ring-2 ring-yellow-500/30 bg-yellow-950/30',
      dot: 'bg-yellow-500',
    },
    red: {
      selected: 'border-red-500 ring-2 ring-red-500/30 bg-red-950/30',
      dot: 'bg-red-500',
    },
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">AI Analiz Tercihleri</h1>
        <p className="text-gray-400 mt-1">
          Yapay zeka destekli analizler icin yatirim profilinizi belirleyin
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-900/30 border border-emerald-800 rounded-lg text-emerald-400 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Risk Toleransi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RISK_LEVELS.map((level) => {
            const isSelected = riskLevel === level.value
            const colors = colorMap[level.color]
            return (
              <button
                key={level.value}
                onClick={() => setRiskLevel(level.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? colors.selected
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full ${colors.dot}`}></span>
                  <span className="font-medium text-gray-100">{level.label}</span>
                </div>
                <p className="text-xs text-gray-400">{level.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">Yatirim Vadesi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INVESTMENT_TERMS.map((term) => {
            const isSelected = investmentTerm === term.value
            return (
              <button
                key={term.value}
                onClick={() => setInvestmentTerm(term.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-950/30'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <span className="font-medium text-gray-100">{term.label}</span>
                <p className="text-xs text-gray-400 mt-1">{term.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
      >
        {saving ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
      </button>
    </div>
  )
}
