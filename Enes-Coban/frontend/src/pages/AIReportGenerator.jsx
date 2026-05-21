import { useState } from 'react'
import api from '../api/axios'
import { Brain, Briefcase, Star, ArrowRightLeft, Loader2 } from 'lucide-react'

export default function AIReportGenerator() {
  const [tab, setTab] = useState('portfolio')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const tabs = [
    ['portfolio', 'Portfoy', Briefcase],
    ['watchlist', 'Watchlist', Star],
    ['transactions', 'Islemler', ArrowRightLeft],
  ]

  const runAnalysis = async (type) => {
    setLoading(true)
    setError('')
    setResult('')
    try {
      let r
      if (type === 'test') {
        r = await api.get('/ai/reports/portfolio/test')
      } else {
        r = await api.post(`/ai/reports/${type}`, {})
      }
      setResult(r.data.report || r.data.data || JSON.stringify(r.data, null, 2))
    } catch (err) {
      setError(err.response?.data?.error || 'Analiz basarisiz oldu.')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain size={28} className="text-purple-400" />
        <h1 className="text-2xl font-bold text-slate-100">AI Rapor Olusturucu</h1>
      </div>

      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
        {tabs.map(([k, l, Icon]) => (
          <button key={k} onClick={() => { setTab(k); setResult(''); setError('') }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center justify-center gap-1.5 ${tab === k ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:text-slate-200'}`}>
            <Icon size={14} /> {l}
          </button>
        ))}
      </div>

      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex gap-3">
          <button onClick={() => runAnalysis(tab)} disabled={loading}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            {loading ? 'Analiz ediliyor...' : `${tabs.find(t => t[0] === tab)?.[1]} Analizi Baslat`}
          </button>
          {tab === 'portfolio' && (
            <button onClick={() => runAnalysis('test')} disabled={loading}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors border border-slate-700">
              Test Analizi
            </button>
          )}
        </div>
        {result && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-purple-400 mb-3">Analiz Sonucu</h3>
            <div className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </div>
  )
}
