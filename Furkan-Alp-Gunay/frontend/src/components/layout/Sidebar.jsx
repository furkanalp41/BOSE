import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  {
    id: 'overview', label: 'Overview', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    id: 'profile', label: 'Profile', icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
]

export default function Sidebar({ activeSection, onSectionChange }) {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <motion.aside initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      className="w-64 flex-shrink-0 glass border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
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

      {/* Nav */}
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

      {/* User footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-neon/10 border border-neon/20 flex items-center justify-center flex-shrink-0">
            <span className="text-neon font-bold text-xs">{user?.fullName?.[0]?.toUpperCase() || 'U'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-cloud text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-silver/50 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-silver hover:text-crimson hover:bg-crimson/10 border border-transparent hover:border-crimson/20 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </motion.aside>
  )
}
