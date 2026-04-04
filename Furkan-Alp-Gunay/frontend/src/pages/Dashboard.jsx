import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { User, Settings, Wallet } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()

  const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n || 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-100">Hos Geldiniz, {user?.full_name}</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Sanal Bakiye</p>
            <p className="text-3xl font-bold text-emerald-400 font-mono mt-1">{fmt(user?.virtual_balance)}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl"><Wallet size={24} className="text-emerald-400" /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/profile" className="block bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-600 transition-colors group">
          <User size={20} className="text-emerald-400 mb-2" />
          <h3 className="font-semibold text-slate-100 group-hover:text-emerald-400">Profil</h3>
          <p className="text-xs text-slate-400 mt-1">Hesap bilgilerini goruntule ve duzenle</p>
        </Link>
        <Link to="/preferences" className="block bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-emerald-600 transition-colors group">
          <Settings size={20} className="text-purple-400 mb-2" />
          <h3 className="font-semibold text-slate-100 group-hover:text-purple-400">AI Tercihleri</h3>
          <p className="text-xs text-slate-400 mt-1">Risk seviyesi ve yatirim vadesi ayarla</p>
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Hesap Bilgileri</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Ad Soyad</span>
            <span className="text-slate-100 font-medium">{user?.full_name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Email</span>
            <span className="text-slate-100 font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-800">
            <span className="text-slate-400">Rol</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              {user?.role || 'user'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
