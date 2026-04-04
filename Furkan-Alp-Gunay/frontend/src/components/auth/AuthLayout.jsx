import { motion } from 'framer-motion'
import AnimatedOrb from './AnimatedOrb'

const pageVariants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
}

export default function AuthLayout({ children }) {
  return (
    <div
      className="min-h-screen flex"
      style={{
        background: `
          radial-gradient(ellipse 55% 45% at 95% 5%,  rgba(5,46,22,0.18)  0%, transparent 60%),
          radial-gradient(ellipse 75% 65% at 85% 95%, rgba(3,30,15,0.65)  0%, rgba(1,12,6,0.25) 50%, transparent 70%),
          radial-gradient(ellipse 60% 55% at 50% 50%, rgba(4,38,18,0.35)  0%, transparent 65%),
          radial-gradient(ellipse 95% 75% at 10% 8%,  rgba(5,46,22,0.92)  0%, rgba(2,22,11,0.55) 35%, rgba(1,8,4,0.15) 60%, transparent 75%),
          #000000
        `,
      }}
    >
      <div className="hidden lg:flex lg:w-1/2 relative">
        <AnimatedOrb />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-hidden lg:border-l lg:border-green-950/30">
        <div
          className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(5,46,22,0.55) 0%, rgba(3,30,15,0.20) 40%, transparent 68%)',
          }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(4,38,18,0.45) 0%, rgba(2,20,10,0.12) 45%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,46,22,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              linear-gradient(to right,  rgba(0,0,0,0.35) 0%, transparent 18%),
              linear-gradient(to left,   rgba(0,0,0,0.25) 0%, transparent 15%),
              linear-gradient(to bottom, rgba(0,0,0,0.30) 0%, transparent 12%),
              linear-gradient(to top,    rgba(0,0,0,0.30) 0%, transparent 12%)
            `,
          }}
        />

        <motion.div
          key="auth-panel"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  )
}
