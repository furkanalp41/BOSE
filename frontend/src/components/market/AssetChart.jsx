import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { fmtTime, fmtPrice } from '../../lib/format'

function ChartTooltip({ active, payload, label, symbol }) {
  if (!active || !payload?.length) return null
  const price = payload[0]?.value
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs font-mono shadow-glass border border-white/10">
      <div className="text-white/50 mb-0.5">{fmtTime(label)}</div>
      <div className="text-white font-semibold text-sm">{fmtPrice(price, symbol)}</div>
    </div>
  )
}

export default function AssetChart({ symbol, data, direction }) {
  const isBull = direction !== 'down'

  const strokeColor  = isBull ? '#00ff88' : '#ff4466'
  const gradientId   = `grad-${symbol}`
  const glowFilter   = `glow-${symbol}`

  const prices = data.map(d => d.price)
  const minP = Math.min(...prices)
  const maxP = Math.max(...prices)
  const pad  = (maxP - minP) * 0.15 || maxP * 0.002
  const domain = [minP - pad, maxP + pad]

  return (
    <div
      className="w-full h-full"
      style={{
        filter: isBull
          ? 'drop-shadow(0 0 8px rgba(0,255,136,0.35))'
          : 'drop-shadow(0 0 8px rgba(255,68,102,0.35))',
        transition: 'filter 0.8s ease',
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0}  />
            </linearGradient>
            <filter id={glowFilter} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="t"
            tickFormatter={fmtTime}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
          />

          <YAxis
            domain={domain}
            tickFormatter={v => fmtPrice(v, symbol)}
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            width={62}
          />

          <Tooltip content={<ChartTooltip symbol={symbol} />} />

          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: strokeColor, stroke: '#0d1117', strokeWidth: 2 }}
            isAnimationActive={false}
            filter={`url(#${glowFilter})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
