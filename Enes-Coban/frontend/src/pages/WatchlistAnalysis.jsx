import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi } from '../services/api'

const SIGNAL_STYLES = {
  'AL':   'text-neon bg-neon/10 border-neon/20',
  'SAT':  'text-crimson bg-crimson/10 border-crimson/20',
  'TUT':  'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'İZLE': 'text-ice bg-ice/10 border-ice/20',
}

export default function WatchlistAnalysis() {
  const [items, setItems] = useState([{ id: 1, name: '', price: 0, risk_score: 5 }])
  const [watchlistName, setWatchlistName] = useState('')
  const [analysisType, setAnalysisType] = useState('both')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const updateItem = (i, field, value) => {
    setItems(prev => prev.map((item, idx) =>
      idx === i ? { ...item, [field]: field === 'name' ? value : Number(value) } : item
    ))
  }

  const addItem = () => setItems(prev => [...prev, { id: prev.length + 1, name: '', price: 0, risk_score: 5 }])
  const removeItem = (i) => setItems(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valid = items.filter(it => it.name.trim())
    if (valid.length === 0) return
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await aiReportsApi.analyzeWatchlist({
        user_context: { user_id: 'ui-user', risk_preference: 5 },
        watchlist_name: watchlistName || 'My Watchlist',
        items: valid,
        analysis_type: analysisType,
        language,
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice/20 to-neon/10 border border-ice/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Watchlist Analysis</h3>
            <p className="text-silver text-xs">AI signal analysis for your watchlist items</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Watchlist Name</label>
            <input type="text" value={watchlistName} onChange={(e) => setWatchlistName(e.target.value)}
              placeholder="My Watchlist" className="input-base py-2.5 text-sm" />
          </div>

          <div className="space-y-3">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Items</label>
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-end">
                <input type="text" placeholder="Symbol" value={item.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                  className="input-base py-2 text-sm flex-1" />
                <input type="number" placeholder="Price" min="0" step="0.01" value={item.price || ''}
                  onChange={(e) => updateItem(i, 'price', e.target.value)}
                  className="input-base py-2 text-sm w-24" />
                <input type="number" placeholder="Risk" min="0" max="10" value={item.risk_score}
                  onChange={(e) => updateItem(i, 'risk_score', e.target.value)}
                  className="input-base py-2 text-sm w-20" />
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)}
                    className="px-2 py-2 text-crimson hover:text-crimson/80 text-sm">✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem}
              className="text-ice text-xs font-medium hover:text-ice/80 transition-colors">+ Add item</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-silver text-xs font-medium tracking-widest uppercase">Analysis Type</label>
              <div className="flex gap-2">
                {['technical', 'fundamental', 'both'].map(t => (
                  <button key={t} type="button" onClick={() => setAnalysisType(t)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-300 border uppercase
                      ${analysisType === t
                        ? 'bg-ice/10 border-ice/30 text-ice'
                        : 'bg-white/[0.02] border-border text-silver hover:border-white/20'}`}>
                    {t}
                  </button>
                ))}
              </div>
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
            className="w-full h-12 rounded-xl text-sm font-bold bg-ice text-void hover:shadow-ice-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                Analyzing...
              </span>
            ) : 'Analyze Watchlist'}
          </button>
        </form>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cloud">{result.watchlist_name || 'Results'}</h3>
              {result.top_pick && (
                <span className="text-[10px] font-bold px-3 py-1 rounded-lg border text-neon bg-neon/10 border-neon/20">
                  Top Pick: {result.top_pick}
                </span>
              )}
            </div>

            {result.risk_warning && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-crimson/5 border border-crimson/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3b5c" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <span className="text-crimson text-sm">{result.risk_warning}</span>
              </div>
            )}

            {result.overall_summary && (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-border">
                <p className="text-cloud text-sm whitespace-pre-wrap">{result.overall_summary}</p>
              </div>
            )}

            {result.item_analyses?.length > 0 && (
              <div className="space-y-3">
                {result.item_analyses.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-border hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${SIGNAL_STYLES[item.signal] || 'text-silver bg-white/5 border-border'}`}>
                        {item.signal}
                      </span>
                      <div className="min-w-0">
                        <p className="text-cloud font-mono font-bold text-sm">{item.symbol}</p>
                        <p className="text-silver text-xs truncate">{item.summary}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div className="h-full rounded-full bg-ice" style={{ width: `${item.confidence}%` }} />
                        </div>
                        <span className="text-ice font-mono text-xs font-bold">{item.confidence}%</span>
                      </div>
                      {item.target_price && <p className="text-silver text-[10px] mt-1">Target: ${item.target_price}</p>}
                    </div>
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
