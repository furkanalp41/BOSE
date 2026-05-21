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
    <div className="min-h-screen bg-slate-950">
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-xl font-bold text-emerald-400 tracking-wider">BOSE</Link>
            <div className="flex gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 ${pathname === to ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <Wallet size={14} className="text-emerald-400" />
              <span className="text-sm font-mono text-emerald-400">{fmt(user?.virtual_balance ?? user?.virtualBalance)}</span>
            </div>
            <span className="text-sm text-slate-400">{user?.full_name ?? user?.fullName}</span>
            <button onClick={logout} className="p-2 text-slate-400 hover:text-red-400 transition-colors"><LogOut size={18} /></button>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
