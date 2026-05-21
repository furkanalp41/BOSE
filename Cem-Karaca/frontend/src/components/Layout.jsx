import { Outlet, Link, useLocation } from 'react-router-dom'
import { TrendingUp, ListOrdered } from 'lucide-react'
import DevLoginBar from './DevLoginBar'

const navItems = [
  { to: '/market', label: 'Market', icon: TrendingUp },
  { to: '/orders', label: 'Emirlerim', icon: ListOrdered },
]

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-slate-950">
      <DevLoginBar />
      <nav className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold text-emerald-400 tracking-wider">BOSE Market</span>
            <div className="flex gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2 ${pathname === to ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
