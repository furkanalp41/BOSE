import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, duration = 2000, start = true) {
  const [value, setValue] = useState(0)
  const rafRef    = useRef(null)
  const startRef  = useRef(null)

  useEffect(() => {
    if (!start || target === 0) return

    const easeOut = (t) => 1 - Math.pow(1 - t, 3)

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp

      const elapsed  = timestamp - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased    = easeOut(progress)

      setValue(Math.floor(eased * target))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setValue(target)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [target, duration, start])

  return value
}
