import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, User, LogOut, Wallet } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profil', icon: User },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)

  return (
    <div className="min-h-screen bg-void">
      <nav className="sticky top-0 z-20 border-b border-edge/60 bg-abyss/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="font-mono text-xl font-black tracking-[0.25em] text-neon text-glow-neon">BOSE</Link>
            <div className="flex gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 ${pathname === to ? 'bg-neon/10 text-neon shadow-neon-sm' : 'text-silver hover:text-cloud hover:bg-white/5'}`}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neon/10 border border-neon/20 rounded-lg">
              <Wallet size={14} className="text-neon" />
              <span className="text-sm font-mono text-neon">{fmt(user?.virtual_balance ?? user?.virtualBalance)}</span>
            </div>
            <span className="text-sm text-silver">{user?.full_name ?? user?.fullName}</span>
            <button onClick={logout} className="p-2 text-silver hover:text-crimson transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
