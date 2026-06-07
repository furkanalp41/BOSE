import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleSave = async () => {
    setError('')
    setMessage('')
    setSaving(true)

    try {
      const res = await api.put(`/users/${user.ID}`, { full_name: fullName, email })
      updateUser(res.data.user)
      setMessage('Profil basariyla guncellendi.')
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Guncelleme basarisiz oldu.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFullName(user?.full_name || '')
    setEmail(user?.email || '')
    setEditing(false)
    setError('')
    setMessage('')
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/users/${user.ID}`)
      logout()
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.error || 'Hesap silinemedi.')
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in space-y-6">
      <h1 className="text-2xl font-bold text-cloud">Profil</h1>

      {message && (
        <div className="rounded-lg border border-neon/40 bg-neon/10 p-3 text-sm text-neon">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">
          {error}
        </div>
      )}

      <GlassCard className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cloud">Kisisel Bilgiler</h2>
          {!editing && (
            <NeonButton variant="ghost" onClick={() => setEditing(true)} className="px-4 py-1.5 text-sm">
              Duzenle
            </NeonButton>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <FloatingInput
              label="Ad Soyad"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <FloatingInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex gap-3">
              <NeonButton onClick={handleSave} disabled={saving} className="text-sm">
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </NeonButton>
              <NeonButton variant="ghost" onClick={handleCancel} className="text-sm">
                Iptal
              </NeonButton>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between border-b border-edge py-2">
              <span className="text-silver">Ad Soyad</span>
              <span className="text-cloud">{user?.full_name}</span>
            </div>
            <div className="flex justify-between border-b border-edge py-2">
              <span className="text-silver">Email</span>
              <span className="text-cloud">{user?.email}</span>
            </div>
            <div className="flex justify-between border-b border-edge py-2">
              <span className="text-silver">Rol</span>
              <span className="capitalize text-cloud">{user?.role}</span>
            </div>
            <div className="flex justify-between border-b border-edge py-2">
              <span className="text-silver">Risk Seviyesi</span>
              <span className="text-cloud">{user?.risk_level}</span>
            </div>
            <div className="flex justify-between border-b border-edge py-2">
              <span className="text-silver">Sanal Bakiye</span>
              <span className="font-mono text-neon">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(user?.virtual_balance || 0)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-silver">Kayit Tarihi</span>
              <span className="text-cloud">{formatDate(user?.CreatedAt)}</span>
            </div>
          </div>
        )}
      </GlassCard>

      <GlassCard className="border-crimson/30 p-6">
        <h2 className="mb-2 text-lg font-semibold text-crimson">Tehlikeli Bolge</h2>
        <p className="mb-4 text-sm text-silver">
          Hesabinizi silmek geri alinamaz bir islemdir. Tum verileriniz kalici olarak silinecektir.
        </p>
        <NeonButton variant="danger" onClick={() => setShowDeleteModal(true)} className="text-sm">
          Hesabi Sil
        </NeonButton>
      </GlassCard>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md p-6" glow>
            <h3 className="mb-4 text-lg font-semibold text-crimson">Hesabi Sil</h3>
            <p className="mb-4 text-sm text-silver">
              Bu islem geri alinamaz. Hesabiniz ve tum verileriniz kalici olarak silinecektir.
            </p>
            <label className="mb-6 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.checked)}
                className="rounded border-edge bg-abyss text-crimson focus:ring-crimson"
              />
              <span className="text-sm text-silver">Bu islemin geri alinamaz oldugunu anliyorum</span>
            </label>
            <div className="flex gap-3">
              <NeonButton
                variant="danger"
                onClick={handleDelete}
                disabled={!deleteConfirm || deleting}
                className="text-sm"
              >
                {deleting ? 'Siliniyor...' : 'Evet, Hesabimi Sil'}
              </NeonButton>
              <NeonButton
                variant="ghost"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm(false)
                }}
                className="text-sm"
              >
                Vazgec
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
