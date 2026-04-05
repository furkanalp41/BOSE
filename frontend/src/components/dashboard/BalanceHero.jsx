import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCountUp } from '../../hooks/useCountUp'
import { useAuthStore } from '../../store/authStore'
import { tradingApi } from '../../services/api'

function formatUSD(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n)
}

export default function BalanceHero() {
  const user    = useAuthStore((s) => s.user)
  const balance = user?.virtualBalance ?? 100_000

  const [inView, setInView] = useState(false)
  const [portfolio, setPortfolio] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetch = () => tradingApi.getPortfolio()
      .then(({ data }) => setPortfolio(data))
      .catch(() => {})
    fetch()
    const interval = setInterval(fetch, 10000)
    return () => clearInterval(interval)
  }, [])

  const totalValue = portfolio?.totalValue ?? balance
  const animated = useCountUp(Math.floor(totalValue), 2200, inView)
  const pnl = portfolio?.pnl ?? 0
  const pnlPct = portfolio?.pnlPercent ?? 0
  const isProfit = pnl >= 0

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }} className="relative overflow-hidden glass p-8 md:p-10">
      <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-8 right-0 w-48 h-48 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(0,207,255,0.06) 0%, transparent 70%)' }} />

      <div className="relative flex items-start justify-between mb-6">
        <div>
          <p className="text-silver text-xs font-medium tracking-widest uppercase mb-1">Total Portfolio Value</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon animate-pulse shadow-neon-sm" />
            <span className="text-neon text-xs font-medium">Live simulation</span>
          </div>
        </div>
        {/* P&L badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${isProfit ? 'bg-neon/10 border-neon/20' : 'bg-crimson/10 border-crimson/20'}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isProfit ? '#00ff88' : '#ff3b5c'} strokeWidth="2.5">
            {isProfit ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
          </svg>
          <span className={`font-mono font-bold text-sm ${isProfit ? 'text-neon' : 'text-crimson'}`}>
            {isProfit ? '+' : ''}{pnlPct.toFixed(2)}%
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-baseline gap-1">
          <motion.span className="text-4xl font-black text-neon/70 font-mono"
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : -10 }}
            transition={{ delay: 0.2, duration: 0.4 }}>$</motion.span>
          <motion.span className="text-6xl md:text-7xl font-black font-mono text-glow-neon" style={{ color: '#00ff88' }}>
            {animated.toLocaleString('en-US')}
          </motion.span>
          <motion.span className="text-3xl font-black font-mono text-neon/60"
            initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 1.8, duration: 0.4 }}>.00</motion.span>
        </div>

        {inView && (
          <motion.div className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,136,0.15) 50%, transparent 100%)', backgroundSize: '200% 100%' }}
            animate={{ backgroundPosition: ['-200% 0', '200% 0'] }} transition={{ duration: 2.2, ease: 'easeInOut' }} />
        )}
      </div>

      <motion.div className="relative mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 1.0, duration: 0.6 }}>
        {[
          { label: 'Cash Available', value: formatUSD(portfolio?.balance ?? balance), color: 'text-ice' },
          { label: 'In Positions', value: formatUSD(portfolio?.inPositions ?? 0), color: 'text-silver' },
          { label: 'Total P&L', value: `${pnl >= 0 ? '+' : ''}${formatUSD(pnl)}`, color: isProfit ? 'text-neon' : 'text-crimson' },
          { label: 'P&L %', value: `${pnl >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`, color: isProfit ? 'text-neon' : 'text-crimson' },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-0.5">
            <span className="text-silver text-xs tracking-wide">{stat.label}</span>
            <span className={`font-mono font-bold text-sm ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Position count */}
      {portfolio?.positions?.length > 0 && (
        <motion.div className="relative mt-4 pt-4 border-t border-border/50"
          initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }} transition={{ delay: 1.2, duration: 0.6 }}>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-silver text-xs">{portfolio.positions.length} open position{portfolio.positions.length > 1 ? 's' : ''}</span>
            {portfolio.positions.slice(0, 5).map(pos => (
              <span key={pos.symbol} className="flex items-center gap-1.5 text-xs">
                <span className="text-cloud font-mono font-semibold">{pos.symbol}</span>
                <span className={`font-mono text-[10px] ${pos.pnl >= 0 ? 'text-neon' : 'text-crimson'}`}>
                  {pos.pnl >= 0 ? '+' : ''}{pos.pnlPercent?.toFixed(1)}%
                </span>
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
