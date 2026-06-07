import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import AuthShell from '../ui/AuthShell'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
    if (!allPassed || !match) return toast.error('Sifre gereksinimlerini karsilayin.')
    setLoading(true)
    try {
      await register(fullName, email, password)
      toast.success('Kayit basarili! Simdi giris yapabilirsiniz.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Kayit basarisiz.')
    } finally { setLoading(false) }
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="font-mono text-4xl font-black tracking-[0.3em] text-neon text-glow-neon">BOSE</h1>
        <p className="mt-2 text-sm text-silver">Kullanici Yonetim Paneli</p>
      </div>

      <GlassCard className="p-8" glow>
        <h2 className="mb-6 text-xl font-semibold text-cloud">Kayit Ol</h2>
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
              <div className="mt-2 grid grid-cols-2 gap-1">
                {[['length','6+ karakter'],['upper','Buyuk harf'],['lower','Kucuk harf'],['digit','Rakam']].map(([k,l]) => (
                  <span key={k} className={`text-xs ${checks[k] ? 'text-neon' : 'text-silver'}`}>{checks[k] ? '✓' : '○'} {l}</span>
                ))}
              </div>
            )}
          </div>

          <div>
            <FloatingInput
              label="Sifre Tekrar"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            {confirm && !match && <p className="mt-1 text-xs text-crimson">Sifreler eslesmiyor</p>}
          </div>

          <NeonButton type="submit" disabled={loading || !allPassed || !match} className="w-full">
            {loading ? 'Olusturuluyor...' : 'Kayit Ol'}
          </NeonButton>
        </form>

        <p className="mt-6 text-center text-sm text-silver">
          Hesabiniz var mi?{' '}
          <Link to="/login" className="font-medium text-neon hover:text-ice">Giris Yap</Link>
        </p>
      </GlassCard>
    </AuthShell>
  )
}
