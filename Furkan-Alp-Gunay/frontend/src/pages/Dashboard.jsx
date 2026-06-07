import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import GlassCard from '../ui/GlassCard'
import StatTile from '../ui/StatTile'

export default function Dashboard() {
  const { user } = useAuth()

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(amount || 0)

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-cloud">
          Hos Geldiniz, <span className="text-neon">{user?.full_name}</span>
        </h1>
        <p className="mt-1 text-sm text-silver">Hesap durumunuz ve hizli erisim</p>
      </div>

      {/* Balance hero */}
      <GlassCard className="relative overflow-hidden p-8 md:p-10" glow>
        <div
          className="orb absolute -left-16 -top-16 h-64 w-64"
          style={{ background: 'radial-gradient(circle, rgba(0,255,136,0.10) 0%, transparent 70%)' }}
        />
        <div className="relative">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse-neon rounded-full bg-neon" />
            <span className="text-xs font-medium uppercase tracking-widest text-silver">Sanal Bakiye</span>
          </div>
          <p className="font-mono text-5xl font-black text-neon text-glow-neon md:text-6xl">
            {formatCurrency(user?.virtual_balance)}
          </p>
        </div>
      </GlassCard>

      {/* Account info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <GlassCard><StatTile label="Email" value={user?.email || '—'} /></GlassCard>
        <GlassCard><StatTile label="Rol" value={user?.role || '—'} accent="text-ice" /></GlassCard>
        <GlassCard><StatTile label="Risk Seviyesi" value={user?.risk_level || '—'} accent="text-amber" /></GlassCard>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/profile" className="group">
          <GlassCard className="h-full transition-all group-hover:-translate-y-1 group-hover:shadow-neon-md">
            <h3 className="text-lg font-semibold text-cloud transition-colors group-hover:text-neon">Profil Yonetimi</h3>
            <p className="mt-1 text-sm text-silver">Profil bilgilerinizi goruntuleyip duzenleyin</p>
          </GlassCard>
        </Link>
        <Link to="/preferences" className="group">
          <GlassCard className="h-full transition-all group-hover:-translate-y-1 group-hover:shadow-neon-md">
            <h3 className="text-lg font-semibold text-cloud transition-colors group-hover:text-neon">AI Tercihleri</h3>
            <p className="mt-1 text-sm text-silver">Yatirim stratejinizi ve risk toleransinizi ayarlayin</p>
          </GlassCard>
        </Link>
      </div>
    </div>
  )
}
