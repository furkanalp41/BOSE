// Premium auth backdrop: animated cyber-grid + floating neon/ice orbs.
export default function AuthShell({ children }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-void px-4">
      <div className="absolute inset-0 cyber-grid opacity-60" />
      <div
        className="orb absolute -left-24 -top-32 h-96 w-96"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.18) 0%, transparent 70%)' }}
      />
      <div
        className="orb absolute -bottom-32 -right-24 h-96 w-96"
        style={{ background: 'radial-gradient(circle, rgba(0,207,255,0.14) 0%, transparent 70%)', animationDelay: '2s' }}
      />
      <div className="relative w-full max-w-md animate-fade-in">{children}</div>
    </div>
  )
}
