import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { User, Wallet, Calendar, Shield } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Hos Geldiniz, {user?.fullName}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Sanal Bakiye</p>
            <div className="p-2 bg-emerald-500/10 rounded-lg"><Wallet size={18} className="text-emerald-400" /></div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{fmt(user?.virtualBalance)}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Hesap Durumu</p>
            <div className="p-2 bg-emerald-500/10 rounded-lg"><Shield size={18} className="text-emerald-400" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-100">Aktif</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-400">Kayit Tarihi</p>
            <div className="p-2 bg-purple-500/10 rounded-lg"><Calendar size={18} className="text-purple-400" /></div>
          </div>
          <p className="text-lg font-semibold text-slate-100">{fmtDate(user?.CreatedAt)}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Hesap Bilgileri</h2>
        <div className="space-y-3">
          {[
            ['Ad Soyad', user?.fullName],
            ['Email', user?.email],
            ['Telefon', user?.phone || 'Belirtilmemis'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">{label}</span>
              <span className="text-slate-100 font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <Link to="/profile"
        className="block bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-600 transition-colors group">
        <div className="flex items-center gap-3">
          <User size={20} className="text-emerald-400" />
          <div>
            <h3 className="font-semibold text-slate-100 group-hover:text-emerald-400">Profil Yonetimi</h3>
            <p className="text-xs text-slate-400 mt-0.5">Bilgilerinizi guncelleyin veya hesabinizi silin</p>
          </div>
        </div>
      </Link>
    </div>
  )
}
