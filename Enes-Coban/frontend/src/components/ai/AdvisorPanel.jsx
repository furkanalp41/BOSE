import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import ChatMessage from './ChatMessage'

export default function AdvisorPanel() {
  const user = useAuthStore((s) => s.user)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGetAdvice = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await aiApi.getAdvice()
      setMessages((prev) => [data, ...prev])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get advice')
    } finally { setLoading(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="space-y-6">
      {/* Header card */}
      <div className="glass p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice/20 to-neon/10 border border-ice/20 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">AI Trading Advisor</h3>
            <p className="text-silver text-xs">Personalised investment suggestions based on your risk profile</p>
          </div>
        </div>

        {/* Current profile summary */}
        <div className="flex flex-wrap gap-3">
          <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-border">
            <span className="text-silver text-[10px] tracking-widest uppercase block">Risk Level</span>
            <span className="text-cloud font-mono font-bold text-sm">{user?.riskLevel || 'MEDIUM'}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/[0.03] border border-border">
            <span className="text-silver text-[10px] tracking-widest uppercase block">Horizon</span>
            <span className="text-cloud font-mono font-bold text-sm">{(user?.investmentTerm || 'MEDIUM_TERM').replace('_', ' ')}</span>
          </div>
        </div>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleGetAdvice} disabled={loading}
          className="btn-primary w-full h-12 text-sm flex items-center justify-center gap-2">
          {loading ? (
            <>
              <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              Analysing markets...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Get AI Advice
            </>
          )}
        </motion.button>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {messages.map((msg, i) => (
          <ChatMessage key={i} advice={msg} index={i} />
        ))}
      </AnimatePresence>

      {messages.length === 0 && !loading && (
        <div className="glass p-8 rounded-2xl text-center">
          <p className="text-silver/40 text-sm">Click "Get AI Advice" to receive personalised trading recommendations</p>
        </div>
      )}
    </motion.div>
  )
}
