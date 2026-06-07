import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profil' },
    { to: '/preferences', label: 'AI Tercihleri' },
  ]

  const isActive = (path) => location.pathname === path

  const linkClass = (active) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active ? 'bg-neon/10 text-neon shadow-neon-sm' : 'text-silver hover:text-cloud hover:bg-white/5'
    }`

  return (
    <nav className="sticky top-0 z-20 border-b border-edge/60 bg-abyss/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="font-mono text-xl font-black tracking-[0.25em] text-neon text-glow-neon">
              BOSE
            </Link>
            <div className="hidden gap-1 md:flex">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass(isActive(link.to))}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <span className="text-sm text-silver">{user?.full_name}</span>
            <button onClick={handleLogout} className="btn-ghost px-3 py-1.5 text-sm">
              Cikis Yap
            </button>
          </div>

          <button className="text-silver hover:text-neon md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="space-y-1 pb-4 md:hidden">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block ${linkClass(isActive(link.to))}`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-silver hover:bg-white/5 hover:text-neon"
            >
              Cikis Yap
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
