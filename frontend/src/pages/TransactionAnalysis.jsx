import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiReportsApi, tradingApi } from '../services/api'
import { useAuthStore } from '../store/authStore'

const IMPACT_STYLES = {
  'pozitif': 'text-neon bg-neon/10 border-neon/20',
  'negatif': 'text-crimson bg-crimson/10 border-crimson/20',
  'nötr':    'text-silver bg-white/5 border-border',
}

export default function TransactionAnalysis() {
  const user = useAuthStore(s => s.user)
  const [transactions, setTransactions] = useState([])
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    setFetching(true)
    try {
      const { data } = await tradingApi.getHistory()
      const trades = data.trades || data.history || data || []
      if (Array.isArray(trades) && trades.length > 0) {
        setTransactions(trades.map(t => ({
          symbol: t.symbol || t.Symbol || '',
          tx_type: (t.side || t.type || t.order_type || 'buy').toLowerCase(),
          quantity: t.quantity || t.amount || 1,
          price: t.price || t.entryPrice || 0,
          executed_at: t.createdAt || t.created_at || t.executed_at || new Date().toISOString().slice(0, 16),
        })))
      } else {
        setTransactions([{ symbol: '', tx_type: 'buy', quantity: 1, price: 0, executed_at: new Date().toISOString().slice(0, 16) }])
      }
    } catch {
      setTransactions([{ symbol: '', tx_type: 'buy', quantity: 1, price: 0, executed_at: new Date().toISOString().slice(0, 16) }])
    } finally { setFetching(false) }
  }

  useEffect(() => { fetchHistory() }, [])

  const updateTx = (i, field, value) => {
    setTransactions(prev => prev.map((tx, idx) =>
      idx === i ? { ...tx, [field]: field === 'quantity' || field === 'price' ? Number(value) : value } : tx
    ))
  }

  const addTx = () => setTransactions(prev => [...prev, { symbol: '', tx_type: 'buy', quantity: 1, price: 0, executed_at: new Date().toISOString().slice(0, 16) }])
  const removeTx = (i) => setTransactions(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const valid = transactions.filter(tx => tx.symbol.trim())
    if (valid.length === 0) return
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await aiReportsApi.analyzeTransactions({
        user_context: { user_id: user?.id || 'anonymous', risk_preference: 5 },
        transactions: valid,
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
        <div className="flex items-center justify-between">
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
          <button onClick={fetchHistory} disabled={fetching}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-silver hover:text-cloud hover:border-white/20 transition-colors disabled:opacity-40">
            {fetching ? (
              <motion.span className="block w-3 h-3 border-2 border-silver/30 border-t-silver rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
            ) : (
              <span className="flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Fetch Latest
              </span>
            )}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-3">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Transactions</label>
            {fetching ? (
              <div className="flex justify-center py-6">
                <motion.span className="block w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
              </div>
            ) : (
              <>
                {transactions.map((tx, i) => (
                  <div key={i} className="flex gap-2 items-end flex-wrap">
                    <input type="text" placeholder="Symbol" value={tx.symbol}
                      onChange={(e) => updateTx(i, 'symbol', e.target.value)}
                      className="input-base py-2 text-sm w-24" />
                    <select value={tx.tx_type} onChange={(e) => updateTx(i, 'tx_type', e.target.value)}
                      className="input-base py-2 text-sm bg-void appearance-none cursor-pointer w-24">
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                      <option value="buy_limit">Buy Limit</option>
                      <option value="sell_limit">Sell Limit</option>
                    </select>
                    <input type="number" placeholder="Qty" min="1" value={tx.quantity || ''}
                      onChange={(e) => updateTx(i, 'quantity', e.target.value)}
                      className="input-base py-2 text-sm w-20" />
                    <input type="number" placeholder="Price" min="0" step="0.01" value={tx.price || ''}
                      onChange={(e) => updateTx(i, 'price', e.target.value)}
                      className="input-base py-2 text-sm w-24" />
                    <input type="datetime-local" value={typeof tx.executed_at === 'string' ? tx.executed_at.slice(0, 16) : ''}
                      onChange={(e) => updateTx(i, 'executed_at', e.target.value)}
                      className="input-base py-2 text-sm" />
                    {transactions.length > 1 && (
                      <button type="button" onClick={() => removeTx(i)}
                        className="px-2 py-2 text-crimson hover:text-crimson/80 text-sm">✕</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addTx}
                  className="text-ice text-xs font-medium hover:text-ice/80 transition-colors">+ Add transaction</button>
              </>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-silver text-xs font-medium tracking-widest uppercase">Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}
              className="input-base py-2 text-sm bg-void appearance-none cursor-pointer w-40">
              <option value="en">English</option>
              <option value="tr">Turkish</option>
            </select>
          </div>

          <button type="submit" disabled={loading || fetching}
            className="w-full h-12 rounded-xl text-sm font-bold bg-neon text-void hover:shadow-neon-md active:scale-[0.98] transition-all duration-300 uppercase disabled:opacity-40">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                Analyzing...
              </span>
            ) : 'Analyze Transactions'}
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
                      <span className="text-silver text-[10px] font-mono">×{bp.frequency}</span>
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
