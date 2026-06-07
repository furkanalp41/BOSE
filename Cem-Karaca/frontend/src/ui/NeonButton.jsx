// Neon→ice gradient CTA (primary) + ghost / danger variants.
export default function NeonButton({ variant = 'primary', className = '', children, ...props }) {
  const cls = variant === 'ghost' ? 'btn-ghost' : variant === 'danger' ? 'btn-danger' : 'btn-primary'
  return (
    <button className={`${cls} ${className}`} {...props}>
      {children}
    </button>
  )
}
