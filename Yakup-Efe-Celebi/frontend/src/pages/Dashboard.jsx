import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { User, Wallet, Calendar, Shield } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

export default function Dashboard() {
  const { user } = useAuth()

  const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-cloud">Hos Geldiniz, <span className="text-neon">{user?.fullName}</span></h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-silver">Sanal Bakiye</p>
            <div className="p-2 bg-neon/10 rounded-lg"><Wallet size={18} className="text-neon" /></div>
          </div>
          <p className="text-2xl font-bold text-neon font-mono">{fmt(user?.virtualBalance)}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-silver">Hesap Durumu</p>
            <div className="p-2 bg-neon/10 rounded-lg"><Shield size={18} className="text-neon" /></div>
          </div>
          <p className="text-2xl font-bold text-cloud">Aktif</p>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-silver">Kayit Tarihi</p>
            <div className="p-2 bg-ice/10 rounded-lg"><Calendar size={18} className="text-ice" /></div>
          </div>
          <p className="text-lg font-semibold text-cloud">{fmtDate(user?.CreatedAt)}</p>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-cloud mb-4">Hesap Bilgileri</h2>
        <div className="space-y-3">
          {[
            ['Ad Soyad', user?.fullName],
            ['Email', user?.email],
            ['Telefon', user?.phone || 'Belirtilmemis'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-edge">
              <span className="text-silver">{label}</span>
              <span className="text-cloud font-medium">{value}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <Link to="/profile" className="group block">
        <GlassCard className="p-5 transition-all group-hover:-translate-y-1 group-hover:shadow-neon-md">
          <div className="flex items-center gap-3">
            <User size={20} className="text-neon" />
            <div>
              <h3 className="font-semibold text-cloud group-hover:text-neon">Profil Yonetimi</h3>
              <p className="text-xs text-silver mt-0.5">Bilgilerinizi guncelleyin veya hesabinizi silin</p>
            </div>
          </div>
        </GlassCard>
      </Link>
    </div>
  )
}
