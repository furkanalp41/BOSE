import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const passwordChecks = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
  }

  const allChecksPassed = Object.values(passwordChecks).every(Boolean)
  const passwordsMatch = password === confirmPassword && confirmPassword !== ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!allChecksPassed) {
      setError('Sifre gereksinimlerini karsilayin.')
      return
    }
    if (!passwordsMatch) {
      setError('Sifreler eslesmeli.')
      return
    }

    setLoading(true)
    try {
      await register(fullName, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Kayit olusturulamadi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-400 tracking-wider">BOSE</h1>
          <p className="text-gray-400 mt-2">Borsa Simulasyonu Platformu</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Kayit Ol</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Adiniz Soyadiniz"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="En az 6 karakter"
              />
              {password && (
                <div className="mt-2 space-y-1">
                  {[
                    { key: 'length', label: 'En az 6 karakter' },
                    { key: 'uppercase', label: 'Buyuk harf' },
                    { key: 'lowercase', label: 'Kucuk harf' },
                    { key: 'digit', label: 'Rakam' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-2 text-xs">
                      <span className={passwordChecks[key] ? 'text-emerald-400' : 'text-gray-500'}>
                        {passwordChecks[key] ? '✓' : '○'}
                      </span>
                      <span className={passwordChecks[key] ? 'text-emerald-400' : 'text-gray-500'}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sifre Tekrar</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Sifrenizi tekrarlayin"
              />
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-xs text-red-400">Sifreler eslesmiyor</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !allChecksPassed || !passwordsMatch}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Hesap olusturuluyor...' : 'Kayit Ol'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Zaten bir hesabiniz var mi?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300">
              Giris Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
