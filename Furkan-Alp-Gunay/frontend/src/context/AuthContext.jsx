import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('bose_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.get('/users/profile')
        .then((r) => setUser(r.data.data || r.data.user || r.data))
        .catch(() => { localStorage.removeItem('bose_token'); setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const r = await api.post('/auth/login', { email, password })
    const t = r.data.token
    localStorage.setItem('bose_token', t)
    setToken(t)
  }

  const register = async (fullName, email, password) => {
    const r = await api.post('/auth/register', { full_name: fullName, email, password })
    const t = r.data.token
    localStorage.setItem('bose_token', t)
    setToken(t)
  }

  const logout = () => {
    localStorage.removeItem('bose_token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = () => {
    api.get('/users/profile').then((r) => setUser(r.data.data || r.data.user || r.data)).catch(() => {})
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
