import clsx from 'clsx'
import AssetChart from './AssetChart'
import { fmtPrice, fmtPct, fmtCap } from '../../lib/format'

function Stat({ label, value, highlight }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-white/40 text-[10px] font-mono uppercase tracking-wider">{label}</span>
      <span className={clsx('font-mono text-sm font-semibold', highlight ?? 'text-white')}>
        {value}
      </span>
    </div>
  )
}

export default function DetailPanel({ asset, price, history }) {
  if (!asset) {
    return (
      <div className="glass rounded-2xl flex-1 flex items-center justify-center p-8">
        <p className="text-white/25 font-mono text-sm">← Select an asset to view details</p>
      </div>
    )
  }

  const isBull = (price?.changePct ?? asset.change24h ?? 0) >= 0
  const direction = isBull ? 'up' : 'down'
  const currentPrice  = price?.price     ?? asset.price
  const currentChange = price?.changePct ?? asset.change24h

  return (
    <div
      className={clsx(
        'glass rounded-2xl flex-1 flex flex-col overflow-hidden transition-all duration-500',
        isBull ? 'border-bull/20' : 'border-bear/20',
        'border'
      )}
    >
      <div className="px-6 pt-5 pb-4 border-b border-white/5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h2 className="font-mono font-bold text-2xl text-white">{asset.symbol}</h2>
            <span className="text-white/40 text-sm font-sans">{asset.name}</span>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="font-mono font-bold text-3xl text-white">
              ${fmtPrice(currentPrice, asset.symbol)}
            </span>
            <span
              className={clsx(
                'font-mono text-sm font-semibold flex items-center gap-1',
                isBull ? 'text-bull' : 'text-bear'
              )}
            >
              <span>{isBull ? '▲' : '▼'}</span>
              {fmtPct(currentChange)}
            </span>
          </div>
        </div>

        <div
          className={clsx(
            'rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase tracking-widest shrink-0',
            isBull
              ? 'bg-bull/10 text-bull border border-bull/20 shadow-glow-bull'
              : 'bg-bear/10 text-bear border border-bear/20 shadow-glow-bear'
          )}
        >
          {isBull ? 'BULLISH' : 'BEARISH'}
        </div>
      </div>

      <div className="px-2 pt-4 pb-2" style={{ height: 260 }}>
        {history?.length > 1 ? (
          <AssetChart symbol={asset.symbol} data={history} direction={direction} />
        ) : (
          <div className="h-full flex items-center justify-center text-white/20 font-mono text-sm">
            Awaiting data…
          </div>
        )}
      </div>

      <div className="px-6 pb-5 pt-2 grid grid-cols-2 sm:grid-cols-4 gap-5 border-t border-white/5 mt-auto">
        <Stat label="Market Cap"    value={fmtCap(asset.marketCap)} />
        <Stat label="24h Volume"    value={fmtCap(asset.volume24h)} />
        <Stat label="24h Change"    value={fmtPct(asset.change24h)}
              highlight={asset.change24h >= 0 ? 'text-bull' : 'text-bear'} />
        <Stat label="Category"      value={asset.category?.toUpperCase()} />
      </div>
    </div>
  )
}
