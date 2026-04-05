export function fmtCap(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(2)}M`
  return `$${n.toLocaleString()}`
}

export function fmtPrice(p, symbol) {
  if (!p) return '–'
  const isCrypto = ['BTC', 'ETH', 'SOL'].includes(symbol)
  if (p >= 10000) return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  if (p >= 100)   return p.toFixed(2)
  return p.toFixed(isCrypto ? 4 : 2)
}

export function fmtPct(n) {
  if (n == null) return '–'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function fmtTime(ms) {
  return new Date(ms).toLocaleTimeString('en-US', { hour12: false })
}
