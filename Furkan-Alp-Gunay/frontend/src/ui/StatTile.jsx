// Compact label/value stat used in heroes and info grids.
export default function StatTile({ label, value, accent = 'text-cloud' }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wider text-silver">{label}</span>
      <span className={`font-mono text-sm font-bold ${accent}`}>{value}</span>
    </div>
  )
}
