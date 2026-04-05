import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi } from '../services/api'

const RISK_COLORS = { low: 'text-neon', medium: 'text-amber-400', high: 'text-crimson', very_high: 'text-crimson' }

export default function PortfolioAnalysis() {
  const [holdings, setHoldings] = useState([{ stock: { id: 0, name: '', price: 0, risk_score: 5 }, quantity: 1 }])
  const [riskPref, setRiskPref] = useState(5)
  const [depth, setDepth] = useState('standard')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const updateHolding = (i, field, value) => {
    setHoldings(prev => prev.map((h, idx) => {
      if (idx !== i) return h
      if (field === 'quantity') return { ...h, quantity: Number(value) }
      return { ...h, stock: { ...h.stock, [field]: field === 'name' ? value : Number(value) } }
    }))
  }

  const addHolding = () => setHoldings(prev => [...prev, { stock: { id: prev.length, name: '', price: 0, risk_score: 5 }, quantity: 1 }])
  const removeHolding = (i) => setHoldings(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valid = holdings.filter(h => h.stock.name.trim())
    if (valid.length === 0) return
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await aiReportsApi.analyzePortfolio({
        user_context: { user_id: 'ui-user', risk_preference: riskPref },
        holdings: valid,
        analysis_depth: depth,
        language,
        include_recommendations: true,
      })
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon/20 to-ice/10 border border-neon/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Portfolio Analysis</h3>
            <p className="text-silver text-xs">AI-powered portfolio risk & alignment analysis</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Holdings</label>
            {holdings.map((h, i) => (
              <div key={i} className="flex gap-2 items-end">
                <input type="text" placeholder="Symbol" value={h.stock.name}
                  onChange={(e) => updateHolding(i, 'name', e.target.value)}
                  className="input-base py-2 text-sm flex-1" />
                <input type="number" placeholder="Price" min="0" step="0.01" value={h.stock.price || ''}
                  onChange={(e) => updateHolding(i, 'price', e.target.value)}
                  className="input-base py-2 text-sm w-24" />
                <input type="number" placeholder="Qty" min="1" value={h.quantity || ''}
                  onChange={(e) => updateHolding(i, 'quantity', e.target.value)}
                  className="input-base py-2 text-sm w-20" />
                <input type="number" placeholder="Risk" min="0" max="10" value={h.stock.risk_score}
                  onChange={(e) => updateHolding(i, 'risk_score', e.target.value)}
                  className="input-base py-2 text-sm w-20" />
                {holdings.length > 1 && (
                  <button type="button" onClick={() => removeHolding(i)}
                    className="px-2 py-2 text-crimson hover:text-crimson/80 text-sm">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addHolding}
              className="text-ice text-xs font-medium hover:text-ice/80 transition-colors">+ Add holding</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-silver text-xs font-medium tracking-widest uppercase">Risk Preference</label>
              <input type="range" min="0" max="10" value={riskPref} onChange={(e) => setRiskPref(Number(e.target.value))}
                className="w-full accent-neon" />
              <span className="text-cloud text-xs font-mono">{riskPref}/10</span>
            </div>
            <div className="space-y-1.5">
              <label className="text-silver text-xs font-medium tracking-widest uppercase">Depth</label>
              <select value={depth} onChange={(e) => setDepth(e.target.value)}
                className="input-base py-2 text-sm bg-void appearance-none cursor-pointer">
                <option value="brief">Brief</option>
                <option value="standard">Standard</option>
                <option value="detailed">Detailed</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-silver text-xs font-medium tracking-widest uppercase">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}
                className="input-base py-2 text-sm bg-void appearance-none cursor-pointer">
                <option value="en">English</option>
                <option value="tr">Turkish</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-12 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                Analyzing...
              </span>
            ) : 'Analyze Portfolio'}
          </button>
        </form>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-bold text-cloud">Analysis Results</h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Alignment', value: `${result.alignment_score ?? '-'}/100`, color: 'text-neon' },
                { label: 'Risk Level', value: result.overall_risk ?? '-', color: RISK_COLORS[result.overall_risk] || 'text-silver' },
                { label: 'Risk Score', value: `${result.portfolio_risk_score?.toFixed(1) ?? '-'}/10`, color: 'text-amber-400' },
                { label: 'Diversification', value: result.diversification_score != null ? `${result.diversification_score}/100` : '-', color: 'text-ice' },
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
