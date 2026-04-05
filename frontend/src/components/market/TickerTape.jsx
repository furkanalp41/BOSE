import clsx from 'clsx'
import { fmtPrice, fmtPct } from '../../lib/format'

export default function TickerTape({ prices, assets }) {
  const items = assets.map(a => ({
    ...a,
    live: prices[a.symbol],
  }))

  return (
    <div className="overflow-hidden border-b border-white/5 bg-surface-card/60 backdrop-blur-sm">
      <div
        className="flex gap-0 whitespace-nowrap"
        style={{ animation: 'ticker-scroll 40s linear infinite' }}
      >
        {[...items, ...items].map((item, i) => {
          const price     = item.live?.price     ?? item.price
          const changePct = item.live?.changePct ?? item.change24h
          const isBull    = changePct >= 0
          return (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-5 py-2 border-r border-white/5 text-xs font-mono"
            >
              <span className="text-white/60 font-semibold">{item.symbol}</span>
              <span className="text-white">${fmtPrice(price, item.symbol)}</span>
              <span className={isBull ? 'text-bull' : 'text-bear'}>{fmtPct(changePct)}</span>
            </span>
          )
        })}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
