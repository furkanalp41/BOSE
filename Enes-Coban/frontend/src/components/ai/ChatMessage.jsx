import { motion } from 'framer-motion'
import clsx from 'clsx'

const RISK_COLORS = {
  LOW: 'text-ice border-ice/20 bg-ice/10',
  MEDIUM: 'text-neon border-neon/20 bg-neon/10',
  HIGH: 'text-crimson border-crimson/20 bg-crimson/10',
}

const ACTION_COLORS = {
  BUY: 'text-neon bg-neon/10 border-neon/20',
  SELL: 'text-crimson bg-crimson/10 border-crimson/20',
  HOLD: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
}

export default function ChatMessage({ advice, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass p-5 space-y-4 rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-cloud font-bold text-sm">AI Advisor</span>
        </div>
        <span className="text-silver/40 text-[10px] font-mono">
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Summary */}
      {advice.summary && (
        <p className="text-silver text-sm leading-relaxed">{advice.summary}</p>
      )}

      {/* Recommendations */}
      {advice.recommendations?.length > 0 && (
        <div className="space-y-3">
          <p className="text-silver text-xs font-medium tracking-widest uppercase">Recommendations</p>
          {advice.recommendations.map((rec, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded border', ACTION_COLORS[rec.action] || ACTION_COLORS.HOLD)}>
                    {rec.action}
                  </span>
                  <span className="text-cloud font-mono font-bold text-sm">{rec.symbol}</span>
                </div>
                {rec.confidence && (
                  <span className="text-silver/60 text-[10px] font-mono">
                    {(rec.confidence * 100).toFixed(0)}% confidence
                  </span>
                )}
              </div>
              {rec.reason && <p className="text-silver text-xs leading-relaxed">{rec.reason}</p>}
            </motion.div>
          ))}
        </div>
      )}

      {/* Risk profile badge */}
      {advice.riskLevel && (
        <div className="flex items-center gap-2 pt-1">
          <span className="text-silver/40 text-[10px]">Based on:</span>
          <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded border', RISK_COLORS[advice.riskLevel] || RISK_COLORS.MEDIUM)}>
            {advice.riskLevel} RISK
          </span>
          {advice.investmentTerm && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded border text-silver border-border bg-white/[0.03]">
              {advice.investmentTerm.replace('_', ' ')}
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
