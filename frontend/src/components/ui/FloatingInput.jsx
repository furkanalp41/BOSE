import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FloatingInput({ id, label, type = 'text', value, onChange, error, autoComplete, icon: Icon }) {
  const [focused, setFocused] = useState(false)
  const isLifted = focused || value?.length > 0

  return (
    <div className="relative">
      {Icon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-300
                        ${focused ? 'text-neon' : 'text-silver/50'}`}>
          <Icon size={16} />
        </div>
      )}
      <input
        id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        autoComplete={autoComplete} placeholder=" "
        className={`peer input-base pt-6 pb-2 ${Icon ? 'pl-10' : 'pl-4'}
          ${error ? 'border-crimson/70 focus:border-crimson focus:shadow-crimson-sm' : ''}`}
      />
      <motion.label
        htmlFor={id}
        animate={{
          top: isLifted ? '8px' : '50%', y: isLifted ? '0%' : '-50%',
          fontSize: isLifted ? '10px' : '13px',
          color: focused ? (error ? '#ff3b5c' : '#00ff88') : '#718096',
        }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`absolute pointer-events-none font-medium tracking-wide ${Icon ? 'left-10' : 'left-4'}`}
        style={{ top: '50%', transform: 'translateY(-50%)' }}
      >
        {label}
      </motion.label>
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] rounded-b-xl"
        style={{
          background: error ? '#ff3b5c' : '#00ff88',
          boxShadow: focused ? (error ? '0 0 8px rgba(255,59,92,0.6)' : '0 0 8px rgba(0,255,136,0.6)') : 'none',
        }}
        initial={{ width: '0%' }} animate={{ width: focused ? '100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      {error && (
        <motion.p className="mt-1.5 text-crimson text-xs pl-4"
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {error}
        </motion.p>
      )}
    </div>
  )
}
