import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { leaderboardApi } from '../../services/api'

// Maps backend icon field to emoji — matches SeedAchievements in leaderboard.go
const BADGE_ICONS = {
  rocket:  '🚀',
  chart:   '📊',
  trophy:  '🏆',
  crown:   '👑',
  money:   '💰',
  pie:     '🌐',
}

export default function BadgeDisplay() {
  const [achievements, setAchievements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    leaderboardApi.getAchievements()
      .then(({ data }) => setAchievements(Array.isArray(data) ? data : []))
      .catch(() => setAchievements([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
      className="glass p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-yellow-500/10 border border-purple-500/20 flex items-center justify-center">
          <span className="text-lg">🏅</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Achievements</h3>
          <p className="text-silver text-xs">
            {achievements.filter(a => a.earned).length} / {achievements.length} unlocked
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.span className="block w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      ) : achievements.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No achievements available</p>
          <p className="text-silver/50 text-xs mt-1">Trade to unlock badges</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {achievements.map((ach, i) => {
            const icon = BADGE_ICONS[ach.icon] || '🏆'
            return (
              <motion.div key={ach.id || ach.code} initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                className={`relative p-4 rounded-xl border text-center transition-all
                  ${ach.earned
                    ? 'bg-neon/[0.05] border-neon/20 shadow-neon-sm'
                    : 'bg-white/[0.02] border-border opacity-50 grayscale'}`}>
                <div className="text-3xl mb-2">{icon}</div>
                <p className={`text-xs font-bold ${ach.earned ? 'text-cloud' : 'text-silver'}`}>{ach.name}</p>
                <p className="text-silver/50 text-[10px] mt-1">{ach.description}</p>
                {ach.earned && ach.earnedAt && (
                  <p className="text-neon/60 text-[9px] font-mono mt-2">
                    {new Date(ach.earnedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                )}
                {!ach.earned && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-silver/30">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
