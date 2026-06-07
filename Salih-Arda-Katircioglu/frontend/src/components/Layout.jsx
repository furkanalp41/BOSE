import { Outlet, Link, useLocation } from 'react-router-dom'
import { Activity, Star, Bell } from 'lucide-react'
import DevLoginBar from './DevLoginBar'

const navItems = [
  { to: '/ticker', label: 'Canli Fiyatlar', icon: Activity },
  { to: '/watchlist', label: 'Watchlist', icon: Star },
  { to: '/alerts', label: 'Alarmlar', icon: Bell },
]

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen bg-void">
      <DevLoginBar />
      <nav className="sticky top-0 z-20 border-b border-edge/60 bg-abyss/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <span className="font-mono text-xl font-black tracking-[0.2em] text-neon text-glow-neon">BOSE Watchlist</span>
            <div className="flex gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${pathname === to ? 'bg-neon/10 text-neon shadow-neon-sm' : 'text-silver hover:text-cloud hover:bg-white/5'}`}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
