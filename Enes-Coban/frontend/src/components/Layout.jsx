import { Outlet, Link, useLocation } from 'react-router-dom'
import { Brain, MessageCircle, ListChecks } from 'lucide-react'
import DevLoginBar from './DevLoginBar'

const navItems = [
  { to: '/analysis', label: 'Durum Raporu', icon: Brain },
  { to: '/watchlists', label: 'Izleme Listeleri', icon: ListChecks },
  { to: '/chat', label: 'AI Chat', icon: MessageCircle },
]

export default function Layout() {
  const { pathname } = useLocation()

  const linkClass = (active) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all inline-flex items-center gap-2 ${
      active ? 'bg-neon/10 text-neon shadow-neon-sm' : 'text-silver hover:text-cloud hover:bg-white/5'
    }`

  return (
    <div className="min-h-screen bg-void">
      <DevLoginBar />
      <nav className="sticky top-0 z-20 border-b border-edge/60 bg-abyss/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-mono text-xl font-black tracking-[0.25em] text-neon text-glow-neon">BOSE AI</span>
            <div className="flex gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to} className={linkClass(pathname === to)}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
