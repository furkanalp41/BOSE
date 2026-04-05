import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { userApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

export default function ProfileCard() {
  const user       = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  const [editing, setEditing] = useState(false)
  const [form, setForm]       = useState({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' })
  const [loading, setLoading] = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  const handleSave = async () => {
    setLoading(true); setError('')
    try {
      const { data } = await userApi.updateProfile(user.id, { fullName: form.fullName, phone: form.phone })
      updateUser(data); setEditing(false); setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save changes')
    } finally { setLoading(false) }
  }

  const handleCancel = () => { setForm({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' }); setEditing(false); setError('') }

  const Field = ({ label, value, editKey, type = 'text', placeholder }) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-silver text-xs font-medium tracking-widest uppercase">{label}</span>
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.input key="input" type={type} value={form[editKey]}
            onChange={(e) => setForm((f) => ({ ...f, [editKey]: e.target.value }))}
            placeholder={placeholder} className="input-base py-2.5 text-sm"
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.2 }} />
        ) : (
          <motion.p key="text" className="text-cloud font-medium text-sm py-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {value || <span className="text-silver/40 italic">Not set</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )

  return (
    <motion.div layout className="glass p-6 md:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon/20 to-ice/20 border border-neon/20 shadow-neon-sm flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-black text-neon uppercase">{user?.fullName?.[0] ?? 'U'}</span>
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-cloud">{user?.fullName}</h3>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neon/10 text-neon border border-neon/20">Active Trader</span>
          </div>
        </div>
        {!editing ? (
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setEditing(true)} className="btn-ghost text-sm px-4 py-2">Edit Profile</motion.button>
        ) : (
          <button onClick={handleCancel} className="text-silver hover:text-cloud text-sm transition-colors">Cancel</button>
        )}
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Full Name" value={user?.fullName} editKey="fullName" placeholder="Your full name" />
        <Field label="Email" value={user?.email} editKey="email" type="email" placeholder="—" />
        <Field label="Phone" value={user?.phone} editKey="phone" type="tel" placeholder="+1 XXX XXX XXXX" />
        <div className="flex flex-col gap-1.5">
          <span className="text-silver text-xs font-medium tracking-widest uppercase">Member Since</span>
          <p className="text-cloud font-medium text-sm py-1">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
          </p>
        </div>
      </div>
      {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-crimson text-sm">{error}</motion.p>}
      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <button onClick={handleSave} disabled={loading} className="btn-primary w-full h-11 text-sm">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span className="block w-3.5 h-3.5 border-2 border-void/40 border-t-void rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />Saving...
                </span>
              ) : 'Save Changes'}
            </button>
          </motion.div>
        )}
        {saved && !editing && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-neon text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            Changes saved successfully
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
