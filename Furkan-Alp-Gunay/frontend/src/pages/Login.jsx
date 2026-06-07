import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../ui/AuthShell'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Giris yapilamadi. Lutfen tekrar deneyin.')
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
        <h2 className="mb-6 text-xl font-semibold text-cloud">Giris Yap</h2>

        {error && (
          <div className="mb-4 rounded-lg border border-crimson/40 bg-crimson/10 p-3 text-sm text-crimson">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ornek@email.com"
          />

          <FloatingInput
            label="Sifre"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Sifrenizi girin"
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="transition-colors hover:text-neon"
                aria-label={showPassword ? 'Sifreyi gizle' : 'Sifreyi goster'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            }
          />

          <NeonButton type="submit" disabled={loading} className="w-full">
            {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </NeonButton>
        </form>

        <p className="mt-6 text-center text-sm text-silver">
          Hesabiniz yok mu?{' '}
          <Link to="/register" className="font-medium text-neon hover:text-ice">
            Kayit Ol
          </Link>
        </p>
      </GlassCard>
    </AuthShell>
  )
}
