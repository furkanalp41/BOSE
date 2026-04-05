import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

const NAV_ITEMS = [
  {
    id: 'portfolio', label: 'Portfolio Analysis', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'watchlist', label: 'Watchlist Analysis', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    id: 'transactions', label: 'Transaction Analysis', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1 12 5 12 9 3 15 21 19 12 23 12" />
      </svg>
    ),
  },
  {
    id: 'chat', label: 'AI Chat', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeSection, onSectionChange }) {
  const user = useAuthStore((s) => s.user)

  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      className="w-64 flex-shrink-0 glass border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon/20 to-ice/20 border border-neon/20 shadow-neon-sm flex items-center justify-center">
            <span className="text-neon font-black text-sm">B</span>
          </div>
          <div>
            <h1 className="text-cloud font-black text-base tracking-wide">BOSE</h1>
            <p className="text-silver/50 text-[10px] font-mono tracking-widest">AI ANALYSIS TERMINAL</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = activeSection === item.id
          return (
            <motion.button key={item.id} onClick={() => onSectionChange(item.id)}
              whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? 'bg-neon/10 text-neon border border-neon/20 shadow-neon-sm'
                  : 'text-silver hover:text-cloud hover:bg-white/[0.04] border border-transparent'}`}>
              <span className={active ? 'text-neon' : 'text-silver'}>{item.icon}</span>
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center flex-shrink-0">
            <span className="text-neon font-bold text-xs">{user?.fullName?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-cloud text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-silver/50 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
