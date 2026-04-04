import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { adminApi } from '../services/api'
import DeleteModal from '../components/ui/DeleteModal'

const LOG_ACTION_STYLES = {
  USER_LOGIN:      { color: 'text-neon',    bg: 'bg-neon/10',    border: 'border-neon/20' },
  TRADE_EXECUTED:  { color: 'text-ice',     bg: 'bg-ice/10',     border: 'border-ice/20' },
  RISK_ASSESSMENT: { color: 'text-amber',   bg: 'bg-amber/10',   border: 'border-amber/20' },
}

const TABS = [
  { id: 'logs', label: 'System Logs', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )},
  { id: 'users', label: 'User Management', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )},
  { id: 'announcements', label: 'Announcements', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
    </svg>
  )},
]

function SystemLogsTab() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    adminApi.getLogs()
      .then(({ data }) => setLogs(data.data || []))
      .catch(err => setError(err.response?.data?.error || 'Failed to load logs'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? logs : logs.filter(l => l.action === filter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'USER_LOGIN', 'TRADE_EXECUTED', 'RISK_ASSESSMENT'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all
              ${filter === f
                ? 'bg-neon/20 text-neon border border-neon/30'
                : 'text-silver/50 border border-border hover:text-silver hover:border-white/15'}`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {error && <p className="text-crimson text-sm">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-8">
          <motion.span className="block w-6 h-6 border-2 border-neon/30 border-t-neon rounded-full"
            animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No logs found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-silver text-xs font-medium tracking-widest uppercase border-b border-border">
                <th className="text-left py-3 pr-4">ID</th>
                <th className="text-left py-3 pr-4">Action</th>
                <th className="text-left py-3 pr-4">Details</th>
                <th className="text-right py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const style = LOG_ACTION_STYLES[log.action] || LOG_ACTION_STYLES.USER_LOGIN
                return (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4 text-silver font-mono text-xs">#{log.id}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${style.color} ${style.bg} ${style.border}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-cloud text-xs">{log.details}</td>
                    <td className="py-3 text-right text-silver font-mono text-xs">
                      {new Date(log.timestamp).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function UserManagementTab() {
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleRoleUpdate = async () => {
    if (!userId) return
    setLoading(true); setError(''); setMessage('')
    try {
      const { data } = await adminApi.updateUserRole(userId, role)
      setMessage(data.message || 'Role updated successfully')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update role')
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!userId) return
    setDeleteLoading(true); setError(''); setMessage('')
    try {
      const { data } = await adminApi.deleteUser(userId)
      setMessage(data.message || 'User deleted successfully')
      setDeleteModal(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user')
    } finally { setDeleteLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-silver text-xs font-medium tracking-widest uppercase">User ID</label>
        <input type="number" min="1" value={userId} onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID" className="input-base py-2.5 text-sm w-full max-w-xs" />
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Role update */}
      <div className="space-y-3">
        <p className="text-silver text-xs font-medium tracking-widest uppercase">Change Role</p>
        <div className="flex items-center gap-3">
          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="input-base py-2.5 text-sm bg-void appearance-none cursor-pointer">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleRoleUpdate} disabled={loading || !userId}
            className="btn-primary px-6 h-10 text-sm disabled:opacity-40">
            {loading ? 'Updating...' : 'Update Role'}
          </button>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Delete user */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-cloud font-medium text-sm">Delete User</p>
          <p className="text-silver text-xs mt-0.5">Permanently remove a user account</p>
        </div>
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          onClick={() => setDeleteModal(true)} disabled={!userId}
          className="btn-danger flex items-center gap-2 disabled:opacity-40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M9 6V4h6v2" />
          </svg>
          Delete
        </motion.button>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-neon text-sm font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}

      <DeleteModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={handleDelete} loading={deleteLoading} />
    </div>
  )
}

function AnnouncementsTab() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [announcements, setAnnouncements] = useState([])
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!message.trim()) return
    setLoading(true); setError('')
    try {
      const { data } = await adminApi.createAnnouncement(message.trim())
      setAnnouncements(prev => [data.data, ...prev])
      setMessage('')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create announcement')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="text-silver text-xs font-medium tracking-widest uppercase">New Announcement</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your system announcement..." rows={3}
          className="input-base py-2.5 text-sm w-full resize-none" />
        <button onClick={handleCreate} disabled={loading || !message.trim()}
          className="btn-primary px-6 h-10 text-sm disabled:opacity-40">
          {loading ? 'Creating...' : 'Publish Announcement'}
        </button>
      </div>

      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-crimson text-sm">{error}</motion.p>}

      {announcements.length > 0 && (
        <div className="space-y-3">
          <p className="text-silver text-xs font-medium tracking-widest uppercase">Published</p>
          <AnimatePresence>
            {announcements.map((ann, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-border space-y-2">
                <p className="text-cloud text-sm">{ann.announcement}</p>
                <p className="text-silver/50 text-[10px] font-mono">
                  {new Date(ann.created_at).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {announcements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-silver text-sm">No announcements yet</p>
          <p className="text-silver/50 text-xs mt-1">Create your first system announcement above</p>
        </div>
      )}
    </div>
  )
}

const TAB_COMPONENTS = {
  logs: SystemLogsTab,
  users: UserManagementTab,
  announcements: AnnouncementsTab,
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('logs')
  const ActiveTab = TAB_COMPONENTS[activeTab]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="space-y-6">
      {/* Header */}
      <div className="glass p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson/20 to-amber/10 border border-crimson/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff3b5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-cloud">Admin Panel</h3>
            <p className="text-silver text-xs">System management and oversight tools</p>
          </div>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 flex-wrap">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-neon/10 text-neon border border-neon/20 shadow-neon-sm'
                  : 'text-silver border border-border hover:text-cloud hover:border-white/15'}`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active tab content */}
      <div className="glass p-6 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <ActiveTab />
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
