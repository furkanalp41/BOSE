import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi, watchlistApi } from '../services/api'

const SIGNAL_STYLES = {
  'AL':   'text-neon bg-neon/10 border-neon/20',
  'BUY':  'text-neon bg-neon/10 border-neon/20',
  'SAT':  'text-crimson bg-crimson/10 border-crimson/20',
  'SELL': 'text-crimson bg-crimson/10 border-crimson/20',
  'TUT':  'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'HOLD': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'İZLE': 'text-ice bg-ice/10 border-ice/20',
  'WATCH':'text-ice bg-ice/10 border-ice/20',
}

export default function WatchlistAnalysis() {
  const [watchlists, setWatchlists] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [fetchingWl, setFetchingWl] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await watchlistApi.getAll()
        setWatchlists(data.data || data || [])
      } catch { /* empty */ }
      finally { setFetchingWl(false) }
    }
    fetch()
  }, [])

  const selectedWl = watchlists.find(wl => String(wl.id || wl.ID) === String(selectedId))

  const handleAnalyze = async () => {
    if (!selectedId) return
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await aiReportsApi.analyzeWatchlist({ watchlist_id: Number(selectedId) })
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ice/20 to-neon/10 border border-ice/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Watchlist Analysis</h3>
            <p className="text-silver text-xs">AI-powered signal analysis for your watchlist</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Select Watchlist</label>
            {fetchingWl ? (
              <div className="flex justify-center py-6">
                <motion.span className="block w-5 h-5 border-2 border-ice/30 border-t-ice rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              </div>
            ) : watchlists.length === 0 ? (
              <p className="text-silver/50 text-sm py-4">No watchlists found. Add assets to a watchlist first.</p>
            ) : (
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}
                className="input-base py-2.5 text-sm bg-void appearance-none cursor-pointer w-full">
                <option value="">Choose a watchlist...</option>
                {watchlists.map(wl => (
                  <option key={wl.id || wl.ID} value={wl.id || wl.ID}>
                    {wl.name} ({(wl.items || []).length} items)
                  </option>
                ))}
              </select>
            )}
          </div>

          {selectedWl && (selectedWl.items || []).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(selectedWl.items || []).map((item, i) => (
                <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded border text-ice bg-ice/10 border-ice/20 font-mono">
                  {item.symbol || item.Symbol}
                </span>
              ))}
            </div>
          )}

          <button onClick={handleAnalyze} disabled={loading || !selectedId}
            className="w-full h-12 rounded-xl text-sm font-bold bg-ice text-void hover:shadow-ice-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                AI analyzing watchlist...
              </span>
            ) : result ? 'Re-analyze Watchlist' : 'Analyze Watchlist'}
          </button>
        </div>

        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="glass p-6 md:p-8 space-y-6">

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-cloud">{result.watchlist_name || 'Results'}</h3>
              <div className="flex items-center gap-2">
                {result.top_pick && (
                  <span className="text-[10px] font-bold px-3 py-1 rounded-lg border text-neon bg-neon/10 border-neon/20">
                    Top Pick: {result.top_pick}
                  </span>
                )}
                <ModelBadge model={result.model_used} />
              </div>
            </div>

            {result.risk_warning && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-crimson/5 border border-crimson/20">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3b5c" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                <span className="text-crimson text-sm">{result.risk_warning}</span>
              </div>
            )}

            {/* AI Analysis Content */}
            {result.overall_summary && (
              <div className={`p-5 rounded-xl border ${isAI ? 'bg-ice/[0.02] border-ice/20' : 'bg-white/[0.02] border-border'}`}>
                <div className="flex items-center gap-2 mb-3">
                  {isAI && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00cfff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  )}
                  <p className={`text-xs uppercase tracking-widest font-medium ${isAI ? 'text-ice' : 'text-silver'}`}>
                    {isAI ? 'AI Summary' : 'Rules-Based Summary'}
                  </p>
                </div>
                <div className="text-cloud text-sm leading-relaxed whitespace-pre-wrap">
                  {result.overall_summary}
                </div>
              </div>
            )}

            {result.item_analyses?.length > 0 && (
              <div className="space-y-3">
                <p className="text-silver text-xs uppercase tracking-widest">Asset Signals</p>
                {result.item_analyses.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-border hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border shrink-0 ${SIGNAL_STYLES[item.signal] || 'text-silver bg-white/5 border-border'}`}>
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
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.confidence}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full bg-ice" />
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

function ModelBadge({ model }) {
  if (!model) return null
  const isAI = !model.includes('rules-engine')
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-lg border font-mono
      ${isAI ? 'text-ice bg-ice/10 border-ice/20' : 'text-silver bg-white/5 border-border'}`}>
      {isAI ? `AI: ${model}` : 'Rules Engine'}
    </span>
  )
}
