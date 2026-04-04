import { motion } from 'framer-motion'

const candles = [
  { h: 40, body: 28, up: true  },
  { h: 55, body: 35, up: false },
  { h: 32, body: 22, up: true  },
  { h: 65, body: 42, up: true  },
  { h: 48, body: 30, up: false },
  { h: 72, body: 50, up: true  },
  { h: 58, body: 38, up: true  },
  { h: 44, body: 28, up: false },
  { h: 80, body: 55, up: true  },
  { h: 62, body: 40, up: false },
]

const sparklinePath =
  'M 0 80 C 30 65, 60 90, 90 60 S 150 30, 180 50 S 240 20, 270 35 S 330 55, 360 40 S 420 10, 450 25'

export default function AnimatedOrb() {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: `
          linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 30%),
          linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, transparent 20%),
          linear-gradient(to top,    rgba(0,0,0,0.40) 0%, transparent 18%),
          radial-gradient(ellipse 80% 70% at 15% 30%, rgba(5,46,22,0.70) 0%, rgba(2,22,11,0.30) 45%, transparent 65%),
          radial-gradient(ellipse 60% 50% at 75% 70%, rgba(3,30,15,0.50) 0%, rgba(1,12,6,0.15) 50%, transparent 68%),
          #000000
        `,
      }}
    >
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(5,46,22,0.06) 0%, transparent 80%)',
        }}
      />

      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 orb"
        style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.14) 0%, rgba(3,46,22,0.07) 50%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 left-1/3 w-72 h-72 orb"
        style={{
          background: 'radial-gradient(circle, rgba(0,180,100,0.12) 0%, rgba(0,100,60,0.04) 50%, transparent 70%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-56 h-56 orb"
        style={{
          background: 'radial-gradient(circle, rgba(255,59,92,0.09) 0%, rgba(255,59,92,0.02) 50%, transparent 70%)',
          animationDelay: '4s',
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full border border-neon/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-2 h-2 rounded-full bg-neon shadow-neon-md" />
      </motion.div>

      <motion.div
        className="absolute w-60 h-60 rounded-full border border-ice/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2
                        w-1.5 h-1.5 rounded-full bg-ice shadow-ice-sm" />
      </motion.div>

      <div className="absolute bottom-36 left-8 right-8">
        <svg viewBox="0 0 450 100" className="w-full h-20 opacity-70">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#00ff88" stopOpacity="0.1" />
              <stop offset="50%"  stopColor="#00ff88" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00cfff" stopOpacity="0.6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <motion.path
            d={`${sparklinePath} L 450 100 L 0 100 Z`}
            fill="url(#lineGrad)" opacity="0.07"
            initial={{ opacity: 0 }} animate={{ opacity: 0.07 }}
            transition={{ duration: 2 }}
          />
          <motion.path
            d={sparklinePath}
            fill="none" stroke="url(#lineGrad)" strokeWidth="2" filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="450" cy="25" r="4" fill="#00ff88" filter="url(#glow)"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </svg>
      </div>

      <div className="absolute bottom-16 left-8 right-8 flex items-end justify-center gap-1.5 h-20 opacity-60">
        {candles.map((c, i) => (
          <motion.div
            key={i}
            className="flex flex-col items-center gap-px"
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: 'backOut' }}
            style={{ transformOrigin: 'bottom' }}
          >
            <div className={`w-px rounded-full ${c.up ? 'bg-neon/60' : 'bg-crimson/60'}`}
                 style={{ height: `${(c.h - c.body) / 2}px` }} />
            <div className={`w-3 rounded-sm ${c.up ? 'bg-neon/80' : 'bg-crimson/80'}`}
                 style={{ height: `${c.body}px` }} />
            <div className={`w-px rounded-full ${c.up ? 'bg-neon/60' : 'bg-crimson/60'}`}
                 style={{ height: `${(c.h - c.body) / 2}px` }} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center select-none">
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6
                     bg-gradient-to-br from-neon/20 to-ice/20 border border-neon/30 shadow-neon-md"
          animate={{ boxShadow: ['0 0 20px rgba(0,255,136,0.3)', '0 0 40px rgba(0,255,136,0.6)', '0 0 20px rgba(0,255,136,0.3)'] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <span className="font-mono font-black text-2xl text-glow-neon text-neon tracking-tighter">B</span>
        </motion.div>

        <motion.h1
          className="text-5xl font-black tracking-tight text-glow-neon text-neon mb-2"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          BOSE
        </motion.h1>

        <motion.p
          className="text-silver text-sm font-medium tracking-[0.2em] uppercase"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          AI-Powered Trading Simulation
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {[
            { label: 'BTC', value: '$67,420', up: true },
            { label: 'ETH', value: '$3,540',  up: false },
            { label: 'NVDA', value: '$875',   up: true },
          ].map((ticker) => (
            <div key={ticker.label} className="glass px-3 py-1.5 flex flex-col items-center">
              <span className="text-silver text-xs font-mono">{ticker.label}</span>
              <span className={`text-sm font-bold font-mono ${ticker.up ? 'text-neon' : 'text-crimson'}`}>
                {ticker.value}
              </span>
              <span className={`text-xs ${ticker.up ? 'text-neon' : 'text-crimson'}`}>
                {ticker.up ? '^ 2.4%' : 'v 1.1%'}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
