import { useEffect, useState } from 'react'
import { FURKAN_AUTH_BASE, clearAuth, getToken, getUser, setToken } from '../lib/auth'

export default function DevLoginBar() {
  const [token, setLocalToken] = useState(getToken())
  const [user, setUser] = useState(getUser())
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const i = setInterval(() => {
      const t = getToken()
      if (t !== token) {
        setLocalToken(t)
        setUser(getUser())
      }
    }, 1000)
    return () => clearInterval(i)
  }, [token])

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch(`${FURKAN_AUTH_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.token) {
        throw new Error(data.error || 'Giriş başarısız')
      }
      setToken(data.token, data.user)
      setLocalToken(data.token)
      setUser(data.user)
      setOpen(false)
      window.location.reload()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const onLogout = () => {
    clearAuth()
    setLocalToken(null)
    setUser(null)
    window.location.reload()
  }

  if (token) {
    return (
      <div className="flex items-center justify-between border-b border-neon/30 bg-neon/10 px-4 py-1.5 text-xs text-neon">
        <span>Oturum: <strong>{user?.email ?? user?.full_name ?? 'aktif'}</strong></span>
        <button onClick={onLogout} className="underline transition-colors hover:text-ice">çıkış</button>
      </div>
    )
  }

  return (
    <div className="border-b border-amber/30 bg-amber/10 px-4 py-1.5 text-xs text-amber">
      <div className="flex items-center justify-between">
        <span>Giriş yapılmadı — istekler 401 dönecek.</span>
        <button onClick={() => setOpen((v) => !v)} className="underline transition-colors hover:text-cloud">
          {open ? 'kapat' : 'hızlı giriş'}
        </button>
      </div>
      {open && (
        <form onSubmit={onSubmit} className="mt-2 flex flex-wrap items-center gap-2">
          <input type="email" required placeholder="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-edge bg-white/5 px-2 py-1 text-xs text-cloud placeholder-silver/60 outline-none transition-colors focus:border-neon" />
          <input type="password" required placeholder="şifre" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-edge bg-white/5 px-2 py-1 text-xs text-cloud placeholder-silver/60 outline-none transition-colors focus:border-neon" />
          <button type="submit" disabled={busy}
            className="rounded bg-neon px-3 py-1 text-xs font-semibold text-void transition-shadow hover:shadow-neon-sm disabled:opacity-50">
            {busy ? '...' : 'Giriş Yap'}
          </button>
          <span className="text-silver">hedef: {FURKAN_AUTH_BASE}/auth/login</span>
          {error && <span className="text-crimson">{error}</span>}
        </form>
      )}
    </div>
  )
}
