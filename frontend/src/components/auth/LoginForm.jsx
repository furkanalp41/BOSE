import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import FloatingInput from '../ui/FloatingInput'
import PasswordInput from '../ui/PasswordInput'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function LoginForm() {
  const navigate = useNavigate()
  const setAuth  = useAuthStore((s) => s.setAuth)

  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
    setApiError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const { data } = await authApi.login(form)
      setAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass p-8 md:p-10">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        <motion.div variants={itemVariants}>
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <span className="font-mono font-black text-xl text-neon text-glow-neon">BOSE</span>
            <span className="text-silver text-xs tracking-widest uppercase">Trading</span>
          </div>
          <h2 className="text-3xl font-bold text-cloud">Welcome back</h2>
          <p className="mt-1 text-silver text-sm">Sign in to your trading account</p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <motion.div variants={itemVariants}>
            <FloatingInput id="email" label="Email address" type="email"
              value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PasswordInput id="password" label="Password"
              value={form.password} onChange={update('password')} error={errors.password} />
          </motion.div>

          {apiError && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-crimson/10 border border-crimson/30 text-crimson text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {apiError}
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span className="block w-4 h-4 border-2 border-void/40 border-t-void rounded-full"
                    animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </motion.div>
        </form>

        <motion.p variants={itemVariants} className="text-center text-sm text-silver">
          Don't have an account?{' '}
          <Link to="/register" className="text-neon font-semibold hover:text-glow-neon transition-all duration-200 underline-offset-2 hover:underline">
            Create one free
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
