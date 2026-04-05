import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { leaderboardApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

export default function RankTable() {
  const user = useAuthStore((s) => s.user)
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    leaderboardApi.getRankings()
      .then(({ data }) => setRankings(data.rankings || []))
      .catch(() => setRankings([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-neon/10 border border-yellow-500/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Leaderboard</h3>
          <p className="text-silver text-xs">Top traders by portfolio value</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.span className="block w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No rankings yet</p>
          <p className="text-silver/50 text-xs mt-1">Start trading to appear on the leaderboard</p>
        </div>
      ) : (
        <div className="space-y-2">
          {rankings.map((entry) => {
            const rank = entry.rank
            const isMe = entry.userId === user?.id
            return (
              <motion.div key={entry.userId} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (rank - 1) * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-colors
                  ${isMe ? 'bg-neon/[0.06] border border-neon/20' : 'bg-white/[0.02] border border-border hover:border-white/10'}`}>
                {/* Rank */}
                <div className="w-8 text-center flex-shrink-0">
                  {MEDALS[rank] ? (
                    <span className="text-xl">{MEDALS[rank]}</span>
                  ) : (
                    <span className="text-silver font-mono font-bold text-sm">#{rank}</span>
                  )}
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    ${isMe ? 'bg-neon/20 border border-neon/30' : 'bg-white/[0.06] border border-border'}`}>
                    <span className={`font-bold text-sm ${isMe ? 'text-neon' : 'text-silver'}`}>
                      {entry.fullName?.[0]?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm truncate ${isMe ? 'text-neon' : 'text-cloud'}`}>
                      {entry.fullName}{isMe && ' (You)'}
                    </p>
                    <p className="text-silver/50 text-[10px] font-mono">{entry.tradeCount || 0} trades</p>
                  </div>
                </div>

                {/* Portfolio value + P&L */}
                <div className="text-right flex-shrink-0">
                  <p className={`font-mono font-bold text-sm ${rank <= 3 ? 'text-neon' : 'text-cloud'}`}>
                    ${entry.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className={`text-[10px] font-mono ${entry.pnl >= 0 ? 'text-neon' : 'text-crimson'}`}>
                    {entry.pnl >= 0 ? '+' : ''}{entry.pnl?.toFixed(2)} ({entry.pnl >= 0 ? '+' : ''}{entry.pnlPercent?.toFixed(2)}%)
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
