// Labeled input on the glass surface. Supports an optional trailing slot (e.g. password toggle).
export default function FloatingInput({ label, trailing, className = '', ...props }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-silver">
          {label}
        </span>
      )}
      <div className="relative">
        <input className={`input-base ${trailing ? 'pr-11' : ''} ${className}`} {...props} />
        {trailing && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-silver">{trailing}</div>
        )}
      </div>
    </label>
  )
}
