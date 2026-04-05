import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi } from '../services/api'

const IMPACT_STYLES = {
  'pozitif':  'text-neon bg-neon/10 border-neon/20',
  'positive': 'text-neon bg-neon/10 border-neon/20',
  'negatif':  'text-crimson bg-crimson/10 border-crimson/20',
  'negative': 'text-crimson bg-crimson/10 border-crimson/20',
  'nötr':     'text-silver bg-white/5 border-border',
  'neutral':  'text-silver bg-white/5 border-border',
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

  const isAI = result?.model_used && !result.model_used.includes('rules-engine')

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

        <button onClick={handleAnalyze} disabled={loading}
          className="w-full h-12 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              AI analyzing your trades...
            </span>
          ) : result ? 'Re-analyze Transactions' : 'Analyze Transactions'}
        </button>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass p-6 md:p-8 space-y-6">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cloud">Analysis Results</h3>
              <ModelBadge model={result.model_used} />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total Trades', value: result.total_transactions ?? '-', color: 'text-cloud' },
                { label: 'Win Rate', value: result.win_rate != null ? `${(result.win_rate * 100).toFixed(1)}%` : '-', color: 'text-neon' },
                { label: 'Buy Volume', value: result.total_buy_volume != null ? `$${result.total_buy_volume.toLocaleString()}` : '-', color: 'text-ice' },
                { label: 'Most Traded', value: result.most_traded_symbol || '-', color: 'text-amber-400' },
              ].map(card => (
                <div key={card.label} className="p-4 rounded-xl bg-white/[0.02] border border-border">
                  <span className="text-silver text-xs tracking-wide">{card.label}</span>
                  <p className={`font-mono font-bold text-lg mt-1 ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* AI Analysis Content */}
            {result.analysis_content && (
              <div className={`p-5 rounded-xl border ${isAI ? 'bg-purple-500/[0.02] border-purple-500/20' : 'bg-white/[0.02] border-border'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isAI && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  )}
                  <p className={`text-xs uppercase tracking-widest font-medium ${isAI ? 'text-purple-400' : 'text-silver'}`}>
                    {isAI ? 'AI Analysis' : 'Rules-Based Analysis'}
                  </p>
                </div>
                <div className="text-cloud text-sm leading-relaxed whitespace-pre-wrap">
                  {result.analysis_content}
                </div>
              </div>
            )}

            {result.behavior_patterns?.length > 0 && (
              <div className="space-y-2">
                <p className="text-silver text-xs uppercase tracking-widest">Behavior Patterns</p>
                {result.behavior_patterns.map((bp, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-2 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-cloud font-bold text-sm">{bp.pattern_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${IMPACT_STYLES[bp.impact?.toLowerCase()] || IMPACT_STYLES['neutral']}`}>
                        {bp.impact}
                      </span>
                      {bp.frequency && <span className="text-silver text-[10px] font-mono">{bp.frequency}x</span>}
                    </div>
                    <p className="text-silver text-xs">{bp.description}</p>
                    {bp.suggestion && (
                      <div className="flex items-start gap-2 mt-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" className="mt-0.5 shrink-0"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                        <p className="text-ice text-xs">{bp.suggestion}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {result.recommendations?.length > 0 && (
              <div className="space-y-2">
                <p className="text-silver text-xs uppercase tracking-widest">Recommendations</p>
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-border">
                    <span className="text-neon mt-0.5 shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
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

function ModelBadge({ model }) {
  if (!model) return null
  const isAI = !model.includes('rules-engine')
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border font-mono
      ${isAI ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-silver bg-white/5 border-border'}`}>
      {isAI ? `AI: ${model}` : 'Rules Engine'}
    </span>
  )
}
