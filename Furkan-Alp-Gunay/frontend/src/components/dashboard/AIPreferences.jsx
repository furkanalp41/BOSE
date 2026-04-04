import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { userApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const riskLevels = [
  { id: 'LOW', label: 'Conservative', badge: 'Low Risk', icon: '🛡', desc: 'Stable, low-volatility assets. Capital preservation over growth.', color: '#00cfff', glow: 'rgba(0,207,255,0.35)', border: 'border-ice/30', bg: 'bg-ice/5', textCol: 'text-ice', pillBg: 'bg-ice/10 border-ice/20 text-ice' },
  { id: 'MEDIUM', label: 'Balanced', badge: 'Medium Risk', icon: '⚖', desc: 'Diversified mix of growth and income assets. Steady returns.', color: '#00ff88', glow: 'rgba(0,255,136,0.35)', border: 'border-neon/30', bg: 'bg-neon/5', textCol: 'text-neon', pillBg: 'bg-neon/10 border-neon/20 text-neon' },
  { id: 'HIGH', label: 'Aggressive', badge: 'High Risk', icon: '🚀', desc: 'High-volatility plays for maximum upside. Suits risk-tolerant traders.', color: '#ff3b5c', glow: 'rgba(255,59,92,0.35)', border: 'border-crimson/30', bg: 'bg-crimson/5', textCol: 'text-crimson', pillBg: 'bg-crimson/10 border-crimson/20 text-crimson' },
]

const investmentTerms = [
  { id: 'SHORT_TERM', label: 'Short-Term', sub: 'Days - Weeks', icon: '⚡' },
  { id: 'MEDIUM_TERM', label: 'Medium-Term', sub: 'Months', icon: '📈' },
  { id: 'LONG_TERM', label: 'Long-Term', sub: 'Years', icon: '🏔' },
]

export default function AIPreferences() {
  const user       = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const [risk, setRisk] = useState(user?.riskLevel ?? 'MEDIUM')
  const [term, setTerm] = useState(user?.investmentTerm ?? 'MEDIUM_TERM')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await userApi.updateAIPrefs(user.id, { riskLevel: risk, investmentTerm: term })
      updateUser(data.user); setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (err) { setError(err.response?.data?.error || 'Failed to save preferences') }
    finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="glass p-6 md:p-8 space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice/20 to-neon/10 border border-ice/20 flex items-center justify-center">
          <span className="text-lg">🤖</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">AI Trading Advisor</h3>
          <p className="text-silver text-xs">Personalise your automated strategy</p>
        </div>
      </div>

      <div>
        <p className="text-silver text-xs font-medium tracking-widest uppercase mb-4">Risk Tolerance</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {riskLevels.map((lvl) => {
            const selected = risk === lvl.id
            return (
              <motion.button key={lvl.id} onClick={() => setRisk(lvl.id)} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                className={`relative text-left p-5 rounded-2xl border transition-colors duration-300
                  ${selected ? `${lvl.bg} ${lvl.border}` : 'bg-white/[0.02] border-border hover:border-white/20'}`}
                style={selected ? { boxShadow: `0 0 0 1px ${lvl.color}40, 0 0 20px ${lvl.glow}` } : {}}>
                {selected && <motion.div layoutId="risk-ring" className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ border: `1.5px solid ${lvl.color}`, boxShadow: `0 0 12px ${lvl.glow}` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }} />}
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{lvl.icon}</span>
                  {selected && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: lvl.color, background: `${lvl.color}20` }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: lvl.color }} />
                  </motion.div>}
                </div>
                <p className={`font-bold text-sm mb-1 ${selected ? lvl.textCol : 'text-cloud'}`}>{lvl.label}</p>
                <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border mb-2 ${lvl.pillBg}`}>{lvl.badge}</span>
                <p className="text-silver text-xs leading-relaxed">{lvl.desc}</p>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-silver text-xs font-medium tracking-widest uppercase mb-4">Investment Horizon</p>
        <div className="flex flex-wrap gap-3">
          {investmentTerms.map((t) => {
            const selected = term === t.id
            return (
              <motion.button key={t.id} onClick={() => setTerm(t.id)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                className={`relative flex items-center gap-3 px-5 py-3 rounded-xl border transition-colors duration-300 text-sm font-semibold
                  ${selected ? 'bg-neon/10 border-neon/30 text-neon shadow-neon-sm' : 'bg-white/[0.02] border-border text-silver hover:border-neon/20 hover:text-cloud'}`}>
                {selected && <motion.div layoutId="term-ring" className="absolute inset-0 rounded-xl border border-neon/50 pointer-events-none"
                  style={{ boxShadow: '0 0 10px rgba(0,255,136,0.25)' }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} />}
                <span>{t.icon}</span>
                <div className="text-left">
                  <p>{t.label}</p>
                  <p className={`text-[10px] font-normal ${selected ? 'text-neon/70' : 'text-silver/60'}`}>{t.sub}</p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={loading} className="btn-primary px-8 h-11 text-sm">
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.span className="block w-3.5 h-3.5 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />Saving...
            </span>
          ) : 'Save Preferences'}
        </button>
        <AnimatePresence>
          {saved && (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-neon text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
              Preferences saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
