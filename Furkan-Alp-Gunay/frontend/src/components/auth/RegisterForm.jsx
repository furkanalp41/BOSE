import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { authApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import FloatingInput from '../ui/FloatingInput'
import PasswordInput from '../ui/PasswordInput'

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const itemVariants = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } } }

export default function RegisterForm() {
  const navigate = useNavigate()
  const setAuth  = useAuthStore((s) => s.setAuth)

  const [form, setForm]       = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [errors, setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
    setApiError('')
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim())      errs.fullName = 'Full name is required'
    if (!form.email)                errs.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.password)             errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Minimum 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      await authApi.register({ fullName: form.fullName, email: form.email, password: form.password })
      setSuccess(true)
      setTimeout(async () => {
        const { data } = await authApi.login({ email: form.email, password: form.password })
        setAuth(data.token, data.user)
        navigate('/dashboard')
      }, 1200)
    } catch (err) {
      setApiError(err.response?.data?.error || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="glass p-8 md:p-10">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="w-20 h-20 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center shadow-neon-md">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-cloud">Account Created!</h3>
            <p className="text-silver text-sm">
              Your virtual wallet is loaded with <span className="text-neon font-bold">$100,000</span>.
              <br />Redirecting to your dashboard...
            </p>
            <motion.div className="w-48 h-1 rounded-full bg-border overflow-hidden mt-2">
              <motion.div className="h-full bg-gradient-to-r from-neon to-ice rounded-full"
                initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.2, ease: 'linear' }} />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="form" variants={containerVariants} initial="hidden" animate="show" exit={{ opacity: 0 }} className="space-y-7">
            <motion.div variants={itemVariants}>
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <span className="font-mono font-black text-xl text-neon text-glow-neon">BOSE</span>
                <span className="text-silver text-xs tracking-widest uppercase">Trading</span>
              </div>
              <h2 className="text-3xl font-bold text-cloud">Create account</h2>
              <p className="mt-1 text-silver text-sm">
                Start with <span className="text-neon font-semibold">$100,000</span> virtual balance
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <motion.div variants={itemVariants}>
                <FloatingInput id="fullName" label="Full name" type="text"
                  value={form.fullName} onChange={update('fullName')} error={errors.fullName} autoComplete="name" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <FloatingInput id="reg-email" label="Email address" type="email"
                  value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PasswordInput id="reg-password" label="Password"
                  value={form.password} onChange={update('password')} error={errors.password} showStrength />
              </motion.div>
              <motion.div variants={itemVariants}>
                <PasswordInput id="confirm" label="Confirm password"
                  value={form.confirm} onChange={update('confirm')} error={errors.confirm} />
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
                      Creating account...
                    </span>
                  ) : 'Create Free Account'}
                </button>
              </motion.div>
            </form>

            <motion.p variants={itemVariants} className="text-center text-sm text-silver">
              Already have an account?{' '}
              <Link to="/login" className="text-neon font-semibold hover:text-glow-neon transition-all duration-200 underline-offset-2 hover:underline">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
