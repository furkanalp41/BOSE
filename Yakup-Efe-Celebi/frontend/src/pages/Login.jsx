import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthShell from '../ui/AuthShell'
import GlassCard from '../ui/GlassCard'
import FloatingInput from '../ui/FloatingInput'
import NeonButton from '../ui/NeonButton'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Giris basarili!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'E-posta veya sifre hatali.')
    } finally { setLoading(false) }
  }

  return (
    <AuthShell>
      <div className="mb-8 text-center">
        <h1 className="font-mono text-4xl font-black tracking-[0.3em] text-neon text-glow-neon">BOSE</h1>
        <p className="mt-2 text-sm text-silver">Kullanici Yonetim Paneli</p>
      </div>

      <GlassCard className="p-8" glow>
        <h2 className="mb-6 text-xl font-semibold text-cloud">Giris Yap</h2>
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
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Sifreniz"
            trailing={
              <button type="button" onClick={() => setShow(!show)} className="transition-colors hover:text-neon">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <NeonButton type="submit" disabled={loading} className="w-full">
            {loading ? 'Giris yapiliyor...' : 'Giris Yap'}
          </NeonButton>
        </form>

        <p className="mt-6 text-center text-sm text-silver">
          Hesabiniz yok mu?{' '}
          <Link to="/register" className="font-medium text-neon hover:text-ice">Kayit Ol</Link>
        </p>
      </GlassCard>
    </AuthShell>
  )
}
