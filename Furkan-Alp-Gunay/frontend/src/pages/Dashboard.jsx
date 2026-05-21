import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">
          Hos Geldiniz, {user?.full_name}
        </h1>
        <p className="text-gray-400 mt-1">Hesap durumunuz ve hizli erisim</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <p className="text-sm text-gray-400 mb-1">Sanal Bakiye</p>
        <p className="text-4xl font-bold text-emerald-400 font-mono">
          {formatCurrency(user?.virtual_balance || 0)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400">Email</p>
          <p className="text-gray-100 mt-1">{user?.email}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400">Rol</p>
          <p className="text-gray-100 mt-1 capitalize">{user?.role}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <p className="text-sm text-gray-400">Risk Seviyesi</p>
          <p className="text-gray-100 mt-1">{user?.risk_level}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/profile"
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-600 transition-colors group"
        >
          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
            Profil Yonetimi
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Profil bilgilerinizi goruntuleyip duzenleyin
          </p>
        </Link>

        <Link
          to="/preferences"
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-600 transition-colors group"
        >
          <h3 className="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors">
            AI Tercihleri
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Yatirim stratejinizi ve risk toleransinizi ayarlayin
          </p>
        </Link>
      </div>
    </div>
  )
}
