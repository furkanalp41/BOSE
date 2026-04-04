import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { User, Save, Trash2, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [loading, setLoading] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await api.put('/users/me', { fullName, phone })
      setUser(r.data.user || { ...user, fullName, phone })
      toast.success('Profil guncellendi!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Guncelleme basarisiz.')
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete('/users/me')
      toast.success('Hesap silindi.')
      logout()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Hesap silinemedi.')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <User size={28} className="text-emerald-400" />
        <h1 className="text-2xl font-bold text-slate-100">Profil</h1>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">Bilgileri Duzenle</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Ad Soyad</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input type="email" value={user?.email || ''} disabled
              className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed" />
            <p className="text-xs text-slate-600 mt-1">Email degistirilemez</p>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1 inline-flex items-center gap-1"><Phone size={14} /> Telefon</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="+90 5XX XXX XX XX" />
          </div>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2">
            <Save size={16} /> {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>

      <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Tehlikeli Bolge</h2>
        <p className="text-sm text-slate-400 mb-4">Hesabinizi sildiginizde verileriniz kalici olarak kaldilir. Bu islem geri alinamaz.</p>
        {!showDelete ? (
          <button onClick={() => setShowDelete(true)}
            className="px-5 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/30 font-medium rounded-lg transition-colors inline-flex items-center gap-2">
            <Trash2 size={16} /> Hesabi Sil
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-400">Emin misiniz?</span>
            <button onClick={handleDelete} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">Evet, Sil</button>
            <button onClick={() => setShowDelete(false)} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors">Iptal</button>
          </div>
        )}
      </div>
    </div>
  )
}
