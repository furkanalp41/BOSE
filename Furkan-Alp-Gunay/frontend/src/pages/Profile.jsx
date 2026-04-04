import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { User, Save, Trash2 } from 'lucide-react'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMsg('')
    try {
      const body = { full_name: fullName, email }
      if (password) body.password = password
      const r = await api.put('/users/profile', body)
      setUser(r.data.data || r.data.user || { ...user, full_name: fullName, email })
      setPassword('')
      setMsg('Profil guncellendi!')
      setTimeout(() => setMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Guncelleme basarisiz.')
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    try {
      await api.delete('/users/profile')
      logout()
    } catch (err) {
      setError(err.response?.data?.error || 'Hesap silinemedi.')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <User size={28} className="text-emerald-400" />
        <h1 className="text-2xl font-bold text-slate-100">Profil</h1>
      </div>

      {msg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">{msg}</div>}
      {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

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
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Yeni Sifre <span className="text-slate-600">(opsiyonel)</span></label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Degistirmek istemiyorsaniz bos birakin" />
          </div>
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white font-medium rounded-lg transition-colors inline-flex items-center gap-2">
            <Save size={16} /> {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>

      <div className="bg-slate-900 border border-red-500/20 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Tehlikeli Bolge</h2>
        <p className="text-sm text-slate-400 mb-4">Hesabinizi sildiginizde tum verileriniz kalici olarak silinir.</p>
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
