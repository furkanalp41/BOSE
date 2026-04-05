import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { useMarketSocket } from '../hooks/useMarketSocket'

const SIGNAL_STYLES = {
  'AL':   'text-neon bg-neon/10 border-neon/20',
  'SAT':  'text-crimson bg-crimson/10 border-crimson/20',
  'TUT':  'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'İZLE': 'text-ice bg-ice/10 border-ice/20',
}

export default function WatchlistAnalysis() {
  const user = useAuthStore(s => s.user)
  const { assets, prices } = useMarketSocket()
  const [selectedSymbols, setSelectedSymbols] = useState([])
  const [watchlistName, setWatchlistName] = useState('')
  const [analysisType, setAnalysisType] = useState('both')
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const toggleAsset = (symbol) => {
    setSelectedSymbols(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    )
  }

  const items = selectedSymbols.map((symbol, i) => {
    const asset = assets.find(a => a.symbol === symbol)
    const livePrice = prices[symbol]?.price
    return {
      id: i + 1,
      name: symbol,
      price: livePrice ?? asset?.price ?? 0,
      risk_score: 5,
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await aiReportsApi.analyzeWatchlist({
        user_context: { user_id: user?.id || 'anonymous', risk_preference: 5 },
        watchlist_name: watchlistName || 'My Watchlist',
        items,
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
            <p className="text-silver text-xs">Select assets from live market for AI signal analysis</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Watchlist Name</label>
            <input type="text" value={watchlistName} onChange={(e) => setWatchlistName(e.target.value)}
              placeholder="My Watchlist" className="input-base py-2.5 text-sm" />
          </div>

          <div className="space-y-3">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">
              Select Assets ({selectedSymbols.length} selected)
            </label>
            {assets.length === 0 ? (
              <div className="text-white/25 text-xs font-mono text-center py-6">
                Connecting to market feed...
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {assets.map(asset => {
                  const isSelected = selectedSymbols.includes(asset.symbol)
                  const livePrice = prices[asset.symbol]?.price
                  return (
                    <button key={asset.symbol} type="button" onClick={() => toggleAsset(asset.symbol)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono border transition-all
                        ${isSelected
                          ? 'bg-ice/10 border-ice/30 text-ice'
                          : 'bg-white/[0.02] border-border text-silver hover:border-white/20 hover:text-cloud'}`}>
                      <span className="font-bold">{asset.symbol}</span>
                      {livePrice && <span className="text-white/30">${livePrice.toFixed(2)}</span>}
                    </button>
                  )
                })}
              </div>
            )}

            {selectedSymbols.length > 0 && (
              <div className="space-y-1">
                <p className="text-silver/50 text-[10px] font-mono">Selected items (prices auto-filled from live feed):</p>
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono px-3 py-1.5 rounded-lg bg-white/[0.02]">
                    <span className="text-ice font-bold">{item.name}</span>
                    <span className="text-white/30">${item.price.toFixed(2)}</span>
                    <button type="button" onClick={() => toggleAsset(item.name)}
                      className="ml-auto text-crimson/60 hover:text-crimson text-[10px]">remove</button>
                  </div>
                ))}
              </div>
            )}
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

          <button type="submit" disabled={loading || selectedSymbols.length === 0}
            className="w-full h-12 rounded-xl text-sm font-bold bg-ice text-void hover:shadow-ice-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                Analyzing...
              </span>
            ) : `Analyze ${selectedSymbols.length} Asset${selectedSymbols.length !== 1 ? 's' : ''}`}
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
