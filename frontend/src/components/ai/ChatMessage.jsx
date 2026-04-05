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

const ACTION_BG = {
  BUY: 'from-neon/5 to-transparent',
  SELL: 'from-crimson/5 to-transparent',
  HOLD: 'from-yellow-400/5 to-transparent',
}

export default function ChatMessage({ advice, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass p-5 space-y-4 rounded-2xl">
      {/* Header with confidence */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <span className="text-cloud font-bold text-sm">AI Advisor</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Confidence score */}
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${advice.confidence || 0}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${(advice.confidence || 0) >= 75 ? 'bg-neon' : (advice.confidence || 0) >= 50 ? 'bg-amber' : 'bg-crimson'}`}
              />
            </div>
            <span className="text-silver/60 text-[10px] font-mono">
              {(advice.confidence || 0).toFixed(0)}%
            </span>
          </div>
          <span className="text-silver/40 text-[10px] font-mono">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
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
              className={`p-4 rounded-xl bg-gradient-to-r ${ACTION_BG[rec.action] || ACTION_BG.HOLD} border border-border space-y-3`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded border', ACTION_COLORS[rec.action] || ACTION_COLORS.HOLD)}>
                    {rec.action}
                  </span>
                  <span className="text-cloud font-mono font-bold text-sm">{rec.symbol}</span>
                  <span className="text-silver/50 text-xs">{rec.name}</span>
                </div>
                {/* Allocation badge */}
                {rec.allocation > 0 && (
                  <span className="text-ice font-mono font-bold text-xs px-2 py-0.5 rounded bg-ice/10 border border-ice/20">
                    {rec.allocation}%
                  </span>
                )}
              </div>

              {rec.reason && <p className="text-silver text-xs leading-relaxed">{rec.reason}</p>}

              {/* Allocation bar */}
              {rec.allocation > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-silver/40 text-[10px]">Allocation</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rec.allocation}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full ${rec.action === 'BUY' ? 'bg-neon/70' : rec.action === 'SELL' ? 'bg-crimson/70' : 'bg-amber/70'}`}
                    />
                  </div>
                  <span className="text-silver/50 text-[10px] font-mono">{rec.allocation}%</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Footer: Risk profile + horizon */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <span className="text-silver/40 text-[10px]">Based on:</span>
        {advice.riskProfile && (
          <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded border', RISK_COLORS[advice.riskProfile] || RISK_COLORS.MEDIUM)}>
            {advice.riskProfile} RISK
          </span>
        )}
        {advice.horizon && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded border text-silver border-border bg-white/[0.03]">
            {advice.horizon.replace(/_/g, ' ')}
          </span>
        )}
      </div>
    </motion.div>
  )
}
