import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../ui/AuthShell'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

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
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="font-mono text-4xl font-black tracking-[0.3em] text-neon text-glow-neon">BOSE</h1>
        <p className="mt-2 text-sm text-silver">Borsa Simulasyonu Platformu</p>
      </div>

      <GlassCard className="p-8" glow>
        <h2 className="mb-6 text-xl font-semibold text-cloud">Kayit Ol</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            label="Ad Soyad"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Adiniz Soyadiniz"
          />

          <FloatingInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ornek@email.com"
          />

          <div>
            <FloatingInput
              label="Sifre"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
                    <span className={passwordChecks[key] ? 'text-neon' : 'text-silver'}>
                      {passwordChecks[key] ? '✓' : '○'}
                    </span>
                    <span className={passwordChecks[key] ? 'text-neon' : 'text-silver'}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <FloatingInput
              label="Sifre Tekrar"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Sifrenizi tekrarlayin"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-crimson">Sifreler eslesmiyor</p>
            )}
          </div>

          <NeonButton
            type="submit"
            disabled={loading || !allChecksPassed || !passwordsMatch}
            className="w-full"
          >
            {loading ? 'Hesap olusturuluyor...' : 'Kayit Ol'}
          </NeonButton>
        </form>

        <p className="mt-6 text-center text-sm text-silver">
          Zaten bir hesabiniz var mi?{' '}
          <Link to="/login" className="font-medium text-neon hover:text-ice">
            Giris Yap
          </Link>
        </p>
      </GlassCard>
    </AuthShell>
  )
}
