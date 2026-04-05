import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { userApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import DeleteModal from '../ui/DeleteModal'

export default function DangerZone() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setLoading(true); setError('')
    try { await userApi.deleteAccount(user.id); logout(); navigate('/login') }
    catch (err) { setError(err.response?.data?.error || 'Account deletion failed.'); setLoading(false) }
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl border border-crimson/20 bg-crimson/[0.03] p-6 md:p-8"
        style={{ boxShadow: '0 0 0 1px rgba(255,59,92,0.08)' }}>
        <motion.div className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, rgba(255,59,92,0.12) 0%, transparent 70%)' }}
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity }} />
        <div className="relative space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-crimson/10 border border-crimson/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff3b5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-crimson">Danger Zone</h3>
              <p className="text-silver text-xs">Irreversible account actions</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-crimson/30 via-crimson/10 to-transparent" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-cloud font-medium text-sm">Delete Account</p>
              <p className="text-silver text-xs mt-0.5">Permanently delete your account and all associated data.</p>
            </div>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setModalOpen(true)}
              className="btn-danger flex-shrink-0 flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M9 6V4h6v2" />
              </svg>
              Delete Account
            </motion.button>
          </div>
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}
        </div>
      </motion.div>
      <DeleteModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleDelete} loading={loading} />
    </>
  )
}
