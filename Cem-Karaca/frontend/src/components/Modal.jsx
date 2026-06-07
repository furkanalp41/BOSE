import GlassCard from '../ui/GlassCard'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <GlassCard className="relative w-full max-w-md mx-4 p-6" glow>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-cloud">{title}</h3>
          <button onClick={onClose} className="text-silver hover:text-neon text-xl transition-colors">&times;</button>
        </div>
        {children}
      </GlassCard>
    </div>
  )
}
