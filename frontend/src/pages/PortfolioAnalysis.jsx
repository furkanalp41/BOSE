import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi } from '../services/api'

const RISK_COLORS = { low: 'text-neon', medium: 'text-amber-400', high: 'text-crimson', very_high: 'text-crimson' }

export default function PortfolioAnalysis() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await aiReportsApi.analyzePortfolio({})
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon/20 to-ice/10 border border-neon/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Portfolio Analysis</h3>
            <p className="text-silver text-xs">AI-powered portfolio risk & alignment analysis</p>
          </div>
        </div>

        <button onClick={handleAnalyze} disabled={loading}
          className="w-full h-12 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              AI analyzing your portfolio...
            </span>
          ) : result ? 'Re-analyze Portfolio' : 'Analyze Portfolio'}
        </button>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass p-6 md:p-8 space-y-6">

            {/* Model Badge */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cloud">Analysis Results</h3>
              <ModelBadge model={result.model_used} />
            </div>

            {/* Account overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Balance', value: result.balance != null ? `$${result.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-', color: 'text-cloud' },
                { label: 'Total Value', value: result.total_value != null ? `$${result.total_value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-', color: 'text-neon' },
                { label: 'Risk Profile', value: (result.risk_level || '-').toUpperCase(), color: 'text-amber-400' },
                { label: 'Inv. Term', value: (result.investment_term || '-').replace(/_/g, ' ').toUpperCase(), color: 'text-ice' },
              ].map(card => (
                <div key={card.label} className="p-4 rounded-xl bg-white/[0.02] border border-border">
                  <span className="text-silver text-xs tracking-wide">{card.label}</span>
                  <p className={`font-mono font-bold text-lg mt-1 ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>

            {/* Scores with visual bars */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Alignment', value: result.alignment_score, max: 100, color: 'bg-neon', text: 'text-neon' },
                { label: 'Risk Score', value: result.portfolio_risk_score ? result.portfolio_risk_score * 10 : 0, max: 100, color: 'bg-amber-400', text: RISK_COLORS[result.overall_risk] || 'text-amber-400', display: result.overall_risk?.toUpperCase() },
                { label: 'Diversification', value: result.diversification_score, max: 100, color: 'bg-ice', text: 'text-ice' },
              ].map(card => (
                <div key={card.label} className="p-4 rounded-xl bg-white/[0.02] border border-border">
                  <span className="text-silver text-xs tracking-wide">{card.label}</span>
                  <p className={`font-mono font-bold text-lg mt-1 ${card.text}`}>{card.display || `${card.value ?? '-'}`}</p>
                  {card.value != null && (
                    <div className="h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, card.value)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${card.color}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Holdings */}
            {result.holdings?.length > 0 && (
              <div className="space-y-2">
                <p className="text-silver text-xs uppercase tracking-widest">Holdings ({result.holdings.length})</p>
                {result.holdings.map((h, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.02] border border-border hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-ice font-mono font-bold text-sm">{h.symbol}</span>
                      <span className="text-silver text-xs font-mono">{h.quantity} units @ ${h.avgEntry?.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-cloud font-mono text-sm">${h.marketValue?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      <span className={`ml-2 font-mono text-xs font-bold ${h.pnl >= 0 ? 'text-neon' : 'text-crimson'}`}>
                        {h.pnl >= 0 ? '+' : ''}${h.pnl?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* AI Analysis Content */}
            {result.analysis_content && (
              <div className={`p-5 rounded-xl border ${isAI ? 'bg-neon/[0.02] border-neon/20' : 'bg-white/[0.02] border-border'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isAI && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  )}
                  <p className={`text-xs uppercase tracking-widest font-medium ${isAI ? 'text-neon' : 'text-silver'}`}>
                    {isAI ? 'AI Analysis' : 'Rules-Based Analysis'}
                  </p>
                </div>
                <div className="text-cloud text-sm leading-relaxed whitespace-pre-wrap prose-sm">
                  {result.analysis_content}
                </div>
              </div>
            )}

            {/* Recommendations */}
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
      ${isAI ? 'text-neon bg-neon/10 border-neon/20' : 'text-silver bg-white/5 border-border'}`}>
      {isAI ? `AI: ${model}` : 'Rules Engine'}
    </span>
  )
}
