import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { User, Save, Trash2, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

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
    <div className="animate-fade-in space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <User size={28} className="text-neon" />
        <h1 className="text-2xl font-bold text-cloud">Profil</h1>
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-cloud mb-4">Bilgileri Duzenle</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <FloatingInput
            label="Ad Soyad"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <div>
            <FloatingInput
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
              className="cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-silver mt-1">Email degistirilemez</p>
          </div>
          <FloatingInput
            label={<span className="inline-flex items-center gap-1"><Phone size={14} /> Telefon</span>}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+90 5XX XXX XX XX"
          />
          <NeonButton type="submit" disabled={loading}>
            <Save size={16} /> {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </NeonButton>
        </form>
      </GlassCard>

      <GlassCard className="p-6 border-crimson/20">
        <h2 className="text-lg font-semibold text-crimson mb-2">Tehlikeli Bolge</h2>
        <p className="text-sm text-silver mb-4">Hesabinizi sildiginizde verileriniz kalici olarak kaldilir. Bu islem geri alinamaz.</p>
        {!showDelete ? (
          <NeonButton variant="danger" onClick={() => setShowDelete(true)}>
            <Trash2 size={16} /> Hesabi Sil
          </NeonButton>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-crimson">Emin misiniz?</span>
            <NeonButton variant="danger" onClick={handleDelete}>Evet, Sil</NeonButton>
            <NeonButton variant="ghost" onClick={() => setShowDelete(false)}>Iptal</NeonButton>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
