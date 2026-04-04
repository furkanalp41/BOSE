import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const checks = {
    length: password.length >= 6,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
  }
  const allPassed = Object.values(checks).every(Boolean)
  const match = password === confirm && confirm !== ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!allPassed || !match) return setError('Sifre gereksinimlerini karsilayin.')
    setLoading(true)
    try {
      await register(fullName, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Kayit basarisiz.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-wider">BOSE</h1>
          <p className="text-slate-400 mt-1 text-sm">Kripto & Borsa Simulasyon Platformu</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Kayit Ol</h2>
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Ad Soyad</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Adiniz Soyadiniz" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="ornek@email.com" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Sifre</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="En az 6 karakter" />
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {[['length','6+ karakter'],['upper','Buyuk harf'],['lower','Kucuk harf'],['digit','Rakam']].map(([k,l]) => (
                    <span key={k} className={`text-xs ${checks[k] ? 'text-emerald-400' : 'text-slate-500'}`}>{checks[k] ? '✓' : '○'} {l}</span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Sifre Tekrar</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              {confirm && !match && <p className="mt-1 text-xs text-red-400">Sifreler eslesmiyor</p>}
            </div>
            <button type="submit" disabled={loading || !allPassed || !match}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
              {loading ? 'Olusturuluyor...' : 'Kayit Ol'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Hesabiniz var mi? <Link to="/login" className="text-emerald-400 hover:text-emerald-300">Giris Yap</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
