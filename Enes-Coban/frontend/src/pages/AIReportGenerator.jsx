import { useState } from 'react'
import api from '../api/axios'
import { Brain, Loader2, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import NeonButton from '../ui/NeonButton'
import StatTile from '../ui/StatTile'

const QUICK_SYMBOLS = ['THYAO', 'GARAN', 'ASELS', 'AAPL', 'TSLA', 'BTC']

const RECOMMENDATION_META = {
  BUY: { label: 'AL', accent: 'text-bull', Icon: TrendingUp },
  HOLD: { label: 'TUT', accent: 'text-amber', Icon: Minus },
  SELL: { label: 'SAT', accent: 'text-bear', Icon: TrendingDown },
}

export default function AIReportGenerator() {
  const [symbol, setSymbol] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const runAnalysis = async (raw) => {
    const target = (raw ?? symbol).trim().toUpperCase()
    if (!target) {
      setError('Lutfen bir varlik sembolu girin.')
      return
    }
    setSymbol(target)
    setLoading(true)
    setError('')
    setReport(null)
    try {
      const r = await api.get(`/ai/report/status/${encodeURIComponent(target)}`)
      setReport(r.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Analiz basarisiz oldu.')
    } finally { setLoading(false) }
  }

  const meta = report ? (RECOMMENDATION_META[report.recommendation] || RECOMMENDATION_META.HOLD) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain size={28} className="text-neon" />
        <h1 className="text-2xl font-bold text-cloud">AI Durum Raporu</h1>
      </div>

      {error && (
        <div className="rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">{error}</div>
      )}

      <GlassCard className="p-6 space-y-5">
        <p className="text-sm text-silver">
          Bir varlik sembolu girin ve simulasyon tabanli AL / TUT / SAT durum raporunu goruntuleyin.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); runAnalysis() }} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-silver">Varlik Sembolu</span>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="orn. THYAO"
              className="input-base font-mono uppercase"
            />
          </div>
          <NeonButton type="submit" disabled={loading} className="sm:w-auto">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {loading ? 'Analiz ediliyor...' : 'Rapor Olustur'}
          </NeonButton>
        </form>

        <div className="flex flex-wrap gap-2">
          {QUICK_SYMBOLS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => runAnalysis(s)}
              disabled={loading}
              className="rounded-full border border-edge px-3 py-1 font-mono text-xs text-silver transition-colors hover:border-neon hover:text-neon disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </GlassCard>

      {report && meta && (
        <GlassCard className="p-6 space-y-5" glow>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-2xl font-black text-cloud">{report.symbol}</span>
            </div>
            <div className={`flex items-center gap-2 ${meta.accent}`}>
              <meta.Icon size={22} />
              <span className="font-mono text-xl font-bold">{report.recommendation}</span>
              <span className="text-sm text-silver">({meta.label})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-edge pt-4">
            <StatTile label="Tavsiye" value={report.recommendation} accent={meta.accent} />
            <StatTile label="Duygu Skoru" value={`${report.sentimentScore} / 100`} accent="text-ice" />
          </div>

          <div className="rounded-xl border border-edge bg-white/5 p-5">
            <h3 className="mb-3 text-sm font-semibold text-neon">Analiz Sonucu</h3>
            <div className="text-sm leading-relaxed text-cloud whitespace-pre-wrap">{report.analysisText}</div>
          </div>
        </GlassCard>
      )}
    </div>
  )
}
