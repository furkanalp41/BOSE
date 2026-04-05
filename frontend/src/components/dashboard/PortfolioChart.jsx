import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { tradingApi } from '../../services/api'

const COLORS = ['#00ff88', '#00cfff', '#ff3b5c', '#ffb800', '#a855f7', '#ec4899', '#06b6d4', '#f97316']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="glass px-3 py-2 rounded-lg border border-border text-xs">
      <p className="text-cloud font-mono font-bold">{d.name}</p>
      <p className="text-silver">${d.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      <p className="text-silver/60">{d.pct.toFixed(1)}% of portfolio</p>
    </div>
  )
}

export default function PortfolioChart() {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tradingApi.getPortfolio()
      .then(({ data }) => setPortfolio(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-6 md:p-8 flex justify-center items-center" style={{ minHeight: 280 }}>
        <motion.span className="block w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full"
          animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
      </motion.div>
    )
  }

  if (!portfolio || (portfolio.positions?.length === 0 && portfolio.balance === 100000)) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass p-6 md:p-8 text-center" style={{ minHeight: 280 }}>
        <div className="flex flex-col items-center justify-center h-full gap-3 py-8">
          <div className="text-4xl">📊</div>
          <p className="text-silver text-sm">Portfolio allocation chart</p>
          <p className="text-silver/40 text-xs">Start trading to see your allocation breakdown</p>
        </div>
      </motion.div>
    )
  }

  const chartData = []
  if (portfolio.balance > 0) {
    chartData.push({ name: 'Cash (USD)', value: portfolio.balance, pct: (portfolio.balance / portfolio.totalValue) * 100 })
  }
  portfolio.positions?.forEach(pos => {
    chartData.push({ name: pos.symbol, value: pos.marketValue, pct: (pos.marketValue / portfolio.totalValue) * 100 })
  })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="glass p-6 md:p-8 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-neon/10 border border-purple-500/20 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cloud">Portfolio Allocation</h3>
          <p className="text-silver text-xs">{chartData.length} segments · ${portfolio.totalValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} total</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4">
        {/* Chart */}
        <div className="w-full lg:w-1/2" style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                paddingAngle={2} dataKey="value" animationBegin={0} animationDuration={800}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 space-y-2">
          {chartData.map((d, i) => (
            <motion.div key={d.name} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-border/50">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-cloud font-mono text-xs font-semibold truncate">{d.name}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-silver font-mono text-xs">${d.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                <span className="text-silver/60 font-mono text-[10px] w-10 text-right">{d.pct.toFixed(1)}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
