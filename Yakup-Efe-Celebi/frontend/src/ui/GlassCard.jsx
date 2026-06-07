// Glassmorphism surface — the core go-lab card. Reused across every page.
export default function GlassCard({ className = '', glow = false, children, ...props }) {
  return (
    <div className={`glass ${glow ? 'shadow-neon-md' : ''} ${className}`} {...props}>
      {children}
    </div>
  )
}
