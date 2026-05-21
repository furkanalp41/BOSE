import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Profil</h1>

      {message && (
        <div className="p-3 bg-emerald-900/30 border border-emerald-800 rounded-lg text-emerald-400 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100">Kisisel Bilgiler</h2>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-1.5 text-sm bg-gray-800 text-emerald-400 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Duzenle
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white rounded-lg transition-colors text-sm"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Iptal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Ad Soyad</span>
              <span className="text-gray-100">{user?.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Email</span>
              <span className="text-gray-100">{user?.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Rol</span>
              <span className="text-gray-100 capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Risk Seviyesi</span>
              <span className="text-gray-100">{user?.risk_level}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Sanal Bakiye</span>
              <span className="text-emerald-400 font-mono">
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(user?.virtual_balance || 0)}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Kayit Tarihi</span>
              <span className="text-gray-100">{formatDate(user?.CreatedAt)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-red-900/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Tehlikeli Bolge</h2>
        <p className="text-gray-400 text-sm mb-4">
          Hesabinizi silmek geri alinamaz bir islemdir. Tum verileriniz kalici olarak silinecektir.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
        >
          Hesabi Sil
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-red-400 mb-4">Hesabi Sil</h3>
            <p className="text-gray-400 text-sm mb-4">
              Bu islem geri alinamaz. Hesabiniz ve tum verileriniz kalici olarak silinecektir.
            </p>
            <label className="flex items-center gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-red-500 focus:ring-red-500"
              />
              <span className="text-sm text-gray-300">Bu islemin geri alinamaz oldugunu anliyorum</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={!deleteConfirm || deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm"
              >
                {deleting ? 'Siliniyor...' : 'Evet, Hesabimi Sil'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm(false)
                }}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Vazgec
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
