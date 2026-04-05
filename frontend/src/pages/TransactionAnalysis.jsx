import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi } from '../services/api'

const IMPACT_STYLES = {
  'pozitif': 'text-neon bg-neon/10 border-neon/20',
  'negatif': 'text-crimson bg-crimson/10 border-crimson/20',
  'nötr':    'text-silver bg-white/5 border-border',
}

export default function TransactionAnalysis() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await aiReportsApi.analyzeTransactions({})
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-ice/10 border border-purple-500/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 12 5 12 9 3 15 21 19 12 23 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Transaction Analysis</h3>
            <p className="text-silver text-xs">AI analysis of your trading behavior</p>
          </div>
        </div>

        <p className="text-silver text-sm">
          Analyze your trading history to identify behavior patterns, win rate, and get personalized recommendations.
        </p>

        <button onClick={handleAnalyze} disabled={loading}
          className="w-full h-12 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              Analyzing...
            </span>
          ) : 'Analyze Transactions'}
        </button>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-cloud">Analysis Results</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total Txns', value: result.total_transactions, color: 'text-cloud' },
                { label: 'Win Rate', value: result.win_rate != null ? `${(result.win_rate * 100).toFixed(1)}%` : '-', color: 'text-neon' },
                { label: 'Buy Volume', value: `$${result.total_buy_volume?.toFixed(0)}`, color: 'text-ice' },
                { label: 'Most Traded', value: result.most_traded_symbol || '-', color: 'text-amber-400' },
              ].map(card => (
                <div key={card.label} className="p-4 rounded-xl bg-white/[0.02] border border-border">
                  <span className="text-silver text-xs tracking-wide">{card.label}</span>
                  <p className={`font-mono font-bold text-xl mt-1 ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {result.analysis_content && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-border">
                <p className="text-silver text-xs uppercase tracking-widest mb-2">Analysis</p>
                <p className="text-cloud text-sm whitespace-pre-wrap">{result.analysis_content}</p>
              </div>
            )}

            {result.behavior_patterns?.length > 0 && (
              <div className="space-y-2">
                <p className="text-silver text-xs uppercase tracking-widest">Behavior Patterns</p>
                {result.behavior_patterns.map((bp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-cloud font-bold text-sm">{bp.pattern_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${IMPACT_STYLES[bp.impact] || IMPACT_STYLES['nötr']}`}>
                        {bp.impact}
                      </span>
                      <span className="text-silver text-[10px] font-mono">{bp.frequency}x</span>
                    </div>
                    <p className="text-silver text-xs">{bp.description}</p>
                    {bp.suggestion && <p className="text-ice text-xs">{bp.suggestion}</p>}
                  </div>
                ))}
              </div>
            )}

            {result.recommendations?.length > 0 && (
              <div className="space-y-2">
                <p className="text-silver text-xs uppercase tracking-widest">Recommendations</p>
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-border">
                    <span className="text-neon mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                    </span>
                    <span className="text-cloud text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-silver/30 text-[10px] font-mono">Model: {result.model_used} · ID: {result.request_id}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
