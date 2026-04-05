import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'

const NAV_ITEMS = [
  {
    id: 'markets', label: 'Live Market', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    id: 'watchlist', label: 'Watchlists', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    id: 'alerts', label: 'Price Alerts', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
            <p className="text-silver/50 text-[10px] font-mono tracking-widest">FINTECH TERMINAL</p>
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
