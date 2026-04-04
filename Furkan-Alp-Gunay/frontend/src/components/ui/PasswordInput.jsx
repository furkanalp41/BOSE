import { useState } from 'react'
import { motion } from 'framer-motion'
import FloatingInput from './FloatingInput'

function calcStrength(pw) {
  if (!pw) return 0
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw))   score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

const strengthMeta = [
  { label: 'Too Weak', color: '#ff3b5c',  shadow: 'rgba(255,59,92,0.5)'  },
  { label: 'Weak',     color: '#ffb800',  shadow: 'rgba(255,184,0,0.5)'  },
  { label: 'Fair',     color: '#ffb800',  shadow: 'rgba(255,184,0,0.5)'  },
  { label: 'Strong',   color: '#00ff88',  shadow: 'rgba(0,255,136,0.5)'  },
  { label: 'Very Strong', color: '#00cfff', shadow: 'rgba(0,207,255,0.5)' },
]

export default function PasswordInput({ id, label, value, onChange, error, showStrength = false }) {
  const [visible, setVisible] = useState(false)
  const strength = calcStrength(value)
  const meta     = value ? strengthMeta[strength] : null

  return (
    <div className="space-y-2">
      <div className="relative">
        <FloatingInput id={id} label={label} type={visible ? 'text' : 'password'}
          value={value} onChange={onChange} error={error}
          autoComplete={id === 'password' ? 'current-password' : 'new-password'} />
        <button type="button" tabIndex={-1} onClick={() => setVisible((v) => !v)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-silver/50 hover:text-neon transition-colors duration-200 focus:outline-none">
          {visible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {showStrength && value && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }} className="px-1">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4].map((level) => (
              <motion.div key={level} className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <motion.div className="h-full rounded-full"
                  style={{ background: level <= strength ? meta?.color : 'transparent',
                           boxShadow: level <= strength ? `0 0 6px ${meta?.shadow}` : 'none' }}
                  initial={{ width: '0%' }} animate={{ width: level <= strength ? '100%' : '0%' }}
                  transition={{ duration: 0.3, delay: (level - 1) * 0.05 }} />
              </motion.div>
            ))}
          </div>
          <p className="text-xs font-medium" style={{ color: meta?.color }}>{meta?.label}</p>
        </motion.div>
      )}
    </div>
  )
}
