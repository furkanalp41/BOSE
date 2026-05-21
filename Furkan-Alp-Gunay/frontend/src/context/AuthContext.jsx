import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'
import { clearAuth, getToken, getUser, setToken } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser)
  const [token, setTokenState] = useState(getToken)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    const cached = getUser()
    if (!cached) {
      setLoading(false)
      return
    }
    api.get(`/users/${cached.ID}`)
      .then((res) => {
        setUser(res.data.user)
        setToken(token, res.data.user)
      })
      .catch(() => {
        clearAuth()
        setTokenState(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { token: newToken, user: userData } = res.data
    setToken(newToken, userData)
    setTokenState(newToken)
    setUser(userData)
    return userData
  }

  const register = async (full_name, email, password) => {
    const res = await api.post('/auth/register', { full_name, email, password })
    const { token: newToken, user: userData } = res.data
    setToken(newToken, userData)
    setTokenState(newToken)
    setUser(userData)
    return userData
  }

  const logout = () => {
    clearAuth()
    setTokenState(null)
    setUser(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
    setToken(token, userData)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
