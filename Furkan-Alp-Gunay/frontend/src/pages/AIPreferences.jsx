import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'

const RISK_LEVELS = [
  {
    value: 'Low',
    label: 'Dusuk Risk',
    description: 'Muhafazakar strateji. Dusuk volatiliteli varliklar ve uzun vadeli yatirimlar tercih edilir.',
    color: 'neon',
  },
  {
    value: 'Medium',
    label: 'Orta Risk',
    description: 'Dengeli strateji. Risk ve getiri arasinda optimum denge hedeflenir.',
    color: 'amber',
  },
  {
    value: 'High',
    label: 'Yuksek Risk',
    description: 'Agresif strateji. Yuksek volatiliteli varliklar ve kisa vadeli firsatlar takip edilir.',
    color: 'crimson',
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
    neon: {
      selected: 'border-neon ring-2 ring-neon/30 bg-neon/10',
      dot: 'bg-neon',
    },
    amber: {
      selected: 'border-amber ring-2 ring-amber/30 bg-amber/10',
      dot: 'bg-amber',
    },
    crimson: {
      selected: 'border-crimson ring-2 ring-crimson/30 bg-crimson/10',
      dot: 'bg-crimson',
    },
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-cloud">AI Analiz Tercihleri</h1>
        <p className="mt-1 text-silver">
          Yapay zeka destekli analizler icin yatirim profilinizi belirleyin
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-neon/40 bg-neon/10 p-3 text-sm text-neon">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">
          {error}
        </div>
      )}

      <GlassCard className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-cloud">Risk Toleransi</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {RISK_LEVELS.map((level) => {
            const isSelected = riskLevel === level.value
            const colors = colorMap[level.color]
            return (
              <button
                key={level.value}
                onClick={() => setRiskLevel(level.value)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? colors.selected
                    : 'border-edge bg-white/5 hover:border-silver/40'
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${colors.dot}`}></span>
                  <span className="font-medium text-cloud">{level.label}</span>
                </div>
                <p className="text-xs text-silver">{level.description}</p>
              </button>
            )
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-cloud">Yatirim Vadesi</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {INVESTMENT_TERMS.map((term) => {
            const isSelected = investmentTerm === term.value
            return (
              <button
                key={term.value}
                onClick={() => setInvestmentTerm(term.value)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-neon ring-2 ring-neon/30 bg-neon/10'
                    : 'border-edge bg-white/5 hover:border-silver/40'
                }`}
              >
                <span className="font-medium text-cloud">{term.label}</span>
                <p className="mt-1 text-xs text-silver">{term.description}</p>
              </button>
            )
          })}
        </div>
      </GlassCard>

      <NeonButton onClick={handleSave} disabled={saving} className="w-full py-3">
        {saving ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
      </NeonButton>
    </div>
  )
}
