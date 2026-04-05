import { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'
import AssetChart from './AssetChart'
import { fmtPrice, fmtPct } from '../../lib/format'

const CATEGORY_BADGE = {
  crypto:  { label: 'CRYPTO',  cls: 'text-brand border-brand/30 bg-brand/10' },
  bist:    { label: 'BIST',    cls: 'text-purple-400 border-purple-400/30 bg-purple-400/10' },
  nasdaq:  { label: 'NASDAQ',  cls: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
}

export default function AssetCard({ asset, price, history, selected, onSelect }) {
  const isBull = (price?.changePct ?? asset?.change24h ?? 0) >= 0
  const direction = isBull ? 'up' : 'down'
  const prevPriceRef = useRef(null)
  const [flashClass, setFlashClass] = useState('')

  useEffect(() => {
    if (price?.price == null) return
    if (prevPriceRef.current !== null && prevPriceRef.current !== price.price) {
      const cls = price.changePct >= 0 ? 'flash-bull' : 'flash-bear'
      setFlashClass(cls)
      const t = setTimeout(() => setFlashClass(''), 650)
      return () => clearTimeout(t)
    }
    prevPriceRef.current = price?.price
  }, [price?.price])

  const badge = CATEGORY_BADGE[asset?.category] ?? CATEGORY_BADGE.crypto
  const currentPrice  = price?.price     ?? asset?.price
  const currentChange = price?.changePct ?? asset?.change24h

  return (
    <button
      onClick={onSelect}
      className={clsx(
        'glass rounded-2xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-300 text-left w-full group',
        flashClass,
        selected
          ? isBull
            ? 'border-bull/40 shadow-glow-bull ring-1 ring-bull/30'
            : 'border-bear/40 shadow-glow-bear ring-1 ring-bear/30'
          : 'hover:border-white/10',
        'border'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0">
          <span className="font-mono font-bold text-white text-base leading-none tracking-wide">
            {asset?.symbol}
          </span>
          <span className="text-white/40 text-xs mt-1 truncate font-sans">{asset?.name}</span>
        </div>
        <span className={clsx('text-[9px] font-mono font-semibold border rounded px-1.5 py-0.5 shrink-0 uppercase tracking-wider', badge.cls)}>
          {badge.label}
        </span>
      </div>

      <div className="h-16 -mx-1">
        {history?.length > 1 ? (
          <AssetChart symbol={asset?.symbol} data={history} direction={direction} />
        ) : (
          <div className="h-full flex items-center justify-center text-white/20 text-xs font-mono">
            Loading…
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="font-mono font-semibold text-white text-sm leading-none">
          ${fmtPrice(currentPrice, asset?.symbol)}
        </span>
        <span
          className={clsx(
            'font-mono text-xs font-semibold px-1.5 py-0.5 rounded',
            isBull ? 'text-bull bg-bull/10' : 'text-bear bg-bear/10'
          )}
        >
          {fmtPct(currentChange)}
        </span>
      </div>
    </button>
  )
}
